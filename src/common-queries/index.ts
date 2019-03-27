import gql from 'graphql-tag';
import { ViewerResponse, QueryResponse } from '../interfaces';
import ApolloClient from 'apollo-client';

export const getSignedInPersonIdQuery = gql`
  query {
    signedInPerson @client {
      personId
    }
  }
`;

export async function getSignedInPersonId(
  client: ApolloClient<any>,
  onSuccess: (data: QueryResponse<ViewerResponse>) => void,
  onFailure: (error: any) => void
) {
  try {
    const person = await client.query<ViewerResponse>({
      query: getSignedInPersonIdQuery,
    });
    return onSuccess(person);
  } catch (error) {
    return onFailure(error);
  }
}
