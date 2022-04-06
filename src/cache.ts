import { InMemoryCache, makeVar } from '@apollo/client';

import { NameFields } from 'interfaces';

type ListMsgType = {
  display: boolean;
  i18NextKey: string;
  name: NameFields;
};

export const isCreatingNewElectionVar = makeVar<boolean>(false);
export const listAddUpdateMsgVar = makeVar<ListMsgType>({
  display: false,
  i18NextKey: '',
  name: {
    en: '',
    nb: '',
    nn: '',
  },
});

export const clearListAddUpdatedMsg = () => {
  listAddUpdateMsgVar({
    display: false,
    i18NextKey: '',
    name: {
      en: '',
      nb: '',
      nn: '',
    },
  });
};

/**
 * Initiate the cache with a default values for client only fields.
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
        listAddUpdateMsg: {
          read() {
            return listAddUpdateMsgVar();
          },
        },
      },
    },
  },
});
