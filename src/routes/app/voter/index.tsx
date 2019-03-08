import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import VoterFrontPage from './frontpage';
import VotingProcessPage from './vote';

const renderVotingPage = ({
  match,
}: RouteComponentProps<{ electionGroupId: string }>) => {
  const { electionGroupId } = match.params;
  return <VotingProcessPage electionGroupId={electionGroupId} />;
};

const VoterRoute: React.SFC = () => {
  return (
    <>
      <Route exact={true} path="/voter" component={VoterFrontPage} />
      <Route path="/voter/vote/:electionGroupId" render={renderVotingPage} />
    </>
  );
};

export default VoterRoute;
