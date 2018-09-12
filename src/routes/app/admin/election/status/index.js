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
};

class StatusPage extends React.Component<Props> {

  render() {
    const { electionGroup } = this.props;
    console.error('PROPS', this.props);
    return (
      <Page header={<Trans>election.electionStatus</Trans>}>
        <ElectionStatusSection
          electionGroup={electionGroup}
        />
        <ElectionKeySection
          electionGroup={electionGroup}
        />
        <VotesSection />
        <CountVotesSection />
      </Page>
    )
  }
}

export default StatusPage;