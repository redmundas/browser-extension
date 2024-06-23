import { assignStyles, setAttributes } from '../libs/dom';
import { getPath } from '../libs/utils';
import { attributes, styles } from './props';

/**
 * content script that is injected directly into other pages.
 * it should be as minimal as possible so that it doesn't interfere with the page.
 * that's why actual widget is displayed via an iframe.
 */

export function create(): HTMLIFrameElement {
  let iframe = document.getElementById('browser-extension');

  if (iframe) {
    return iframe as HTMLIFrameElement;
  }

  const path = getPath('widget.html');
  iframe = document.createElement('iframe');
  setAttributes(iframe, { ...attributes, src: path, id: 'browser-extension' });
  assignStyles(iframe, styles);

  document.body.append(iframe);

  return iframe as HTMLIFrameElement;
}
