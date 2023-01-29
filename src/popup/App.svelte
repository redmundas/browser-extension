<script lang="ts">
  import { onMount } from 'svelte';

  import { getContext } from './context';

  const { port, urls: store } = getContext();

  onMount(() => {
    port.postMessage('greeting', 'Hello from popup');
  });

  $: urls = $store ?? [];
</script>

<section>
  <div>Saved urls:</div>
  {#each urls as { id, url } (id)}
    <div>{url}</div>
  {/each}
</section>

<style>
  section {
    height: 400px;
    width: 300px;
    padding: 8px;
  }
  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
