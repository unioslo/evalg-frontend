import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import VoterFrontPage from './frontpage';
import VotingPage from './vote';
import VoterGroupSelectPage from './voterGroupSelect';

const renderVotingPage = ({
  match,
}: RouteComponentProps<{ electionId: string }>) => {
  const { electionId } = match.params;
  return <VotingPage electionId={electionId} />;
};

const renderVoterGroupSelectPage = ({
  match,
  history,
}: RouteComponentProps<{ electionGroupId: string }>) => {
  const { electionGroupId } = match.params;
  return (
    <VoterGroupSelectPage electionGroupId={electionGroupId} history={history} />
  );
};

const VoterRoute: React.SFC = () => {
  return (
    <>
      <Route exact={true} path="/voter" component={VoterFrontPage} />
      <Route
        path="/voter/elections/:electionId/vote"
        render={renderVotingPage}
      />
      <Route
        path="/voter/election-groups/:electionGroupId/select-voting-group"
        render={renderVoterGroupSelectPage}
      />
    </>
  );
};

export default VoterRoute;
