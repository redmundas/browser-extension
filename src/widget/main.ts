import '../css/reset.css';

import heightObserver from '../libs/height';
import { getCurrentTab } from '../libs/tabs';
import App from './App.svelte';
import { makeContext } from './context';

start();

async function start() {
  const tab = await getCurrentTab();
  const context = makeContext('widget', tab);
  const container = document.createElement('div');
  document.body.append(container);

  new App({
    context,
    target: container,
    props: {},
  });

  const observer = heightObserver((height) => {
    window.parent.postMessage({ height }, '*');
  });
  observer.observe(container);
}
