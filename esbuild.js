import { build } from 'esbuild';
import dotenv from 'dotenv';
import yargs from 'yargs';
import sveltePlugin from 'esbuild-svelte';
import clear from 'esbuild-plugin-clear';
import { copy } from 'esbuild-plugin-copy';

const { dev } = yargs(process.argv.slice(2)).argv;

dotenv.config();

const options = {
  bundle: true,
  entryPoints: ['src/popup/main.ts', 'src/widget/main.ts', 'src/content.ts', 'src/worker.ts'],
  target: ['esnext'],
  loader: {
    '.png': 'dataurl',
    '.svg': 'text',
  },
  plugins: [
    sveltePlugin(),
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
};

if (!dev) {
  options.plugins.push(clear('./dist'));
}

build({
  ...options,
  minify: !dev,
  sourcemap: dev,
  watch: dev,
}).catch(() => process.exit(1));
