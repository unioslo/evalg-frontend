import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import Loading from 'components/loading';
import { translate } from 'react-i18next';

const getElectionGroupCensusData = gql`
  query ElectionGroupCensusData($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      description
      elections {
        id
        name
        lists {
          id
          name
        }
      }
    }
  }
`;

interface IProps {
  electionGroupId: string;
  i18n: any;
}

const CensusSelectPage: React.SFC<IProps> = props => {
  const lang = props.i18n.language;
  return (
    <Query
      query={getElectionGroupCensusData}
      variables={{ id: props.electionGroupId }}
    >
      {({ data, loading, error }) => {
        if (loading) {
          return <Loading />;
        }
        if (error) {
          return 'Error';
        }
        const electionGroup: ElectionGroup = data.electionGroup;
        const electionGroupName = electionGroup.name;
        const elections: Election[] = electionGroup.elections;
        return (
          <>
            <h2>{electionGroupName[lang]}</h2>
            {elections.map(election => (
              <p key={election.id}>{election.lists[0].name[lang]}</p>
            ))}
          </>
        );
      }}
    </Query>
  );
};

export default translate()(CensusSelectPage);
