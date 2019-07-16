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
