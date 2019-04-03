import nacl from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';

const generateKeyPair = () => {
  return new Promise(resolve => {
    const keyPair = {};
    const keys = nacl.box.keyPair();
    keyPair.publicKey = encodeBase64(keys.publicKey);
    keyPair.secretKey = encodeBase64(keys.secretKey);
    resolve(keyPair);
  });
};

export const naCl = {
  generateKeyPair,
};
