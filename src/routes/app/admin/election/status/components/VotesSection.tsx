import * as React from 'react';
import { Trans } from 'react-i18next';

import { ElectionGroup } from '../../../../../../interfaces';

import { PageSection } from '../../../../../../components/page';
import VotesOutsideCensusManagement from './VotesOutsideCensusManagement';

interface Props {
  electionGroup: ElectionGroup;
}

const VotesSection: React.FunctionComponent<Props> = ({ electionGroup }) => (
  <PageSection header={<Trans>election.votes</Trans>}>
    <VotesOutsideCensusManagement electionGroupId={electionGroup.id} />
  </PageSection>
);
export default VotesSection;
