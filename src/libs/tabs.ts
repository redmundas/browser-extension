import browser from 'webextension-polyfill';

export function getActiveTabs() {
  return browser.tabs.query({});
}

export async function getCurrentTab() {
  const current = await browser.tabs.getCurrent();
  if (current) {
    return current;
  }
  const [active] = await browser.tabs.query({ active: true });
  return active;
}

export function getTabById(id: number) {
  return browser.tabs.get(id);
}
