import { makeContext } from '../context';
import App from './App.svelte';

function start() {
  const context = makeContext('popup');

  new App({
    context,
    target: document.body,
    props: {},
  });
}

start();
