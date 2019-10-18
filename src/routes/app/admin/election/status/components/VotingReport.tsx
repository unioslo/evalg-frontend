import React from 'react';
import gql from 'graphql-tag';

import { Query, withApollo } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { History } from 'history';

import Button, { ButtonContainer } from 'components/button';
import Loading from 'components/loading';
import { Page, PageSection } from 'components/page';
import { PageExpandableSubSection } from 'components/page/PageSection';
import { ElectionGroup, Election, IVoter } from 'interfaces';
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
          selfAddedVoters {
            id
            idType
            idValue
            reviewed
            verified
            verifiedStatus
            pollbook {
              id
              name
            }
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
  withPollbook?: boolean;
}

const VoterTable: React.FunctionComponent<IVotersTable> = ({ voters, withPollbook }) => {
  const { t, i18n } = useTranslation();
  return (
    <Table>
      <TableHeader>
        <TableHeaderRow>
          <TableHeaderCell>{t('votingReport.table.name')}</TableHeaderCell>
          {withPollbook &&
            <TableHeaderCell>{t('votingReport.table.pollbook')}</TableHeaderCell>
          }
          <TableHeaderCell>{t('votingReport.table.idValue')}</TableHeaderCell>
          <TableHeaderCell>{t('votingReport.table.idType')}</TableHeaderCell>
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {voters.map((voter, i) => {
          return (
            <TableRow key={i}>
              {voter.person === null || voter.person === undefined
                ? <TableCell />
                : <TableCell>{voter.person.displayName}</TableCell>
              }
              {withPollbook && <TableCell>{voter.pollbook.name[i18n.language]}</TableCell>}
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
        const tot: number =
          pollbook.votersWithVote.length + pollbook.votersWithoutVote.length;

        const nr: number = withVotes
          ? pollbook.votersWithVote.length
          : pollbook.votersWithoutVote.length;
        const voters: IVoter[] = withVotes
          ? pollbook.votersWithVote
          : pollbook.votersWithoutVote;

        let listEmpty = ''
        let header = ''
        if (tot === 0) {
          header = pollbook.name[i18n.language] + ' (' + t('votingReport.emptyPollbook') + ')'
          listEmpty = t('votingReport.emptyPollbook')
        } else {
          header = pollbook.name[i18n.language] + ' ' + t(withVotes ? 'votingReport.ofTotalWithVotes' : 'votingReport.ofTotalWithoutVotes', { nr: nr, total: tot })
          listEmpty = t('votingReport.noVoters')
        }
        return (
          <PageExpandableSubSection key={i} header={header}>
            {voters.length === 0
              ? <p>{listEmpty}</p>
              : <VoterTable voters={voters} />
            }
          </PageExpandableSubSection>
        );
      })}
    </>
  );
};

interface ReviewedVotersReportProps {
  electionGroup: ElectionGroup;
}

const ReviewedVotersReport: React.FunctionComponent<ReviewedVotersReportProps> = ({ electionGroup }) => {
  const { t } = useTranslation();
  const selfAddedVoters = electionGroup.elections
    .filter(e => e.active)
    .flatMap(e => e.pollbooks)
    .flatMap(p => p.selfAddedVoters)
  const verifiedVoters = selfAddedVoters
    .filter(voter => voter.verifiedStatus === 'SELF_ADDED_VERIFIED')
  const rejectedVoters = selfAddedVoters
    .filter(voter => voter.verifiedStatus === 'SELF_ADDED_REJECTED')

  return (
    <PageSection header={t('votingReport.processedSelfAddedVoters')}>
      <PageExpandableSubSection
        header={t('votingReport.approvedSelfAddedVoters', { nr: verifiedVoters.length })}>
        {verifiedVoters.length > 0
          ? <VoterTable withPollbook voters={verifiedVoters} />
          : <p>{t('votingReport.noVoters')}</p>
        }
      </PageExpandableSubSection>
      <PageExpandableSubSection
        header={t('votingReport.rejectedSelfAddedVoters', { nr: rejectedVoters.length })}>
        {rejectedVoters.length > 0
          ? <VoterTable withPollbook voters={rejectedVoters} />
          : <p>{t('votingReport.noVoters')}</p>
        }
      </PageExpandableSubSection>
    </PageSection>
  )
}

interface IVotingReportProps {
  groupId: String;
  history: History;
}

const VotingReport: React.FunctionComponent<IVotingReportProps> = ({
  groupId,
  history,
}) => {
  const { t } = useTranslation();
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
                        withVotes
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
              <ReviewedVotersReport electionGroup={electionGroupData} />
            </>
          );
        }}
      </Query>
      <ButtonContainer>
        <Button
          text={t('votingReport.back')}
          action={() => history.push('/admin/elections/' + groupId + '/status')}
          secondary
        />
      </ButtonContainer>
    </Page>
  );
};

export default withApollo(VotingReport);
