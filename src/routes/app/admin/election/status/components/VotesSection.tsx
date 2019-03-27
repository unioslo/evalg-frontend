import * as React from 'react';
import { Trans } from 'react-i18next';

import { ElectionGroup } from '../../../../../../interfaces';

import { PageSection } from '../../../../../../components/page';
import VotesOutsideCensusManagement from './VotesOutsideCensusManagement';

interface Props {
  electionGroup: ElectionGroup;
}

const VotesSection: React.FunctionComponent<Props> = ({ electionGroup }) => {
  const electionsHasEnded = electionGroup.status === 'closed';

  return (
    <PageSection header={<Trans>election.votes</Trans>}>
      {electionsHasEnded ? (
        <VotesOutsideCensusManagement electionGroup={electionGroup} />
      ) : (
        <Trans>election.electionNotClosed</Trans>
      )}
    </PageSection>
  );
};

export default VotesSection;
