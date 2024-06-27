import Connection from './comms/main';
import { setBadgeText } from './libs/action';
import { createContextMenu } from './libs/menu';
import { getPermissions } from './libs/permissions';
import { WritableStore as Store } from './store';

export type Context = {
  content: Connection;
  panel: Connection;
  popup: Connection;
  // widget: Connection;
  store: Store;
};

export async function createContext() {
  const content = new Connection('content');
  const panel = new Connection('panel');
  const popup = new Connection('popup');
  // const widget = new Connection('widget');

  const store = await initStore();

  return { content, panel, popup, store };
}

async function initStore() {
  const store = new Store();

  const [permissions] = await Promise.all([getPermissions(['history']), store.init()]);
  const badgeText = store.components.badge ? setBadgeText('!') : Promise.resolve();
  const contextMenu = store.components.menu
    ? createContextMenu([{ id: 'save_snippet', title: 'Save snippet', contexts: ['page', 'selection'] }])
    : Promise.resolve();

  await Promise.all([
    badgeText,
    contextMenu,
    store.setComponents({
      badge: store.components.badge,
      menu: store.components.menu,
      widget: store.components.widget,
    }),
    store.setPermissions(permissions),
  ]);

  return store;
}
