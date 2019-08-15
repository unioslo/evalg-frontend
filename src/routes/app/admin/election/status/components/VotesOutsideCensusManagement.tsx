import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { PageExpandableSubSection } from 'components/page/PageSection';
import { ElectionGroup, IVoter } from 'interfaces';

import SelfAddedVotersMngmtTable, {
  VotersReviewTableAction,
} from './SelfAddedVotersMngmtTable';

interface Props {
  selfAddedVoters: any;
  categorizedVoters: any;
  adminAddedRejectedVoters: any;
}

const VotesOutsideCensusManagement: React.FunctionComponent<Props> = ({ selfAddedVoters, categorizedVoters, adminAddedRejectedVoters}) => {
  const { t } = useTranslation();

  if (
    selfAddedVoters.error ||
    adminAddedRejectedVoters.error
  ) {
    return <p>Error!</p>;
  }

  if ((selfAddedVoters.loading || adminAddedRejectedVoters.loading) || (selfAddedVoters.data === undefined )) {
    return <p><Trans>census.loadingVotesOutsideCensus</Trans></p>;
  }

  categorizedVoters.rejectedVoters.concat(adminAddedRejectedVoters.data.searchVoters);

  const votesToConsiderHeading = `${t(
    'admin.manageSelfAddedVoters.votesThatMustBeConsidered'
  )} (${categorizedVoters.notReviewedVoters.length})`;
  const approvedVotesHeading = `${t(
    'admin.manageSelfAddedVoters.votesApprovedByTheBoard'
  )} (${categorizedVoters.verifiedVoters.length})`;
  const rejectedVotesHeading = `${t(
    'admin.manageSelfAddedVoters.votesRejectedByTheBoard'
  )} (${categorizedVoters.rejectedVoters.length})`;

  return (
    <>
      <PageExpandableSubSection header={votesToConsiderHeading}>
        <SelfAddedVotersMngmtTable
          voters={categorizedVoters.notReviewedVoters}
          tableAction={VotersReviewTableAction.Review}
        />
      </PageExpandableSubSection>

      <PageExpandableSubSection header={approvedVotesHeading}>
        <SelfAddedVotersMngmtTable
          voters={categorizedVoters.verifiedVoters}
          tableAction={VotersReviewTableAction.UndoApproval}
        />
      </PageExpandableSubSection>

      <PageExpandableSubSection header={rejectedVotesHeading}>
        <SelfAddedVotersMngmtTable
          voters={categorizedVoters.rejectedVoters}
          tableAction={VotersReviewTableAction.UndoRejection}
        />
      </PageExpandableSubSection>
    </>
  );
};

export default VotesOutsideCensusManagement;
