import Connection from '../comms/child';
import { assignStyles } from '../libs/dom';
import { create } from './iframe';

start();

function getDimensions() {
  const vw = Math.max(document.documentElement.clientWidth ?? 0, window.innerWidth ?? 0);
  const vh = Math.max(document.documentElement.clientHeight ?? 0, window.innerHeight ?? 0);
  return { vh, vw };
}

function start() {
  const port = new Connection('content');
  let iframe: HTMLIFrameElement | undefined = create();

  port.addListener(() => {
    if (!iframe) {
      // already disabled
      return;
    }
    iframe.remove();
    iframe = undefined;
  }, 'disable_widget');
  port.addListener(() => {
    if (iframe) {
      // already enabled
      return;
    }
    iframe = create();
  }, 'enable_widget');

  window.addEventListener('message', ({ data }) => {
    if (!iframe) {
      // shouldn't happen
      return;
    }

    if (data.type === 'init') {
      iframe.contentWindow?.postMessage(getDimensions(), '*');
    }
    if (data.type === 'height') {
      const height = data.value;
      assignStyles(iframe, {
        height: `${height}px`,
      });
    }
  });

  window.onresize = () => {
    iframe?.contentWindow?.postMessage(getDimensions(), '*');
  };
}
