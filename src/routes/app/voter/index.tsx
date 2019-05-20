import React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import VotingPage from './vote';

const renderVotingPage = ({
  match,
}: RouteComponentProps<{ electionGroupId: string }>) => {
  const { electionGroupId } = match.params;
  return <VotingPage electionGroupId={electionGroupId} />;
};

const VoterRoute: React.SFC = () => {
  return <Route path="/vote/:electionGroupId" render={renderVotingPage} />;
};

export default VoterRoute;
