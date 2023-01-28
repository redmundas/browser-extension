import { assignStyles, setAttributes } from '../libs/dom';
import { getPath } from '../libs/utils';
import { attributes, styles } from './iframe';

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
  setAttributes(iframe, { ...attributes, src: path });
  assignStyles(iframe, styles);

  window.addEventListener('message', (event) => {
    const { height } = event.data ?? {};

    if (!height) return;

    assignStyles(iframe, {
      height: `${height}px`,
    });
  });

  document.body.append(iframe);
}
