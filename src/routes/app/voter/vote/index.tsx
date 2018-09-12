import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';

import PrefElecBallot from './PrefElecBallot';

const getElectionVotingData = gql`
  query Election($id: UUID!) {
    election(id: $id) {
      id
      meta
      electionGroup {
        name
      }
      lists {
        id
        name
        description
        informationUrl
        candidates {
          id
          name
          listId
          meta
          informationUrl
          priority
          preCumulated
        }
      }
    }
  }
`;

interface IProps {
  electionId: string
}

const VotingPage: React.SFC<IProps> = (props) => {
  return (
    <Query
      query={getElectionVotingData}
      variables={{ id: props.electionId }}>
      {({ data, loading, error }) => {
        if (loading || error) {
          return null;
        }
        const { election } = data;
        const { candidateType } = election.meta;
        const { voting } = election.meta.ballotRules;
        if (voting === 'rank_candidates') {
          if (candidateType === 'single') {
            return (
              <PrefElecBallot election={election} />
            )
          }
          else if (candidateType === 'single_team') {
            return (
              <div>Team Preference election!</div>
            )
          }
          else {
            return (
              <div>Unknown election type!</div>
            )
          }
        }
        else if (voting === 'list') {
          return (
            <div>List election!</div>
          )
        }
        else {
          return (
            <div>Unknown election type!</div>
          )
        }
      }}
    </Query>
  )
}

export default VotingPage;