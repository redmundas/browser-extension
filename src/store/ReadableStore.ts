import browser from 'webextension-polyfill';

import type { Bookmark, Components, Permissions } from './types';

export default class ReadableStore {
  protected _bookmarks: Bookmark[] = [];
  protected _components: Components = {};
  protected _permissions: Permissions = {};

  constructor(protected engine = browser.storage.local) {}

  get bookmarks() {
    return this._bookmarks;
  }

  get components() {
    return this._components;
  }

  get permissions() {
    return this._permissions;
  }

  public async init() {
    const [bookmarks, components, permissions] = await Promise.all([
      this.getItem<Bookmark[]>('bookmarks', this._bookmarks),
      this.getItem<Components>('components', this._components),
      this.getItem<Permissions>('permissions', this._permissions),
    ]);
    this._bookmarks = bookmarks;
    this._components = components;
    this._permissions = permissions;
  }

  public subscribe<T = undefined>(
    key: 'bookmarks' | 'components' | 'permissions',
    callback: (newValue: T, oldValue: T) => void,
  ) {
    this.engine.onChanged.addListener((changes: browser.Storage.StorageAreaOnChangedChangesType) => {
      if (key in changes) {
        const { newValue, oldValue } = changes[key];
        callback(newValue, oldValue);
      }
    });
  }

  protected async getItem<T = unknown>(key: string, value: T) {
    const store = await this.engine.get({ [key]: value });
    return store[key] as T;
  }
}
