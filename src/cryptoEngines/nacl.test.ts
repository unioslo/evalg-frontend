import nacl from 'tweetnacl';
import { decodeBase64, encodeBase64 } from 'tweetnacl-util';

import NaCl, { IKeyPair } from './nacl';

describe('NaCl key creation and utils', () => {

  it('should generate valid key pair', async () => {
    const na = new NaCl();
    const keys: IKeyPair = await na.generateKeyPair();
    const { publicKey, secretKey } = nacl.box.keyPair.fromSecretKey(decodeBase64(keys.secretKey))
    expect(encodeBase64(publicKey)).toEqual(keys.publicKey);
    expect(encodeBase64(secretKey)).toEqual(keys.secretKey);
  })

  it('should correctly encrypted backup key', async () => {
    const na = new NaCl();
    const masterKeys: IKeyPair = {
      publicKey: 'YJkrB0AKMiTOOIzfiu+WwBXwPsbp+Bqy55b2/e+PGEs=',
      secretKey: 'pOe/pn+mhz5lKpo2gGbxdPWvFtCvvMBbvYxLmV2ndbA='
    }
    const keys: IKeyPair = { 
      secretKey: 'nnQjcDrXcIc8mpHabme8j7/xPBWqIkPElM8KtAJ4vgc=',
      publicKey: 'KLUDKkCPrAEcK9SrYDyMsrLEShm6axS9uSG/sOfibCA='
    }
    const encryptedPrivateKey: string = await na.encryptPrivateKey(keys.secretKey, masterKeys.publicKey)
    const splitEncrypted = encryptedPrivateKey.split(':');
    expect(splitEncrypted.length).toEqual(2);

    const [nounce, encryptedMsg] = splitEncrypted
    const decryptedKey = nacl.box.open(
      decodeBase64(encryptedMsg),
      decodeBase64(nounce),
      decodeBase64(masterKeys.publicKey),
      decodeBase64(keys.secretKey)
    )
    expect(encodeBase64(decryptedKey)).toEqual(keys.secretKey)
  })
})