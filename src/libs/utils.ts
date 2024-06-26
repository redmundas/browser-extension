import browser from 'webextension-polyfill';

export type ExtensionFile = '/_favicon/' | 'newtab.html' | 'popup.html' | 'widget.html';

export function getPath(file: ExtensionFile) {
  return browser.runtime.getURL(file);
}

export function faviconUrl(href: string) {
  const url = new URL(getPath('/_favicon/'));
  url.searchParams.set('pageUrl', href);
  url.searchParams.set('size', '16');
  return url.toString();
}
