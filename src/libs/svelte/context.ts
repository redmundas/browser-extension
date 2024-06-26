import { getContext as getCtx } from 'svelte';
import { type Readable, readable } from 'svelte/store';

import Connection from '../../comms/child';
import type { Bookmark, Components, Permissions } from '../../store';
import { ReadableStore as Store } from '../../store';

/**
 *  context object for svelte app
 */

export type Context = {
  bookmarks: Readable<Bookmark[]>;
  components: Readable<Components>;
  permissions: Readable<Permissions>;
  port: Connection;
};

type Keys = keyof Omit<Context, 'port'>;

export async function makeContext(name: string, keys: Keys[] = []) {
  const port = new Connection(name);
  const features: Partial<Omit<Context, 'port'>> = {};
  if (keys.length) {
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
  }

  const context = new Map();
  context.set('app', { ...features, port });

  return context;
}

export function getContext() {
  return getCtx<Context>('app');
}
