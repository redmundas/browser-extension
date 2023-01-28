import dotenv from 'dotenv';
import { build, context } from 'esbuild';
import clear from 'esbuild-plugin-clear';
import { copy } from 'esbuild-plugin-copy';
import sveltePlugin from 'esbuild-svelte';
import yargs from 'yargs';

const { dev } = yargs(process.argv.slice(2)).argv;

dotenv.config();

const options = {
  bundle: true,
  entryPoints: ['src/content/main.ts', 'src/popup/main.ts', 'src/widget/main.ts', 'src/worker.ts'],
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
