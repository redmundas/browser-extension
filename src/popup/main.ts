import '../css';

import { makeContext } from '../libs/svelte/context';
import App from './App.svelte';

start();

async function start() {
  const context = await makeContext('popup', ['components', 'permissions', 'port']);

  new App({
    context,
    target: document.body,
    props: {},
  });
}
