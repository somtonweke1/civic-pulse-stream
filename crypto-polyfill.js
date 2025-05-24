import { webcrypto } from 'node:crypto';

if (!global.crypto) {
  global.crypto = webcrypto;
}

if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = function getRandomValues(array) {
    const bytes = webcrypto.getRandomValues(new Uint8Array(array.length));
    array.set(bytes);
    return array;
  };
} 