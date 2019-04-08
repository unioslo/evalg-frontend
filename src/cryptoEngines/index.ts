import NaCl from './nacl';

export interface IKeyPair {
  publicKey: string;
  secretKey: string;
}

export const getCryptoEngine = () => {
  return new NaCl();
};
