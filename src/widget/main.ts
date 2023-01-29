import { makeContext } from '../context';
import heightObserver from '../libs/height';
import { getCurrentTab } from '../libs/tabs';
import App from './App.svelte';

start();

async function start() {
  const tab = await getCurrentTab();
  const context = makeContext('widget', tab.id);

  new App({
    context,
    target: document.body,
    props: {},
  });

  const observer = heightObserver((height) => {
    window.parent.postMessage({ height }, '*');
  });
  observer.observe(document.body);
}
