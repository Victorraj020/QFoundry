// @ts-check
'use strict';

const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');
const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: [path.resolve(__dirname, 'src/extension/activate.ts')],
  bundle: true,
  outfile: path.resolve(__dirname, 'out/extension.js'),
  // 'vscode' is provided by the extension host at runtime — never bundle it.
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  sourcemap: !isProduction ? 'inline' : false,
  minify: isProduction,
  logLevel: 'info',
  metafile: true,
};

async function main() {
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.warn('[QForge] Watching for changes...');
  } else {
    const result = await esbuild.build(buildOptions);
    if (result.metafile) {
      const sizes = Object.entries(result.metafile.outputs)
        .map(([file, meta]) => `  ${path.basename(file)}: ${(meta.bytes / 1024).toFixed(1)}kb`)
        .join('\n');
      console.warn(`[QForge] Build complete:\n${sizes}`);
    }
  }
}

main().catch((err) => {
  console.error('[QForge] Build failed:', err);
  process.exit(1);
});
