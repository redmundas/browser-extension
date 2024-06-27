import browser from 'webextension-polyfill';

export function removeContextMenu() {
  return browser.contextMenus.removeAll();
}

export function createMenuEntry({ id, title, ...rest }: browser.Menus.CreateCreatePropertiesType) {
  return new Promise((resolve, reject) => {
    browser.contextMenus.create(
      {
        id,
        type: 'normal',
        title,
        contexts: ['page'],
        documentUrlPatterns: ['*://*/*'],
        ...rest,
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(undefined);
        }
      },
    );
  });
}

export async function createContextMenu(entries: browser.Menus.CreateCreatePropertiesType[]) {
  await removeContextMenu();
  await Promise.all(entries.map(createMenuEntry));
}
