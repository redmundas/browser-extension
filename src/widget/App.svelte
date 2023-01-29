<script lang="ts">
  import { getContext } from './context';

  const { port, url: store } = getContext();

  $: url = $store ?? '';

  function onSave() {
    port.postMessage('store_url', url);
  }
</script>

<div>
  <p>Current url: {url}</p>
  <button on:click={onSave}>Save url</button>
</div>

<style>
  div {
    width: 100%;
    height: auto;
    padding: 8px;
  }
</style>
