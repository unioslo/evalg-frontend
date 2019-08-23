import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';

export const signedInPersonQuery = gql`
  query {
    viewer {
      person {
        id
        displayName
      }
    }
  }
`;

export async function getSignedInPersonId(
  client: ApolloClient<any>
): Promise<string> {
  try {
    const res = await client.query({
      query: signedInPersonQuery,
    });
    return res.data.viewer.person.id;
  } catch (error) {
    throw error;
  }
}

export async function getSignedInPersonDisplayName(
  client: ApolloClient<any>
): Promise<string> {
  try {
    const res = await client.query({
      query: signedInPersonQuery,
    });
    return res.data.viewer.person.displayName;
  } catch (error) {
    throw error;
  }
}

export const selfAddedVotersQuery = gql`
  query electionGroupWithSelfAddedVoters($id: UUID!) {
    electionGroup(id: $id) {
      id
      elections {
        id
        active
        pollbooks {
          id
          name
          selfAddedVoters {
            id
            verifiedStatus
            idType
            idValue
            reason
            pollbook {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const searchVotersQuery = gql`
query searchVoters($electionGroupId: UUID!, 
  $selfAdded: Boolean, $reviewed: Boolean, $verified: Boolean, $hasVoted: Boolean) {
    searchVoters(electionGroupId: $electionGroupId, 
      selfAdded: $selfAdded, reviewed: $reviewed, verified: $verified, hasVoted: $hasVoted) {
        id
        pollbook {
          id
          name
        }
      }
  }
`;

export const personsWithMultipleVerifiedVotersQuery = gql`
  query personsWithMultipleVerifiedVoters($id: UUID!) {
    personsWithMultipleVerifiedVoters(id: $id) {
      person {
        id
        displayName
      }
      voters {
        id
        pollbook {
          id
          name
        }
      }
    }
  }
`;

export const refetchVoteManagementQueries = () => [
  'electionGroupWithSelfAddedVoters',
  'searchVoters',
  'personsWithMultipleVerifiedVoters',
  'turnoutCounts',
];