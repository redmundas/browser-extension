import browser from 'webextension-polyfill';

import { badgeBgColor, badgeFgColor } from '../config';

export function getBadgeText() {
  return browser.action.getBadgeText({});
}

export function setBadgeText(
  text?: string,
  { bg, fg }: { bg: string; fg: string } = { bg: badgeBgColor, fg: badgeFgColor },
) {
  if (!text) {
    return browser.action.setBadgeText({ text: null });
  }
  return Promise.all([
    browser.action.setBadgeText({ text }),
    browser.action.setBadgeTextColor({ color: fg }),
    browser.action.setBadgeBackgroundColor({ color: bg }),
  ]);
}
