import path from 'node:path';

import dotenv from 'dotenv';
import { build, context } from 'esbuild';
import clear from 'esbuild-plugin-clear';
import { copy } from 'esbuild-plugin-copy';
import stylePlugin from 'esbuild-style-plugin';
import sveltePlugin from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import yargs from 'yargs';

const { dev } = yargs(process.argv.slice(2)).argv;

dotenv.config();

const options = {
  bundle: true,
  entryPoints: [
    'src/content/main.ts',
    'src/devtools.ts',
    'src/newtab/main.ts',
    'src/panel/main.ts',
    'src/popup/main.ts',
    'src/widget/main.ts',
    'src/worker.ts',
  ],
  format: 'iife',
  target: ['esnext'],
  loader: {
    '.gif': 'dataurl',
    '.png': 'dataurl',
    '.svg': 'text',
  },
  plugins: [
    sveltePlugin({
      preprocess: sveltePreprocess(),
    }),
    stylePlugin({
      postcssConfigFile: path.resolve('./postcss.config.js'),
    }),
    copy({
      assets: [
        {
          from: ['./src/static/*'],
          to: ['./'],
        },
      ],
    }),
  ],
  define: {
    'process.env': JSON.stringify({
      ...process.env,
      NODE_ENV: process.env.NODE_ENV ?? dev ? 'development' : 'production',
    }),
  },
  logLevel: 'info',
  outdir: 'dist',
  treeShaking: true,
  legalComments: 'none',
  minify: !dev,
  sourcemap: dev,
};

if (dev) {
  const ctx = await context(options);
  await ctx.watch();
} else {
  await build({
    ...options,
    plugins: options.plugins.concat(clear('./dist')),
  });
}
