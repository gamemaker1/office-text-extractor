import * as esbuild from 'esbuild'
import { polyfillNode } from 'esbuild-plugin-polyfill-node'

await esbuild.build({
  entryPoints: ['source/index.ts'],
  bundle: true, outfile: 'build/browser.js',
  format: 'esm', target: ['es2021'],
  minify: true, sourcemap: false,
  define: { BROWSER: 'true' }, platform: 'browser',
  plugins: [polyfillNode({ globals: { buffer: true } })],
  external: ['fs', 'path', 'node:fs', 'node:path'], 
}).catch(() => process.exit(1))

await esbuild.build({
  entryPoints: ['source/index.ts'],
  bundle: true, outfile: 'build/index.js',
  format: 'esm', target: ['es2021'],
  minify: true, sourcemap: false,
  platform: 'node', packages: 'external'
}).catch(() => process.exit(2))
