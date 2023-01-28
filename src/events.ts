import EventEmitter from 'emittery';
import type { Tabs, WebNavigation } from 'webextension-polyfill';
import browser from 'webextension-polyfill';

import { hostNames } from './config';

const emitter = new EventEmitter();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addListener(name: string, listener: (data: any) => void) {
  emitter.on(name, listener);
}

browser.webNavigation.onCommitted.addListener(
  async (details: WebNavigation.OnCommittedDetailsType) => {
    emitter.emit('navigation_committed', details);
  },
  {
    url: hostNames.map((hostEquals) => ({ hostEquals, schemes: ['https'] })),
  },
);

browser.tabs.onActivated.addListener((info: Tabs.OnActivatedActiveInfoType) => {
  emitter.emit('tab_activated', info);
});

browser.tabs.onCreated.addListener((tab: Tabs.Tab) => {
  emitter.emit('tab_created', tab);
});

browser.tabs.onRemoved.addListener((tabId: number, info: Tabs.OnRemovedRemoveInfoType) => {
  emitter.emit('tab_removed', { tabId, info });
});

browser.tabs.onUpdated.addListener((tabId: number, info: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
  emitter.emit('tab_updated', { tabId, info, tab });
});
