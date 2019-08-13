import React from 'react';
import { useTranslation } from 'react-i18next';

import Link from 'components/link';
import { ElectionGroup } from 'interfaces';
import { PageSection } from 'components/page';

import VotesOutsideCensusManagement from './VotesOutsideCensusManagement';

interface Props {
  electionGroup: ElectionGroup;
}

export const electionsHasNotStarted = (electionGroup: ElectionGroup) => {
  return (
    electionGroup.status === 'draft' ||
    electionGroup.status === 'announced' ||
    electionGroup.status === 'published'
  );
};

const VotesSection: React.FunctionComponent<Props> = ({ electionGroup }) => {
  const { t } = useTranslation();

  return (
    <PageSection header={t('election.votes')}>
      {electionsHasNotStarted(electionGroup) ? (
        t('election.electionNotStarted')
      ) : (
        <>
          <Link to={`/admin/elections/${electionGroup.id}/votingreport`}>
            {t('votingReport.link')}
          </Link>
          <VotesOutsideCensusManagement electionGroupId={electionGroup.id} />
        </>
      )}
    </PageSection>
  );
};

export default VotesSection;
