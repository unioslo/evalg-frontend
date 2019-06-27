import React, { Component } from 'react';
import gql from 'graphql-tag';

import { Query, withApollo } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { History } from 'history';

import Button, { ButtonContainer } from 'components/button';
import Loading from 'components/loading';
import { Page, PageSection, PageSubSection } from 'components/page';
import { PageExpandableSubSection } from 'components/page/PageSection';
import { ElectionGroup, Election, IVoter, IPerson } from 'interfaces';
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TableBody,
  TableRow,
  TableCell,
} from 'components/table';

const getElectionGroupVotingReports = gql`
  query ElectionGroupVotingReports($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      elections {
        id
        name
        active
        pollbooks {
          id
          name
          votersWithVote {
            id
            idType
            idValue
            person {
              id
              displayName
            }
          }
          votersWithoutVote {
            id
            idType
            idValue
            person {
              id
              displayName
            }
          }
        }
      }
    }
  }
`;

interface IVotersTable {
  voters: IVoter[];
}

const VoterTable: React.FunctionComponent<IVotersTable> = ({ voters }) => {
  const { t, i18n } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell>{t('votingReport.table.name')}</TableHeaderCell>
          <TableHeaderCell>{t('votingReport.table.idValue')}</TableHeaderCell>
          <TableHeaderCell>{t('votingReport.table.idType')}</TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {voters.map((voter, i) => {
          return (
            <TableRow key={i}>
              {voter.person === null || voter.person === undefined ? (
                <TableCell />
              ) : (
                <TableCell>{voter.person.displayName}</TableCell>
              )}
              <TableCell>{voter.idValue}</TableCell>
              <TableCell>{voter.idType}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

interface IElectionVotingReportsProps {
  election: Election;
  withVotes: boolean;
}

const ElectionVotingReport: React.FunctionComponent<
  IElectionVotingReportsProps
> = ({ election, withVotes }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      {election.pollbooks.map((pollbook, i) => {
        const tot: Number =
          pollbook.votersWithVote.length + pollbook.votersWithoutVote.length;

        const nr: Number = withVotes
          ? pollbook.votersWithVote.length
          : pollbook.votersWithoutVote.length;
        const voters: IVoter[] = withVotes
          ? pollbook.votersWithVote
          : pollbook.votersWithoutVote;

        const listEmpty: string = withVotes
          ? t('votingReport.emptyWithVote')
          : t('votingReport.emptyWitoutVotes');

        return (
          <PageExpandableSubSection
            key={i}
            header={pollbook.name[i18n.language] + ' (' + nr + '/' + tot + ')'}
          >
            {voters.length === 0 ? (
              <p>{listEmpty}</p>
            ) : (
              <VoterTable voters={voters} />
            )}
          </PageExpandableSubSection>
        );
      })}
    </>
  );
};

interface IVotingReportProps {
  groupId: String;
  history: History;
}

const VotingReport: React.FunctionComponent<IVotingReportProps> = ({
  groupId,
  history,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <Page header={t('votingReport.header')}>
      <Query
        query={getElectionGroupVotingReports}
        variables={{ id: groupId }}
        fetchPolicy="network-only"
      >
        {({ data, loading, error, client }) => {
          if (loading) {
            return <Loading />;
          }
          if (error) {
            return 'Error';
          }

          const electionGroupData = data.electionGroup as ElectionGroup;

          return (
            <>
              <PageSection header={t('votingReport.withVotes')}>
                {electionGroupData.elections
                  .filter(e => e.active)
                  .map((election, i) => {
                    return (
                      <ElectionVotingReport
                        key={i}
                        election={election}
                        withVotes={true}
                      />
                    );
                  })}
              </PageSection>
              <PageSection header={t('votingReport.withoutVotes')}>
                {electionGroupData.elections
                  .filter(e => e.active)
                  .map((election, i) => {
                    return (
                      <ElectionVotingReport
                        key={i}
                        election={election}
                        withVotes={false}
                      />
                    );
                  })}
              </PageSection>
            </>
          );
        }}
      </Query>
      <ButtonContainer>
        <Button
          text={t('votingReport.back')}
          action={() => history.push('/admin/elections/' + groupId + '/status')}
          secondary={true}
        />
      </ButtonContainer>
    </Page>
  );
};

export default withApollo(VotingReport);
