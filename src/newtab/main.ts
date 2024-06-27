import '../css';

import { makeContext } from '../libs/svelte/context';
import App from './App.svelte';

start();

async function start() {
  const context = await makeContext('newtab', ['permissions', 'settings']);

  new App({
    context,
    target: document.body,
    props: {},
  });
}
