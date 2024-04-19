import { getContext as getCtx } from 'svelte';
import { type Readable, readable } from 'svelte/store';

import Connection from '../comms/child';
import type { UrlData, Store } from '../store';

/**
 *  context object for svelte app
 */

export type Context = {
  port: Connection;
  urls: Readable<UrlData[]>;
};

export function makeContext(name: string, store: Store) {
  const port = new Connection(name);
  const urls = readable<UrlData[]>(store.urls, (set) => {
    store.subscribe<UrlData[]>('urls', (data) => {
      set(data);
    });
  });

  const context = new Map();
  context.set('app', { port, urls });

  return context;
}

export function getContext() {
  return getCtx<Context>('app');
}
