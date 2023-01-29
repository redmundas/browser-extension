import { v4 as uuid } from 'uuid';
import type { WebNavigation } from 'webextension-polyfill';
import browser from 'webextension-polyfill';

import Connection from './comms/main';
import { addEventListener } from './events';
import { injectScript } from './libs/utils';
import logger from './logger';
import createStateMachine from './state';
import StateDatabase from './store';

start();

async function start() {
  const db = new StateDatabase();
  const state = createStateMachine();
  await restoreState(db, state);

  // persist state changes
  state.onChange(async ({ urls }) => {
    await db.urls.clear();
    await db.urls.bulkPut(urls);
  });

  // listen for messages from popup
  const popup = new Connection('popup');
  popup.addListener((message) => {
    logger.debug('POPUP_MESSAGE', message);
  });

  // listen for messages from widget
  const widget = new Connection('widget');
  widget.addListener(({ data, type }) => {
    logger.debug('WIDGET_MESSAGE', { type, data });
    if (type === 'store_url') {
      state.send('INSERT_URL', { id: uuid(), url: data });
    }
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

  state.send('START');
}

async function restoreState(db: StateDatabase, state: ReturnType<typeof createStateMachine>) {
  const urls = await db.urls.toArray();
  state.send('RESTORE_STATE', { urls });
}
