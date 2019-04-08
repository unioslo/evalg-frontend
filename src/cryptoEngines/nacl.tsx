import nacl from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';
import { IKeyPair } from './';

class NaCl {
  generateKeyPair = () => {
    return new Promise(resolve => {
      const keys = nacl.box.keyPair();
      const keyPair: IKeyPair = {
        publicKey: encodeBase64(keys.publicKey),
        secretKey: encodeBase64(keys.secretKey),
      };
      resolve(keyPair);
    });
  };
}

export default NaCl;
