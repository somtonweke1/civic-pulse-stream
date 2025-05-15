const { Buffer } = require('buffer');
const crypto = require('crypto-browserify');

global.Buffer = Buffer;
global.crypto = crypto; 