import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Trans, useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { IVoter } from '../../../../../../interfaces';

import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '../../../../../../components/table';
import DropdownArrowIcon from '../../../../../../components/icons/DropdownArrowIcon';
import { getVoterIdTypeDisplayName } from '../../../../../../utils/i18n';
import { Mutation, Query } from 'react-apollo';
import Button from '../../../../../../components/button';
import Spinner from '../../../../../../components/animations/Spinner';
import ActionText from '../../../../../../components/actiontext';

const personForVoter = gql`
  query personForVoter($voterId: UUID!) {
    personForVoter(voterId: $voterId) {
      id
      displayName
      principals {
        principalId
        principalType
      }
    }
  }
`;

const reviewSelfAddedVoter = gql`
  mutation reviewSelfAddedVoter($id: UUID!, $verify: Boolean!) {
    reviewSelfAddedVoter(id: $id, verify: $verify) {
      ok
    }
  }
`;

const undoReviewSelfAddedVoter = gql`
  mutation undoReviewSelfAddedVoter($id: UUID!) {
    undoReviewSelfAddedVoter(id: $id) {
      ok
    }
  }
`;

const refetchQueriesFunction = () => ['electionGroupWithSelfAddedVoters'];

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
  Undo,
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
          voters.map(voter => {
            const voterGroup = voter.pollbook.name[lang];
            const isSelected = voter.id === selectedVoterId;

            return (
              <Query
                query={personForVoter}
                variables={{ voterId: voter.id }}
                key={voter.id}
              >
                {({ data, loading: personForVoterLoading }) => {
                  const displayNameElement = personForVoterLoading ? (
                    <em>{t('admin.manageSelfAddedVoters.loadingName')}</em>
                  ) : data.personForVoter.displayName ? (
                    data.personForVoter.displayName
                  ) : (
                    t('admin.manageSelfAddedVoters.unknownName')
                  );

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
                            <Mutation
                              mutation={reviewSelfAddedVoter}
                              refetchQueries={refetchQueriesFunction}
                              awaitRefetchQueries
                            >
                              {(review, { loading }) => {
                                return (
                                  <div className={classes.reviewButtons}>
                                    <Button
                                      text={t(
                                        'admin.manageSelfAddedVoters.reject'
                                      )}
                                      action={async e => {
                                        e.stopPropagation(); // avoid toggling voter
                                        await review({
                                          variables: {
                                            id: voter.id,
                                            verify: false,
                                          },
                                        });
                                        if (selectedVoterId === voter.id) {
                                          setSelectedVoterId('');
                                        }
                                      }}
                                      disabled={loading}
                                      height="4rem"
                                      secondary
                                    />
                                    <div className={classes.buttonSeparator} />
                                    <Button
                                      text={t(
                                        'admin.manageSelfAddedVoters.approve'
                                      )}
                                      action={async e => {
                                        e.stopPropagation(); // avoid toggling voter
                                        await review({
                                          variables: {
                                            id: voter.id,
                                            verify: true,
                                          },
                                        });
                                        if (selectedVoterId === voter.id) {
                                          setSelectedVoterId('');
                                        }
                                      }}
                                      disabled={loading}
                                      height="4rem"
                                    />
                                    {loading && (
                                      <Spinner
                                        darkStyle
                                        marginLeft="1.4rem"
                                        size="2.2rem"
                                      />
                                    )}
                                  </div>
                                );
                              }}
                            </Mutation>
                          )}
                          {tableAction === VotersReviewTableAction.Undo && (
                            <Mutation
                              mutation={undoReviewSelfAddedVoter}
                              variables={{ id: voter.id }}
                              refetchQueries={refetchQueriesFunction}
                              awaitRefetchQueries
                            >
                              {(undo, { loading }) => {
                                return (
                                  <>
                                    {loading ? (
                                      <Spinner darkStyle size="2.2rem" />
                                    ) : (
                                      <ActionText
                                        action={async e => {
                                          e.stopPropagation();
                                          await undo();
                                          if (selectedVoterId === voter.id) {
                                            setSelectedVoterId('');
                                          }
                                        }}
                                        bottom
                                      >
                                        Angre
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
                        <TableRow>
                          <TableCell />
                          <TableCell verticalAlignTop>
                            <div className={classes.voterIdentifiers}>
                              <p>
                                <strong>
                                  <Trans>
                                    admin.manageSelfAddedVoters.idRegisteredWhenVoting
                                  </Trans>
                                </strong>
                              </p>
                              <p>
                                {getVoterIdTypeDisplayName(voter.idType, t)}:{' '}
                                {voter.idValue}
                                <br />
                                <Trans>
                                  admin.manageSelfAddedVoters.displayName
                                </Trans>
                                : {displayNameElement}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell colspan={2} verticalAlignTop>
                            <div className={classes.justification}>
                              <p>
                                <strong>
                                  <Trans>
                                    admin.manageSelfAddedVoters.justification
                                  </Trans>
                                </strong>
                              </p>
                              {voter.reason ? (
                                <p>{voter.reason}</p>
                              ) : (
                                <p>
                                  <em>
                                    <Trans>
                                      admin.manageSelfAddedVoters.noJustificationGiven
                                    </Trans>
                                  </em>
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
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

export default injectSheet(styles)(SelfAddedVotersMngmtTable);
