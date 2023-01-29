import { getContext as getCtx } from 'svelte';
import { type Readable, readable } from 'svelte/store';

import Connection from '../comms/child';
import type { UrlData } from '../state';
import StateDatabase from '../store';

/**
 *  context object for svelte apps
 */

export type Context = {
  port: Connection;
  urls: Readable<UrlData[]>;
};

export function makeContext(name: string) {
  const db = new StateDatabase();
  const port = new Connection(name);
  const urls = readable<UrlData[]>([], (set) => {
    db.subscribe('urls', (data) => {
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
