import { getContext as getCtx } from 'svelte';
import { type Writable, writable } from 'svelte/store';

import Connection from '../comms/child';

/**
 *  context object for svelte app
 */

export type Context = {
  port: Connection;
  size: Writable<{
    vh: number;
    vw: number;
  }>;
};

export function makeContext(name: string) {
  const port = new Connection(name);
  const size = writable({ vh: 0, vw: 0 });

  const context = new Map();
  context.set('app', { port, size });

  window.addEventListener('message', (event) => {
    size.set(event.data);
  });

  return context;
}

export function getContext() {
  return getCtx<Context>('app');
}
