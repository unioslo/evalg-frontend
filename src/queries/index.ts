import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import { SignedInPersonResponse } from '../interfaces';

export const getSignedInPersonIdQuery = gql`
  query {
    signedInPerson @client {
      personId
    }
  }
`;

export async function getSignedInPersonId(
  client: ApolloClient<any>
): Promise<string> {
  try {
    const res = await client.query<SignedInPersonResponse>({
      query: getSignedInPersonIdQuery,
    });
    return res.data.signedInPerson.personId;
  } catch (error) {
    throw error;
  }
}
