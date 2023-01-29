import type { Tabs, WebNavigation } from 'webextension-polyfill';
import browser from 'webextension-polyfill';

import Connection from './comms/main';
import { addEventListener } from './events';
import { getActiveTabs } from './libs/tabs';
import { injectScript } from './libs/utils';
import logger from './logger';
import createStateMachine from './state';
import StateDatabase from './store';

start();

async function start() {
  const db = new StateDatabase();
  const state = createStateMachine();

  // persist state changes
  state.onChange(async ({ tabs }, { tabs: prev } = { tabs: {} }) => {
    // very naive approach
    if (JSON.stringify(tabs) === JSON.stringify(prev)) return;

    await db.tabs.clear();
    await db.tabs.bulkPut(Object.entries(tabs).map(([id, tab]) => ({ ...tab, id: Number(id) })));
  });

  // listen for messages from popup
  const popup = new Connection('popup');
  popup.addListener((message) => {
    logger.debug('POPUP_MESSAGE', message);
  });

  // listen for messages from widget
  const widget = new Connection('widget');
  widget.addListener((message) => {
    logger.debug('WIDGET_MESSAGE', message);
  });

  // inject content script into third party pages
  addEventListener('navigation_committed', async ({ frameId, tabId, url }: WebNavigation.OnCommittedDetailsType) => {
    if (frameId !== 0) return;

    const frame = await browser.webNavigation.getFrame({
      frameId,
      tabId,
    });

    if (!frame) return;

    await injectScript(tabId, 'content/main.js');
    logger.debug('CONTENT_SCRIPT_INJECTED', tabId, url);
  });

  addEventListener('tab_created', (tab: Tabs.Tab) => {
    state.send('CREATE_TAB', { tabId: tab.id });
  });

  addEventListener('tab_removed', ({ tabId }) => {
    state.send('REMOVE_TAB', { tabId });
  });

  addEventListener('tab_updated', ({ tab, tabId }: { tab: Tabs.Tab; tabId: number }) => {
    state.send('UPDATE_TAB', { tabId, url: tab.url });
  });

  const activeTabs = await getActiveTabs();
  const ids = activeTabs.map(({ id }) => id as number);

  const persisted = await db.tabs.toArray();
  const tabs = persisted.filter(({ id }) => ids.includes(id));

  state.send('START');
  state.send('RESTORE_STATE', { tabs });
}
