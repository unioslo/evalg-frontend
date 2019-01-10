/* @flow */
import * as React from 'react';
import { Route } from 'react-router-dom';

import VoterFrontPage from './frontpage';
import VotingPage from './vote';
import VotingGroupSelectPage from './votingGroupSelect';

const renderVotingPage = ({ match }: any) => {
  const { electionId } = match.params;
  return <VotingPage electionId={electionId} />;
};

const renderVotingGroupSelectPage = ({ match }: any) => {
  const { electionGroupId } = match.params;
  return <VotingGroupSelectPage electionGroupId={electionGroupId} />;
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
        render={renderVotingGroupSelectPage}
      />
    </>
  );
};

export default VoterRoute;
