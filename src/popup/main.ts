import '../css/reset.css';

import App from './App.svelte';
import { makeContext } from './context';

start();

function start() {
  const context = makeContext('popup');

  new App({
    context,
    target: document.body,
    props: {},
  });
}
