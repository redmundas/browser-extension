import { getContext as getCtx } from 'svelte';
import { type Readable, readable } from 'svelte/store';
import type { Tabs } from 'webextension-polyfill';

import Connection from '../comms/child';

/**
 *  context object for svelte app
 */

export type Context = {
  port: Connection;
  url: Readable<string>;
};

export function makeContext(name: string, tab: Tabs.Tab) {
  const port = new Connection(name);

  const url = readable<string>(tab.url);

  const context = new Map();
  context.set('app', { port, url });

  return context;
}

export function getContext() {
  return getCtx<Context>('app');
}
