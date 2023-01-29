import '../css/reset.css';

import { makeContext } from '../context';
import App from './App.svelte';

start();

function start() {
  const context = makeContext('popup');

  new App({
    context,
    target: document.body,
    props: {},
  });
}
