import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from 'components/table';
import DropdownArrowIcon from 'components/icons/DropdownArrowIcon';
import { getPersonIdTypeDisplayName } from 'utils/i18n';
import Button from 'components/button';
import Spinner from 'components/animations/Spinner';
import ActionText from 'components/actiontext';
import { IVoter } from 'interfaces';
import { refetchVoteManagementQueries } from 'queries';
import { undoReviewVoter, reviewVoter } from 'mutations';

const personForVoter = gql`
  query personForVoter($voterId: UUID!) {
    personForVoter(voterId: $voterId) {
      id
      displayName
    }
  }
`;

const styles = (theme: any) => ({
  reviewButtons: {
    display: 'flex',
    padding: '1.5rem 0',
    alignItems: 'center',
  },
  buttonSeparator: {
    width: '2rem',
  },
  voterIdentifiers: {
    paddingBottom: '1rem',
  },
  justification: {
    paddingBottom: '1rem',
  },
});

export enum VotersReviewTableAction {
  Review,
  UndoApproval,
  UndoRejection,
}

interface Props {
  voters: IVoter[];
  tableAction: VotersReviewTableAction;
  classes: Classes;
}

const SelfAddedVotersMngmtTable: React.FunctionComponent<Props> = ({
  voters,
  tableAction,
  classes,
}) => {
  const [selectedVoterId, setSelectedVoterId] = useState<string>('');

  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const handleToggleVoter = (voterId: string) => {
    if (selectedVoterId === voterId) {
      setSelectedVoterId('');
    } else {
      setSelectedVoterId(voterId);
    }
  };

  return (
    <Table marginTop="3rem">
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell width="8%" />
          <TableHeaderCell width="31%">
            <Trans>census.person</Trans>
          </TableHeaderCell>
          <TableHeaderCell width="31%">
            <Trans>election.voterGroup</Trans>
          </TableHeaderCell>
          <TableHeaderCell width="31%" />
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {voters.length === 0 ? (
          <TableRow>
            <TableCell />
            <TableCell colspan={3}>
              <em>{t('census.noPersons')}</em>
            </TableCell>
          </TableRow>
        ) : (
          voters.map((voter) => {
            const voterGroup = voter.pollbook.name[lang];
            const isSelected = voter.id === selectedVoterId;

            return (
              <Query
                query={personForVoter}
                variables={{ voterId: voter.id }}
                key={voter.id}
              >
                {({ data, loading: personForVoterLoading, error }) => {
                  let displayNameElement;

                  if (error) {
                    displayNameElement = (
                      <em>{t('admin.manageSelfAddedVoters.unknownName')}</em>
                    );
                  } else if (personForVoterLoading) {
                    displayNameElement = (
                      <em>{t('admin.manageSelfAddedVoters.loadingName')}</em>
                    );
                  } else {
                    displayNameElement = data.personForVoter.displayName ? (
                      data.personForVoter.displayName
                    ) : (
                      <em>{t('admin.manageSelfAddedVoters.unknownName')}</em>
                    );
                  }

                  return (
                    <>
                      <TableRow
                        onClick={() => handleToggleVoter(voter.id)}
                        noBorderBottom={isSelected}
                      >
                        <TableCell>
                          <DropdownArrowIcon selected={isSelected} />
                        </TableCell>
                        <TableCell>{displayNameElement}</TableCell>
                        <TableCell>{voterGroup}</TableCell>
                        <TableCell>
                          {tableAction === VotersReviewTableAction.Review && (
                            <ReviewButtons
                              voterId={voter.id}
                              selectedVoterId={selectedVoterId}
                              setSelectedVoterId={setSelectedVoterId}
                              t={t}
                              classes={classes}
                            />
                          )}
                          {(tableAction ===
                            VotersReviewTableAction.UndoApproval ||
                            tableAction ===
                              VotersReviewTableAction.UndoRejection) && (
                            <Mutation
                              mutation={undoReviewVoter}
                              variables={{ id: voter.id }}
                              refetchQueries={refetchVoteManagementQueries}
                              awaitRefetchQueries
                            >
                              {(undo, { loading }) => {
                                return (
                                  <>
                                    {loading ? (
                                      <Spinner darkStyle size="2.2rem" />
                                    ) : (
                                      <ActionText
                                        action={async (e) => {
                                          e.stopPropagation();
                                          await undo();
                                          if (selectedVoterId === voter.id) {
                                            setSelectedVoterId('');
                                          }
                                        }}
                                        bottom
                                      >
                                        {tableAction ===
                                        VotersReviewTableAction.UndoApproval
                                          ? t(
                                              'admin.manageSelfAddedVoters.undoApproval'
                                            )
                                          : t(
                                              'admin.manageSelfAddedVoters.undoRejection'
                                            )}
                                      </ActionText>
                                    )}
                                  </>
                                );
                              }}
                            </Mutation>
                          )}
                        </TableCell>
                      </TableRow>
                      {isSelected && (
                        <VoterDetails
                          voter={voter}
                          displayNameElement={displayNameElement}
                          t={t}
                          classes={classes}
                        />
                      )}
                    </>
                  );
                }}
              </Query>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

interface ReviewButtonProps {
  voterId: string;
  selectedVoterId: string;
  setSelectedVoterId: (voterId: string) => void;
  t: TFunction;
  classes: Classes;
}

const ReviewButtons: React.FunctionComponent<ReviewButtonProps> = ({
  voterId,
  selectedVoterId,
  setSelectedVoterId,
  t,
  classes,
}) => (
  <Mutation
    mutation={reviewVoter}
    refetchQueries={refetchVoteManagementQueries}
    awaitRefetchQueries
  >
    {(review, { loading }) => {
      return (
        <div className={classes.reviewButtons}>
          <Button
            text={t('admin.manageSelfAddedVoters.reject')}
            action={async (e) => {
              e.stopPropagation(); // avoid toggling voter
              await review({
                variables: {
                  id: voterId,
                  verify: false,
                },
              });
              if (selectedVoterId === voterId) {
                setSelectedVoterId('');
              }
            }}
            disabled={loading}
            height="4rem"
            secondary
          />
          <div className={classes.buttonSeparator} />
          <Button
            text={t('admin.manageSelfAddedVoters.approve')}
            action={async (e) => {
              e.stopPropagation(); // avoid toggling voter
              await review({
                variables: {
                  id: voterId,
                  verify: true,
                },
              });
              if (selectedVoterId === voterId) {
                setSelectedVoterId('');
              }
            }}
            disabled={loading}
            height="4rem"
          />
          {loading && <Spinner darkStyle marginLeft="1.4rem" size="2.2rem" />}
        </div>
      );
    }}
  </Mutation>
);

interface VoterDetailsProps {
  voter: IVoter;
  displayNameElement: React.ReactNode;
  t: TFunction;
  classes: Classes;
}

const VoterDetails: React.FunctionComponent<VoterDetailsProps> = ({
  voter,
  displayNameElement,
  t,
  classes,
}) => (
  <TableRow>
    <TableCell />
    <TableCell verticalAlignTop>
      <div className={classes.voterIdentifiers}>
        <p>
          <strong>
            <Trans>admin.manageSelfAddedVoters.idRegisteredWhenVoting</Trans>
          </strong>
        </p>
        <p>
          {getPersonIdTypeDisplayName(voter.idType, t)}: {voter.idValue}
        </p>
      </div>
    </TableCell>
    <TableCell colspan={2} verticalAlignTop>
      <div className={classes.justification}>
        <p>
          <strong>
            <Trans>admin.manageSelfAddedVoters.justification</Trans>
          </strong>
        </p>
        {voter.reason ? (
          <p>{voter.reason}</p>
        ) : (
          <p>
            <em>
              <Trans>admin.manageSelfAddedVoters.noJustificationGiven</Trans>
            </em>
          </p>
        )}
      </div>
    </TableCell>
  </TableRow>
);

export default injectSheet(styles)(SelfAddedVotersMngmtTable);
