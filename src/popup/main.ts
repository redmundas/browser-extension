import '../css/reset.css';

import { Store } from '../store';
import App from './App.svelte';
import { makeContext } from './context';

start();

async function start() {
  const store = new Store();
  await store.init();
  const context = makeContext('popup', store);

  new App({
    context,
    target: document.body,
    props: {},
  });
}
