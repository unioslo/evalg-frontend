import gql from 'graphql-tag';
import { IViwerReturn, IQueryResponse } from '../interfaces';
import ApolloClient from 'apollo-client';

const getSignedInPersonIdQuery = gql`
  query {
    signedInPerson @client {
      personId
    }
  }
`;

export async function getSignedInPersonId(
  client: ApolloClient<any>,
  onSuccess: (data: IQueryResponse<IViwerReturn>) => void,
  onFailure: (error: any) => void
) {
  try {
    const person = await client.query<IViwerReturn>({
      query: getSignedInPersonIdQuery,
    });
    return onSuccess(person);
  } catch (error) {
    return onFailure(error);
  }
}
