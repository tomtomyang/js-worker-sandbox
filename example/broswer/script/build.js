const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: [path.resolve(__dirname, '../src/run.js')],
  bundle: true,
  outfile: path.resolve(__dirname, '../dist/bundle.js'),
  format: 'iife',
  platform: 'browser',
}).catch(() => process.exit(1));