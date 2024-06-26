import '../css';

import heightObserver from '../libs/height';
import App from './App.svelte';
import { makeContext } from './context';

start();

async function start() {
  const context = makeContext('widget');
  const container = document.createElement('div');
  document.body.append(container);

  new App({
    context,
    target: container,
    props: {},
  });

  window.parent.postMessage({ type: 'init' }, '*');

  const observer = heightObserver((height) => {
    window.parent.postMessage({ type: 'height', value: height }, '*');
  });
  observer.observe(container);
}
