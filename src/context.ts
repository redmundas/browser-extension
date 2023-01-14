import { getContext as getCtx } from 'svelte';

import Connection from './comms/child';

/**
 *  context object for svelte apps
 */

export type Context = {
  port: Connection;
};

export function makeContext(name: string) {
  const connection = new Connection(name);

  const context = new Map();
  context.set('app', { port: connection });

  return context;
}

export function getContext() {
  return getCtx<Context>('app');
}
