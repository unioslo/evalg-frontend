/* @flow */
import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { authEnabled } from 'appConfig';
import VoterFrontPage from './frontpage';
import VotingPage from './vote';
import VoterGroupSelectPage from './voterGroupSelect';

const renderVotingPage = ({ match }: any) => {
  const { electionId } = match.params;
  return <VotingPage electionId={electionId} />;
};

const renderVoterGroupSelectPage = ({ match }: any) => {
  const { electionGroupId } = match.params;
  return <VoterGroupSelectPage electionGroupId={electionGroupId} />;
};

const VoterRoute: React.SFC = () => {
  const userRoles: string[] = [];
  if (authEnabled && (!userRoles || userRoles.indexOf('voter') === -1)) {
    return <Redirect to="/login" />;
  }
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
