import { assignStyles, setAttributes } from './dom';
import { getPath } from './utils';

/**
 * content script that is injected directly into other pages.
 * it should be as minimal as possible so that it doesn't interfere with the page.
 * that's why actual widget is displayed via an iframe.
 */

function start() {
  if (document.getElementById('browser-extension')) {
    return;
  }

  const path = getPath('widget.html');

  const iframe = document.createElement('iframe');
  setAttributes(iframe, {
    title: 'Extension',
    scrolling: 'no',
    frameborder: 'no',
    src: path,
    allowtransparency: 'true',
  });
  assignStyles(iframe, {
    width: '400px',
    display: 'inline-block',
    boxSizing: 'border-box',
    border: 'none',
    margin: '0',
    padding: '0',
    position: 'fixed',
    bottom: '0',
    right: '0',
    zIndex: '9999',
    background: 'transparent',
  });

  document.body.append(iframe);
}

start();
