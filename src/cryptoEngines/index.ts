import NaCl, { IKeyPair } from './nacl';

export type { IKeyPair };

export const getCryptoEngine = () => {
  return new NaCl();
};
