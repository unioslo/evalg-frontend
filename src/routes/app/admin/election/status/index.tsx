import * as React from 'react';
import { Trans } from 'react-i18next';

import { Page } from '../../../../../components/page';
import ElectionStatusSection from './components/ElectionStatusSection';
import VotesSection from './components/VotesSection';
import ElectionKeySection from './components/ElectionKeySection';
import CountingSection from './components/CountingSection';
import { ElectionGroup } from '../../../../../interfaces';

interface IProps {
  electionGroup: ElectionGroup;
  refetchElectionGroupFunction: () => Promise<any>;
}

const StatusPage: React.FunctionComponent<IProps> = ({
  electionGroup,
  refetchElectionGroupFunction,
}) => {
  const scrollToStatusRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <Page header={<Trans>election.electionStatus</Trans>}>
        <div ref={scrollToStatusRef}></div>
        <ElectionStatusSection electionGroup={electionGroup} />
        <ElectionKeySection
          electionGroup={electionGroup}
          refetchElectionGroupFunction={refetchElectionGroupFunction}
        />
        <VotesSection electionGroup={electionGroup} />
        <CountingSection
          electionGroup={electionGroup}
          scrollToStatusRef={scrollToStatusRef}
        />
      </Page>
    </>
  );
};

export default StatusPage;
