import { InMemoryCache, makeVar } from '@apollo/client';

export const isCreatingNewElectionVar = makeVar<boolean>(false);

/**
 * Initiate the cache with a default value for isCreatingNewElection.
 */
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isCreatingNewElection: {
          read() {
            return isCreatingNewElectionVar();
          },
        },
      },
    },
  },
});
