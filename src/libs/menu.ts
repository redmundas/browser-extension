import browser from 'webextension-polyfill';

export function removeContextMenu() {
  return browser.contextMenus.removeAll();
}

export async function createMenuEntry(id: string, title: string) {
  await browser.contextMenus.create(
    {
      id,
      type: 'normal',
      title,
      // contexts: ['page'],
      // visible: true,
      documentUrlPatterns: ['*://*/*'],
    },
    () => {
      if (chrome.runtime.lastError) {
        // context menu already created - do nothing
      }
    },
  );
}

export async function createContextMenu(entries: { id: string; title: string }[]) {
  await removeContextMenu();
  await Promise.all(entries.map(({ id, title }) => createMenuEntry(id, title)));
}
