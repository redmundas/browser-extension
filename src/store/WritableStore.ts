import browser from 'webextension-polyfill';

import { uuid } from '../libs/uuid';
import ReadableStore from './ReadableStore';
import type { Component, Components, Permission, Permissions } from './types';

export default class WritableStore extends ReadableStore {
  constructor(engine = browser.storage.local) {
    super(engine);
  }

  public async addBookmark(tab: browser.Tabs.Tab) {
    this._bookmarks.push({ id: uuid(), title: tab.title, url: tab.url! });
    await this.persistBookmarks();
  }

  public async removeBookmark(id: string) {
    const i = this._bookmarks.findIndex((b) => b.id === id);
    if (i < 0) {
      return;
    }
    this._bookmarks.splice(i, 1);
    await this.persistBookmarks();
  }

  public async addSnippet(tab: browser.Tabs.Tab, content: string) {
    this._snippets.push({ id: uuid(), content, title: tab.title, url: tab.url! });
    await this.persistSnippets();
  }

  public async removeSnippet(id: string) {
    const i = this._snippets.findIndex((b) => b.id === id);
    if (i < 0) {
      return;
    }
    this._snippets.splice(i, 1);
    await this.persistSnippets();
  }

  public async enableComponent(name: Component) {
    this._components[name] = true;
    await this.persistComponents();
  }

  public async disableComponent(name: Component) {
    this._components[name] = false;
    await this.persistComponents();
  }

  public async toggleComponent(name: Component) {
    this._components[name] = !this._components[name];
    await this.persistComponents();
  }

  public isComponentEnabled(name: Component) {
    return this._components[name];
  }

  public isComponentDisabled(name: Component) {
    return !this._components[name];
  }

  public async setComponents(components: Components) {
    this._components = components;
    await this.persistComponents();
  }

  public async setPermissions(permissions: Permissions) {
    this._permissions = permissions;
    await this.persistPermissions();
  }

  public async updatePermission(name: Permission, granted: boolean) {
    this._permissions[name] = granted;
    await this.persistPermissions();
  }

  public async grantPermissions(names: Permission[]) {
    for (const name of names) {
      this._permissions[name] = true;
    }
    await this.persistPermissions();
  }

  public async revokePermissions(names: Permission[]) {
    for (const name of names) {
      this._permissions[name] = false;
    }
    await this.persistPermissions();
  }

  public async togglePrivacy() {
    this._settings.privacy = !this._settings.privacy;
    await this.persistSettings();
  }

  private async persistBookmarks() {
    await this.engine.set({ bookmarks: this._bookmarks });
  }

  private async persistComponents() {
    await this.engine.set({ components: this._components });
  }

  private async persistPermissions() {
    await this.engine.set({ permissions: this._permissions });
  }

  private async persistSettings() {
    await this.engine.set({ settings: this._settings });
  }

  private async persistSnippets() {
    await this.engine.set({ snippets: this._snippets });
  }
}
