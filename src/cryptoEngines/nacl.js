/* @flow */

import nacl_factory from 'js-nacl/lib/nacl_factory.js';

const generateKeyPair = () => {
  const keyPair = {};
  nacl_factory.instantiate(nacl => {
    const keys = nacl.crypto_box_keypair();
    keyPair.publicKey = nacl.to_hex(keys.boxPk);
    keyPair.secretKey = nacl.to_hex(keys.boxSk)
  });
  return keyPair;
};

export const naCl = {
  generateKeyPair
};