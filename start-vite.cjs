require('./vite-patch.cjs');

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Vite with crypto patches applied...');

const vite = spawn('node', [
  '--require',
  path.join(__dirname, 'crypto-preload.cjs'),
  path.join(__dirname, 'node_modules/vite/bin/vite.js')
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
}); 