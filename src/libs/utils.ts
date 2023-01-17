import browser from 'webextension-polyfill';

export function getPath(file: string) {
  return browser.runtime.getURL(file);
}

export async function injectScript(tabId: number, file: string) {
  await injectScripts(tabId, [file]);
}

export async function injectScripts(tabId: number, files: string[]) {
  await browser.scripting.executeScript({
    target: { tabId },
    files,
  });
}

export async function injectStyles(tabId: number, files: string[]) {
  await browser.scripting.insertCSS({
    target: { tabId },
    files,
  });
}
