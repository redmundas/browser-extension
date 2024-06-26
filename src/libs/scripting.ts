import browser from 'webextension-polyfill';

export type ContentScript = 'content/main.js';
export type ContentStyle = never;

export async function injectScript(tabId: number, file: ContentScript) {
  await injectScripts(tabId, [file]);
}

export async function injectScripts(tabId: number, files: ContentScript[]) {
  await browser.scripting.executeScript({
    target: { tabId },
    files,
  });
}

export async function injectStyles(tabId: number, files: ContentStyle[]) {
  await browser.scripting.insertCSS({
    target: { tabId },
    files,
  });
}
