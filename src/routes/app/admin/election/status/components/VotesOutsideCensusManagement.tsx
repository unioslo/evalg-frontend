import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Trans, useTranslation } from 'react-i18next';

import { PageExpandableSubSection } from 'components/page/PageSection';
import { ElectionGroup, IVoter } from 'interfaces';

import SelfAddedVotersMngmtTable, {
  VotersReviewTableAction,
} from './SelfAddedVotersMngmtTable';

const selfAddedVoters = gql`
  query electionGroupWithSelfAddedVoters($id: UUID!) {
    electionGroup(id: $id) {
      id
      elections {
        id
        active
        pollbooks {
          id
          name
          selfAddedVoters {
            id
            verifiedStatus
            idType
            idValue
            reason
            pollbook {
              id
              name
            }
          }
        }
      }
    }
  }
`;

interface Props {
  electionGroupId: string;
}

const VotesOutsideCensusManagement: React.FunctionComponent<Props> = props => {
  const { t } = useTranslation();

  return (
    <Query query={selfAddedVoters} variables={{ id: props.electionGroupId }}>
      {({ data, loading, error }) => {
        if (error) {
          return 'Error!';
        }

        if (loading) {
          return <Trans>census.loadingVotesOutsideCensus</Trans>;
        }

        const electionGroupData = data.electionGroup as ElectionGroup;
        const notReviewedVoters: IVoter[] = [];
        const verifiedVoters: IVoter[] = [];
        const rejectedVoters: IVoter[] = [];

        electionGroupData.elections
          .filter(e => e.active)
          .forEach(election => {
            election.pollbooks.forEach(pollbook => {
              pollbook.selfAddedVoters.forEach(selfAddedVoter => {
                switch (selfAddedVoter.verifiedStatus) {
                  case 'SELF_ADDED_NOT_REVIEWED':
                    notReviewedVoters.push(selfAddedVoter);
                    break;
                  case 'SELF_ADDED_VERIFIED':
                    verifiedVoters.push(selfAddedVoter);
                    break;
                  case 'SELF_ADDED_REJECTED':
                    rejectedVoters.push(selfAddedVoter);
                    break;
                }
              });
            });
          });

        const votesToConsiderHeading = `${t(
          'admin.manageSelfAddedVoters.votesThatMustBeConsidered'
        )} (${notReviewedVoters.length})`;
        const approvedVotesHeading = `${t(
          'admin.manageSelfAddedVoters.votesApprovedByTheBoard'
        )} (${verifiedVoters.length})`;
        const rejectedVotesHeading = `${t(
          'admin.manageSelfAddedVoters.votesRejectedByTheBoard'
        )} (${rejectedVoters.length})`;

        return (
          <>
            <PageExpandableSubSection header={votesToConsiderHeading}>
              <SelfAddedVotersMngmtTable
                voters={notReviewedVoters}
                tableAction={VotersReviewTableAction.Review}
              />
            </PageExpandableSubSection>

            <PageExpandableSubSection header={approvedVotesHeading}>
              <SelfAddedVotersMngmtTable
                voters={verifiedVoters}
                tableAction={VotersReviewTableAction.UndoApproval}
              />
            </PageExpandableSubSection>

            <PageExpandableSubSection header={rejectedVotesHeading}>
              <SelfAddedVotersMngmtTable
                voters={rejectedVoters}
                tableAction={VotersReviewTableAction.UndoRejection}
              />
            </PageExpandableSubSection>
          </>
        );
      }}
    </Query>
  );
};

export default VotesOutsideCensusManagement;
