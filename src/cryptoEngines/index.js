import { cryptoVariant } from 'appConfig';
import { naCl } from './nacl';

export const getCryptoEngine = () => {
  if (!cryptoVariant) {
    console.error('Crypto-variant paramater not set in appConfig.js!');
  }
  if (cryptoVariant === 'nacl') {
    return naCl;
  } else {
    console.error('Unknown crypto-variant in appConfig.js');
  }
};
