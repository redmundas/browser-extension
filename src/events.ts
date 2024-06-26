import EventEmitter from 'emittery';
import type { Menus, Tabs, WebNavigation } from 'webextension-polyfill';
import browser from 'webextension-polyfill';

import type { Permission } from './store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventData = any;
export type EventType =
  | 'action_clicked'
  | 'dom_content_loaded'
  | 'menu_clicked'
  | 'navigation_committed'
  | 'permissions_granted'
  | 'permissions_revoked'
  | 'tab_activated'
  | 'tab_created'
  | 'tab_removed'
  | 'tab_updated';
export type ActionClickedData = { info: browser.Action.OnClickData | undefined; tab: Tabs.Tab };
export type MenuClickedData = { info: Menus.OnClickData; tab: Tabs.Tab | undefined };
export type DomContentLoadedData = WebNavigation.OnDOMContentLoadedDetailsType;
export type NavigationCommittedData = WebNavigation.OnCommittedDetailsType;
export type TabActivatedData = Tabs.OnActivatedActiveInfoType;
export type TabCreatedData = Tabs.Tab;
export type TabRemovedData = { tabId: number; info: Tabs.OnRemovedRemoveInfoType };
export type TabUpdatedData = { tabId: number; info: Tabs.OnUpdatedChangeInfoType; tab: Tabs.Tab };

export function addEventListener(type: 'action_clicked', listener: (data: ActionClickedData) => void): void;
export function addEventListener(type: 'menu_clicked', listener: (data: MenuClickedData) => void): void;
export function addEventListener(type: 'dom_content_loaded', listener: (data: DomContentLoadedData) => void): void;
export function addEventListener(type: 'navigation_committed', listener: (data: NavigationCommittedData) => void): void;
export function addEventListener(type: 'permissions_granted', listener: (data: Permission[]) => void): void;
export function addEventListener(type: 'permissions_revoked', listener: (data: Permission[]) => void): void;
export function addEventListener(type: 'tab_activated', listener: (data: TabActivatedData) => void): void;
export function addEventListener(type: 'tab_created', listener: (data: TabCreatedData) => void): void;
export function addEventListener(type: 'tab_removed', listener: (data: TabRemovedData) => void): void;
export function addEventListener(type: 'tab_updated', listener: (data: TabUpdatedData) => void): void;
export function addEventListener(type: EventType, listener: (data: EventData) => void) {
  emitter.on(type, listener);
}

export function dispatchEvent(type: 'action_clicked', data: ActionClickedData): void;
export function dispatchEvent(type: 'dom_content_loaded', data: DomContentLoadedData): void;
export function dispatchEvent(type: 'menu_clicked', data: MenuClickedData): void;
export function dispatchEvent(type: 'navigation_committed', data: NavigationCommittedData): void;
export function dispatchEvent(type: 'permissions_granted', data: Permission[]): void;
export function dispatchEvent(type: 'permissions_revoked', data: Permission[]): void;
export function dispatchEvent(type: 'tab_activated', data: TabActivatedData): void;
export function dispatchEvent(type: 'tab_created', data: TabCreatedData): void;
export function dispatchEvent(type: 'tab_removed', data: TabRemovedData): void;
export function dispatchEvent(type: 'tab_updated', data: TabUpdatedData): void;
export function dispatchEvent(type: EventType, data: EventData) {
  emitter.emit(type, data);
}

const emitter = new EventEmitter();

browser.webNavigation.onCommitted.addListener(
  async (details: WebNavigation.OnCommittedDetailsType) => {
    dispatchEvent('navigation_committed', details);
  },
  {
    url: [{ schemes: ['http', 'https'] }],
  },
);

browser.webNavigation.onDOMContentLoaded.addListener(
  async (details: WebNavigation.OnDOMContentLoadedDetailsType) => {
    dispatchEvent('dom_content_loaded', details);
  },
  {
    url: [{ schemes: ['http', 'https'] }],
  },
);

browser.tabs.onActivated.addListener((info: Tabs.OnActivatedActiveInfoType) => {
  dispatchEvent('tab_activated', info);
});

browser.tabs.onCreated.addListener((tab: Tabs.Tab) => {
  dispatchEvent('tab_created', tab);
});

browser.tabs.onRemoved.addListener((tabId: number, info: Tabs.OnRemovedRemoveInfoType) => {
  dispatchEvent('tab_removed', { tabId, info });
});

browser.tabs.onUpdated.addListener((tabId: number, info: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
  dispatchEvent('tab_updated', { tabId, info, tab });
});

browser.permissions.onAdded.addListener(({ permissions = [] }) => {
  dispatchEvent('permissions_granted', permissions as Permission[]);
});

browser.permissions.onRemoved.addListener(({ permissions = [] }) => {
  dispatchEvent('permissions_revoked', permissions as Permission[]);
});

browser.action.onClicked.addListener((tab: Tabs.Tab, info: browser.Action.OnClickData | undefined) => {
  dispatchEvent('action_clicked', { info, tab });
});

browser.contextMenus.onClicked.addListener((info: Menus.OnClickData, tab: Tabs.Tab | undefined) => {
  dispatchEvent('menu_clicked', { info, tab });
});
