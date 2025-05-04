const crypto = require('crypto');
const originalRequire = require('module').prototype.require;

// Create a monkey patch for crypto
const randomBytesFunction = (size) => {
  return crypto.randomBytes(size);
};

// Override the require function to patch modules that use crypto
require('module').prototype.require = function(id) {
  const result = originalRequire.apply(this, arguments);
  
  // If this is the crypto module or a module that might use crypto
  if (id === 'crypto' || id.includes('crypto')) {
    if (result && !result.getRandomValues) {
      result.getRandomValues = function(typedArray) {
        const bytes = randomBytesFunction(typedArray.length);
        typedArray.set(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength));
        return typedArray;
      };
    }
  }
  
  return result;
};

// Ensure global.crypto has getRandomValues
if (typeof global.crypto === 'object') {
  if (!global.crypto.getRandomValues) {
    global.crypto.getRandomValues = function(typedArray) {
      const bytes = randomBytesFunction(typedArray.length);
      typedArray.set(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength));
      return typedArray;
    };
  }
} else {
  global.crypto = {
    getRandomValues: function(typedArray) {
      const bytes = randomBytesFunction(typedArray.length);
      typedArray.set(new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength));
      return typedArray;
    }
  };
}

// Make sure Vite's internal crypto will have this method
process.env.NODE_OPTIONS = `--require=${__filename} ${process.env.NODE_OPTIONS || ''}`; 