import browser from 'webextension-polyfill';

export async function getActiveTabs() {
  return browser.tabs.query({});
}

export async function getCurrentTab() {
  return browser.tabs.getCurrent();
}
