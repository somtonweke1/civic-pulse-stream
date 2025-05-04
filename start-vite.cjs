require('./vite-patch.cjs');

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Vite with crypto patches applied...');

const viteProcess = spawn(
  process.execPath, 
  [path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js')], 
  {
    stdio: 'inherit',
    env: process.env
  }
);

viteProcess.on('close', (code) => {
  process.exit(code);
}); 