import browser from 'webextension-polyfill';

import type { Bookmark, Components, Permissions, Settings, Snippet } from './types';

export default class ReadableStore {
  protected _bookmarks: Bookmark[] = [];
  protected _components: Components = {};
  protected _permissions: Permissions = {};
  protected _settings: Settings = {};
  protected _snippets: Snippet[] = [];

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

  get settings() {
    return this._settings;
  }

  get snippets() {
    return this._snippets;
  }

  public async init() {
    const [bookmarks, components, permissions, settings, snippets] = await Promise.all([
      this.getItem<Bookmark[]>('bookmarks', this._bookmarks),
      this.getItem<Components>('components', this._components),
      this.getItem<Permissions>('permissions', this._permissions),
      this.getItem<Settings>('settings', this._settings),
      this.getItem<Snippet[]>('snippets', this._snippets),
    ]);
    this._bookmarks = bookmarks;
    this._components = components;
    this._permissions = permissions;
    this._settings = settings;
    this._snippets = snippets;
  }

  public subscribe<T = undefined>(
    key: 'bookmarks' | 'components' | 'permissions' | 'settings' | 'snippets',
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
