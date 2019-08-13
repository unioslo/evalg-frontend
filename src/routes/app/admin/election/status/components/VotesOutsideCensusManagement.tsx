import React from 'react';
import { Adopt } from 'react-adopt';
import { Query } from 'react-apollo';
import { Trans, useTranslation } from 'react-i18next';

import { PageExpandableSubSection } from 'components/page/PageSection';
import { ElectionGroup, IVoter } from 'interfaces';

import SelfAddedVotersMngmtTable, {
  VotersReviewTableAction,
} from './SelfAddedVotersMngmtTable';
import { searchVoters, selfAddedVoters } from 'queries';

interface PropsQuery {
  render: any;
  electionGroupId: string;
}

const getSelfAddedVoters = ({
  render,
  electionGroupId,
}: PropsQuery) => (
  <Query
    query={selfAddedVoters}
    variables={{ id: electionGroupId }}
    fetchPolicy="network-only"
  >
    {render}
  </Query>
);

const getAdminAddedRejectedVoters = ({
  render,
  electionGroupId,
}: PropsQuery) => (
  <Query
    query={searchVoters}
    variables={{
      electionGroupId: electionGroupId,
      selfAdded: false,
      reviewed: true,
      verified: false,
    }}
    fetchPolicy="network-only"
  >
    {render}
  </Query>
);

const mapper = {
  getSelfAddedVoters,
  getAdminAddedRejectedVoters,
};

interface Props {
  electionGroupId: string;
}

const VotesOutsideCensusManagement: React.FunctionComponent<Props> = props => {
  const { t } = useTranslation();

  return (
    <Adopt mapper={mapper} electionGroupId={props.electionGroupId}>
      {({ getSelfAddedVoters, getAdminAddedRejectedVoters }: any) => {

        if (getSelfAddedVoters.error || getAdminAddedRejectedVoters.error) {
          return 'Error!';
        }

        if (getSelfAddedVoters.loading || getSelfAddedVoters.loading) {
          return <Trans>census.loadingVotesOutsideCensus</Trans>;
        }

        const electionGroupData = getSelfAddedVoters.data.electionGroup as ElectionGroup;
        const notReviewedVoters: IVoter[] = [];
        const verifiedVoters: IVoter[] = [];
        const rejectedVoters: IVoter[] = []; 
        
        rejectedVoters.concat(getAdminAddedRejectedVoters.data.searchVoters);

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
      </Adopt>
  );
};

export default VotesOutsideCensusManagement;
