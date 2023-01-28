import type { WebNavigation } from 'webextension-polyfill';

import Connection from './comms/main';
import { addListener } from './events';
import { injectScript } from './libs/utils';
import logger from './logger';

start();

function start() {
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
  addListener('navigation_committed', async ({ tabId, url }: WebNavigation.OnCommittedDetailsType) => {
    await injectScript(tabId, 'content/main.js');
    logger.debug('CONTENT_SCRIPT_INJECTED', tabId, url);
  });
}
