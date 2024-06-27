import { getContext as getCtx } from 'svelte';
import { type Readable, readable } from 'svelte/store';

import Connection from '../../comms/child';
import type { Bookmark, Components, Permissions, Snippet } from '../../store';
import { ReadableStore as Store } from '../../store';

/**
 *  context object for svelte app
 */

export type Context = {
  bookmarks: Readable<Bookmark[]>;
  components: Readable<Components>;
  permissions: Readable<Permissions>;
  port: Connection;
  snippets: Readable<Snippet[]>;
};

type Keys = keyof Context;

export async function makeContext(name: string, keys: Keys[] = []) {
  const features: Partial<Context> = {};
  if (keys.length) {
    if (keys.includes('port')) {
      const port = new Connection(name);
      features.port = port;
    }
    if (keys.filter((key) => key !== 'port').length > 0) {
      const store = new Store();
      await store.init();
      if (keys.includes('bookmarks')) {
        features.bookmarks = readable(store.bookmarks.toReversed(), (set) => {
          store.subscribe<Bookmark[]>('bookmarks', (value = []) => {
            set(value.toReversed());
          });
        });
      }
      if (keys.includes('components')) {
        features.components = readable(store.components, (set) => {
          store.subscribe<Components>('components', (value) => {
            set(value);
          });
        });
      }
      if (keys.includes('permissions')) {
        features.permissions = readable(store.permissions, (set) => {
          store.subscribe<Permissions>('permissions', (value) => {
            set(value);
          });
        });
      }
      if (keys.includes('snippets')) {
        features.snippets = readable(store.snippets.toReversed(), (set) => {
          store.subscribe<Snippet[]>('snippets', (value = []) => {
            set(value.toReversed());
          });
        });
      }
    }
  }

  const context = new Map();
  context.set('app', features);

  return context;
}

export function getContext() {
  return getCtx<Context>('app');
}
