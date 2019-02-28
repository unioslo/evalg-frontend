import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

// import { getScreenSize, mediaQueryLg, mediaQueryMd, } from "utils/responsive";
import Loading from '../../../../components/loading';
import PrefElecVote from './PrefElecVote';
import { Election } from '../../../../interfaces';

const getElectionVotingData = gql`
  query Election($id: UUID!) {
    election(id: $id) {
      id
      meta
      mandatePeriodStart
      mandatePeriodEnd
      electionGroup {
        id
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
  electionId: string;
}

const VotingPage: React.SFC<IProps> = props => {
  return (
    <Query query={getElectionVotingData} variables={{ id: props.electionId }}>
      {({ data, loading, error }) => {
        if (loading) {
          return <Loading />;
        }
        if (error) {
          return 'Error';
        }
        const election: Election = data.election;
        const { candidateType } = election.meta;
        const { voting } = election.meta.ballotRules;
        const electionName = election.electionGroup
          ? election.electionGroup.name
          : { en: '', nb: '', nn: '' };
        if (voting === 'rank_candidates') {
          if (candidateType === 'single' || candidateType === 'single_team') {
            return <PrefElecVote election={election} electionName={electionName} />;
          } else {
            return <div>Unknown election type!</div>;
          }
        } else if (voting === 'list') {
          return <div>List election!</div>;
        } else {
          return <div>Unknown election type!</div>;
        }
      }}
    </Query>
  );
};

export default VotingPage;
