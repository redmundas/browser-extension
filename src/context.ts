import { getContext as getCtx } from 'svelte';
import { type Readable, readable } from 'svelte/store';

import Connection from './comms/child';
import type { TabData } from './state';
import StateDatabase from './store';

/**
 *  context object for svelte apps
 */

export type Context = {
  port: Connection;
  state: Readable<TabData>;
};

export function makeContext(name: string, tabId?: number) {
  const db = new StateDatabase();
  const port = new Connection(name);
  const state = readable<TabData>({}, (set) => {
    if (!tabId) return;
    db.subscribe('tabs', tabId, (tab) => {
      set(tab);
    });
  });

  const context = new Map();
  context.set('app', { port, state });

  return context;
}

export function getContext() {
  return getCtx<Context>('app');
}
