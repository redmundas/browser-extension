import browser from 'webextension-polyfill';

start();

async function start() {
  await browser.devtools.panels.create('Extension Panel', 'code.png', 'devpanel.html');
}
