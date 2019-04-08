import * as React from 'react';
import { Trans } from 'react-i18next';

import { Page } from '../../../../../components/page';
import ElectionStatusSection from './components/ElectionStatusSection';
import VotesSection from './components/VotesSection';
import ElectionKeySection from './components/ElectionKeySection';
import CountVotesSection from './components/CountVotesSection';
import { ElectionGroup } from '../../../../../interfaces';

interface IProps {
  electionGroup: ElectionGroup;
  refetchElectionGroupFunction: () => Promise<any>;
}

const StatusPage: React.FunctionComponent<IProps> = ({
  electionGroup,
  refetchElectionGroupFunction,
}) => {
  return (
    <Page header={<Trans>election.electionStatus</Trans>}>
      <ElectionStatusSection electionGroup={electionGroup} />
      <ElectionKeySection
        electionGroup={electionGroup}
        refetchElectionGroupFunction={refetchElectionGroupFunction}
      />
      <VotesSection electionGroup={electionGroup} />
      <CountVotesSection />
    </Page>
  );
};

export default StatusPage;
