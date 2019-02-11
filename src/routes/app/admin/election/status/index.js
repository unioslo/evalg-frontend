/* @flow */
import * as React from 'react';
import { Trans } from 'react-i18next';

import { Page } from 'components/page';
import ElectionStatusSection from './components/ElectionStatusSection';
import VotesSection from './components/VotesSection';
import ElectionKeySection from './components/ElectionKeySection';
import CountVotesSection from './components/CountVotesSection';

type Props = {
  electionGroup: ElectionGroup,
  refetchElectionGroupFunction: Function,
};

class StatusPage extends React.Component<Props> {
  render() {
    const { electionGroup, refetchElectionGroupFunction } = this.props;
    return (
      <Page header={<Trans>election.electionStatus</Trans>}>
        <ElectionStatusSection electionGroup={electionGroup} />
        <ElectionKeySection
          electionGroup={electionGroup}
          refetchElectionGroupFunction={refetchElectionGroupFunction}
        />
        <VotesSection />
        <CountVotesSection />
      </Page>
    );
  }
}

export default StatusPage;
