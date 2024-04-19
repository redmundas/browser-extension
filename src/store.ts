import { v4 as uuid } from 'uuid';
import browser from 'webextension-polyfill';

export type UrlData = {
  id: string;
  url: string;
};

export class Store {
  private _urls: { id: string; url: string }[] = [];

  constructor(private engine = browser.storage.local) {}

  get urls() {
    return this._urls;
  }

  public async init() {
    this._urls = await this.getItem<{ id: string; url: string }[]>('urls', this._urls);
  }

  public async addUrl(url: string) {
    this._urls.push({ id: uuid(), url });
    await this.persistUrls();
  }

  public subscribe<T = undefined>(key: 'urls', callback: (value: T) => void) {
    this.engine.onChanged.addListener((changes) => {
      if (key in changes) {
        callback(changes[key].newValue);
      }
    });
  }

  private async persistUrls() {
    await this.engine.set({ urls: this._urls });
  }

  private async getItem<T = unknown>(key: string, value: T) {
    const store = await this.engine.get({ [key]: value });
    return store[key] as T;
  }
}
