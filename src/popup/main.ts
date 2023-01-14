import { makeContext } from '../context';
import App from './App.svelte';

function start() {
  const target = document.createElement('div');
  document.body.insertBefore(target, document.body.firstChild);

  const context = makeContext('popup');

  new App({
    context,
    target,
    props: {},
  });
}

start();
