import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

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

  encryptPrivateKey = (privateKey: string, masterKey: string) => {
    return new Promise(resolve => {
      const nonce = nacl.randomBytes(nacl.box.nonceLength);
      const privateKeyUInt8Array = util.decodeBase64(privateKey);
      const masterKeyUInt8Array = util.decodeBase64(masterKey);
      const encryptedPrivateKey = nacl.box(
        privateKeyUInt8Array,
        nonce,
        masterKeyUInt8Array,
        privateKeyUInt8Array
      );
      resolve(util.encodeBase64(nonce) + ':' + util.encodeBase64(encryptedPrivateKey));
    });
  };
}

export default NaCl;
