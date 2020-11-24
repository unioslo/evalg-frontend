import nacl from 'tweetnacl';
import { decodeBase64, encodeBase64 } from 'tweetnacl-util';

export interface IKeyPair {
  publicKey: string;
  secretKey: string;
}

class NaCl {
  generateKeyPair = () => {
    return new Promise<IKeyPair>(resolve => {
      const keys = nacl.box.keyPair();
      const keyPair: IKeyPair = {
        publicKey: encodeBase64(keys.publicKey),
        secretKey: encodeBase64(keys.secretKey),
      };
      resolve(keyPair);
    });
  };

  encryptPrivateKey = (privateKey: string, masterKey: string) => {
    return new Promise<string>(resolve => {
      const nonce = nacl.randomBytes(nacl.box.nonceLength);
      const privateKeyUInt8Array = decodeBase64(privateKey);
      const masterKeyUInt8Array = decodeBase64(masterKey);
      const encryptedPrivateKey = nacl.box(
        privateKeyUInt8Array,
        nonce,
        masterKeyUInt8Array,
        privateKeyUInt8Array
      );
      resolve(`${encodeBase64(nonce)}:${encodeBase64(encryptedPrivateKey)}`);
    });
  };
}

export default NaCl;
