import React from 'react';
import { useTranslation } from 'react-i18next';

import Link from 'components/link';
import { ElectionGroup } from 'interfaces';
import { PageSection } from 'components/page';

import VotesOutsideCensusManagement from './VotesOutsideCensusManagement';

interface Props {
  electionGroup: ElectionGroup;
  selfAddedVoters: any;
  categorizedVoters: any;
  adminAddedRejectedVoters: any;
}

export const electionsHasNotStarted = (electionGroup: ElectionGroup) => {
  return (
    electionGroup.status === 'draft' ||
    electionGroup.status === 'announced' ||
    electionGroup.status === 'published'
  );
};

const VotesSection: React.FunctionComponent<Props> = props => {
  const { t } = useTranslation();

  return (
    <PageSection header={t('election.votes')}>
      {electionsHasNotStarted(props.electionGroup) ? (
        t('election.electionNotStarted')
      ) : (
        <>
          <Link to={`/admin/elections/${props.electionGroup.id}/votingreport`}>
            {t('votingReport.link')}
          </Link>
          <VotesOutsideCensusManagement 
            selfAddedVoters={props.selfAddedVoters}
            categorizedVoters={props.categorizedVoters}
            adminAddedRejectedVoters={props.adminAddedRejectedVoters}
          />
        </>
      )}
    </PageSection>
  );
};

export default VotesSection;
