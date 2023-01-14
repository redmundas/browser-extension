import { makeContext } from '../context';
import heightObserver from '../height';
import App from './App.svelte';

function start() {
  const context = makeContext('widget');

  new App({
    context,
    target: document.body,
    props: {},
  });

  window.parent.postMessage('Testing', '*');
  const observer = heightObserver((height) => {
    window.parent.postMessage({ height }, '*');
  });
  observer.observe(document.body);
}

start();
