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
import Text from '../../../../../../components/text';
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
  mutation ReviewSelfAddedVoter($voterId: UUID!, $verify: Boolean!) {
    ReviewSelfAddedVoter(voterId: $voterId, verify: $verify) {
      ok
    }
  }
`;

const undoReviewSelfAddedVoter = gql`
  mutation undoReviewSelfAddedVoter($voterId: UUID!) {
    undoReviewSelfAddedVoter(voterId: $voterId) {
      ok
    }
  }
`;

const refetchQueriesFunction = () => ['selfAddedVoters'];

const styles = (theme: any) => ({});

export enum VotersReviewTableAction {
  Review,
  Undo,
}

interface Props {
  voters: IVoter[];
  tableAction: VotersReviewTableAction;
  classes: Classes;
}

const SelfAddedVotersTable: React.FunctionComponent<Props> = ({
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
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell />
          <TableHeaderCell>
            <Trans>census.person</Trans>
          </TableHeaderCell>
          <TableHeaderCell>
            <Trans>election.voterGroup</Trans>
          </TableHeaderCell>
          <TableHeaderCell />
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {voters.map(voter => {
          const voterGroup = voter.pollbook.name[lang];
          const isSelected = voter.id === selectedVoterId;

          return (
            <>
              <TableRow key={voter.id} onClick={handleToggleVoter}>
                <TableCell>
                  <DropdownArrowIcon selected={isSelected} />
                </TableCell>
                <TableCell>
                  <Query
                    query={personForVoter}
                    variables={{ voterId: voter.id }}
                  >
                    {({ data, loading, error }) => (
                      <Text>
                        {loading && t('census.loadingName')}
                        {!loading &&
                          (data && data.personForVoter.displayName
                            ? data.displayName
                            : t('census.unknownName'))}
                      </Text>
                    )}
                  </Query>
                </TableCell>
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
                          <>
                            <Button
                              text="Avvis"
                              action={() =>
                                review({
                                  variables: {
                                    voterId: voter.id,
                                    verify: false,
                                  },
                                })
                              }
                              disabled={loading}
                              secondary
                            />
                            <Button
                              text="Godkjenn"
                              action={() =>
                                review({
                                  variables: {
                                    voterId: voter.id,
                                    verify: true,
                                  },
                                })
                              }
                              disabled={loading}
                            />
                            {loading && <Spinner darkStyle />}
                          </>
                        );
                      }}
                    </Mutation>
                  )}
                  {tableAction === VotersReviewTableAction.Undo && (
                    <Mutation
                      mutation={undoReviewSelfAddedVoter}
                      refetchQueries={refetchQueriesFunction}
                      awaitRefetchQueries
                    >
                      {(undo, { loading }) => {
                        return (
                          <>
                            {loading ? (
                              <Spinner darkStyle />
                            ) : (
                              <ActionText
                                action={() =>
                                  undo({
                                    variables: { voterId: voter.id },
                                  })
                                }
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
                  <TableCell colspan={3}>
                    <div className={classes.voterIdentifiers}>
                      <p>
                        <strong>ID registert ved stemming</strong>
                      </p>
                      <p>
                        {getVoterIdTypeDisplayName(voter.idType, t)}:{' '}
                        {voter.idValue}
                      </p>
                    </div>
                    <div className={classes.justification}>
                      <p>
                        <strong>
                          <Trans>census.justification (begrunnelse)</Trans>
                        </strong>
                      </p>
                      {voter.reason ? (
                        <p>{voter.reason}</p>
                      ) : (
                        <p>
                          <em>Ikke oppgitt</em>
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
        <TableRow />
      </TableBody>
    </Table>
  );
};

export default injectSheet(styles)(SelfAddedVotersTable);
