import React from 'react';
import { Trans } from 'react-i18next';

import { ElectionGroup } from '../../../../../../interfaces';

import { PageSection } from '../../../../../../components/page';
import VotesOutsideCensusManagement from './VotesOutsideCensusManagement';

interface Props {
  electionGroup: ElectionGroup;
}

const VotesSection: React.FunctionComponent<Props> = ({ electionGroup }) => {
  const electionsHasNotStarted =
    electionGroup.status === 'draft' ||
    electionGroup.status === 'announced' ||
    electionGroup.status === 'published';

  return (
    <PageSection header={<Trans>election.votes</Trans>}>
      {electionsHasNotStarted ? (
        <Trans>election.electionNotStarted</Trans>
      ) : (
        <VotesOutsideCensusManagement electionGroupId={electionGroup.id} />
      )}
    </PageSection>
  );
};

export default VotesSection;
