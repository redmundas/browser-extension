import browser from 'webextension-polyfill';

import Connection from './comms/main';
import { addEventListener, type DomContentLoadedData } from './events';
import { getPermissions, requestPermissions } from './libs/permissions';
import { injectScript } from './libs/scripting';
import { getActiveTabs, getCurrentTab } from './libs/tabs';
import logger from './logger';
import { type Components, WritableStore as Store } from './store';

start();

async function start() {
  const store = await initStore();

  const content = new Connection('content');
  const panel = new Connection('panel');
  const popup = new Connection('popup');
  // const widget = new Connection('widget');

  // listen for messages from panel
  panel.onConnect(() => {
    store.enableComponent('panel');
  });
  panel.onDisconnect(() => {
    store.disableComponent('panel');
  });
  panel.addListener(async () => {
    const tab = await getCurrentTab();
    if (!tab?.url?.startsWith('http')) {
      // only allow storing public urls
      return;
    }
    if (store.bookmarks.some(({ url }) => url === tab.url)) {
      // already stored
      return;
    }
    await store.addBookmark(tab);
  }, 'add_bookmark');
  panel.addListener(async ({ data }) => {
    await store.removeBookmark(data.id);
  }, 'remove_bookmark');

  // listen for messages from popup
  popup.addListener(async ({ data }) => {
    await requestPermissions({ permissions: [data.name] });
  }, 'request_permission');
  popup.addListener(({ data }) => {
    if (data.name === 'panel') {
      panel.postMessage('close_window');
    }
  }, 'disable_component');
  popup.addListener(({ data }) => {
    if (data.name === 'widget') {
      store.toggleComponent('widget');
    }
  }, 'toggle_component');

  // listed for messages in store
  store.subscribe<Components>('components', async (newComponents, oldComponents) => {
    if (!oldComponents.widget && newComponents.widget) {
      const tabs = await getActiveTabs();
      const newTabIds = tabs
        .filter(
          ({ id, status, url }) => status === 'complete' && url?.startsWith('http') && !content.isTabConnected(id!),
        )
        .map(({ id }) => id!);
      // enable widget on pages that were previously connected
      content.postMessage('enable_widget');
      // inject content script and enabled widget on new pages
      await Promise.all(newTabIds.map((id) => injectScript(id!, 'content/main.js')));
    } else if (oldComponents.widget && !newComponents.widget) {
      content.postMessage('disable_widget');
    }
  });

  // inject content script into third party pages
  addEventListener('dom_content_loaded', async ({ frameId, tabId, url }: DomContentLoadedData) => {
    if (frameId !== 0) return;
    if (store.isComponentDisabled('widget')) return;

    const frame = await browser.webNavigation.getFrame({
      frameId,
      tabId,
    });

    if (!frame) return;

    await injectScript(tabId, 'content/main.js');
    logger.debug('CONTENT_SCRIPT_INJECTED', tabId, url);
  });

  addEventListener('permissions_granted', async (names) => {
    logger.debug('PERMISSIONS_GRANTED', names);
    await store.grantPermissions(names);
  });

  addEventListener('permissions_revoked', async (names) => {
    logger.debug('PERMISSIONS_REVOKED', names);
    await store.revokePermissions(names);
  });
}

async function initStore() {
  const store = new Store();
  await store.init();

  const permissions = await getPermissions(['history']);
  await Promise.all([store.setComponents({ widget: store.components.widget }), store.setPermissions(permissions)]);

  return store;
}
