import { Buffer } from 'buffer';
import crypto from 'crypto-browserify';

window.Buffer = Buffer;
window.crypto = crypto;

// Polyfill for crypto module that works with window.crypto
const cryptoPolyfill = {
  getRandomValues: (array) => {
    return window.crypto.getRandomValues(array);
  },
  randomBytes: (size) => {
    const array = new Uint8Array(size);
    window.crypto.getRandomValues(array);
    return array;
  },
  createHash: () => {
    throw new Error('createHash is not supported in browser environments');
  },
  createHmac: () => {
    throw new Error('createHmac is not supported in browser environments');
  },
  createCipheriv: () => {
    throw new Error('createCipheriv is not supported in browser environments');
  },
  createDecipheriv: () => {
    throw new Error('createDecipheriv is not supported in browser environments');
  },
  createSign: () => {
    throw new Error('createSign is not supported in browser environments');
  },
  createVerify: () => {
    throw new Error('createVerify is not supported in browser environments');
  },
  createDiffieHellman: () => {
    throw new Error('createDiffieHellman is not supported in browser environments');
  },
  createECDH: () => {
    throw new Error('createECDH is not supported in browser environments');
  },
  timingSafeEqual: () => {
    throw new Error('timingSafeEqual is not supported in browser environments');
  }
};

export default cryptoPolyfill; 