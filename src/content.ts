import { assignStyles, setAttributes } from './libs/dom';
import { getPath } from './libs/utils';

/**
 * content script that is injected directly into other pages.
 * it should be as minimal as possible so that it doesn't interfere with the page.
 * that's why actual widget is displayed via an iframe.
 */

start();

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
    height: 'auto',
    minHeight: '40px',
    maxHeight: 'calc(100vh - 50px)',
    display: 'inline-block',
    boxSizing: 'border-box',
    margin: '0',
    padding: '0',
    position: 'fixed',
    bottom: '30px',
    right: '20px',
    zIndex: '9999',
    background: 'white',
    border: 'solid 1px #dddddd',
    borderRadius: '6px',
    boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    transition: 'none',
  });

  window.addEventListener('message', (event) => {
    const { height } = event.data;
    assignStyles(iframe, {
      height: `${height}px`,
    });
  });

  document.body.append(iframe);
}
