import browser from 'webextension-polyfill';

import { type Context, createContext } from './context';
import { addEventListener, type DomContentLoadedData } from './events';
import { setBadgeText } from './libs/action';
import { createContextMenu, removeContextMenu } from './libs/menu';
import { requestPermissions } from './libs/permissions';
import { injectScript } from './libs/scripting';
import { getActiveTabs, getCurrentTab } from './libs/tabs';
import logger from './logger';
import { type Component, type Components, type Permission } from './store';

start();

async function start() {
  const ctx = await createContext();
  const { panel, popup, store } = ctx;

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
  panel.addListener<{ id: string }>(async ({ data }) => {
    await store.removeBookmark(data.id);
  }, 'remove_bookmark');

  // listen for messages from popup
  popup.addListener<{ name: Permission }>(async ({ data }) => {
    await requestPermissions({ permissions: [data.name] });
  }, 'request_permission');
  popup.addListener<{ name: Component }>(({ data }) => {
    if (data.name === 'panel') {
      panel.postMessage('close_window');
    }
  }, 'disable_component');
  popup.addListener<{ name: Component }>(async ({ data }) => {
    const components: Component[] = ['badge', 'menu', 'widget'];
    if (components.includes(data.name)) {
      await store.toggleComponent(data.name);
    }
  }, 'toggle_component');

  // listed for messages in store
  store.subscribe<Components>('components', async (newComponents, oldComponents) => {
    if (oldComponents.widget !== newComponents.widget) {
      await toggleWidget(ctx);
    }

    if (oldComponents.badge !== newComponents.badge) {
      await toggleBadge(ctx);
    }

    if (oldComponents.menu !== newComponents.menu) {
      await toggleMenu(ctx);
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

  addEventListener('menu_clicked', async ({ info }) => {
    if (info.menuItemId === 'toggle_widget') {
      await store.toggleComponent('widget');
    }
  });
}

async function toggleBadge({ store }: Context) {
  if (store.components.badge) {
    await setBadgeText('!');
  } else {
    await setBadgeText();
  }
}

async function toggleMenu({ store }: Context) {
  if (store.components.menu) {
    await createContextMenu([{ id: 'toggle_widget', title: 'Toggle widget' }]);
  } else {
    await removeContextMenu();
  }
}

async function toggleWidget({ content, store }: Context) {
  if (store.components.widget) {
    const tabs = await getActiveTabs();
    const newTabIds = tabs
      .filter(({ id, status, url }) => status === 'complete' && url?.startsWith('http') && !content.isTabConnected(id!))
      .map(({ id }) => id!);
    // enable widget on pages that were previously connected
    content.postMessage('enable_widget');
    // inject content script and enabled widget on new pages
    await Promise.all(newTabIds.map((id) => injectScript(id!, 'content/main.js')));
  } else {
    content.postMessage('disable_widget');
  }
}
