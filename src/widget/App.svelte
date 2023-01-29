<script lang="ts">
  import { onMount } from 'svelte';

  import { getContext } from '../context';

  const { port, state } = getContext();

  $: url = $state?.url ?? '';

  onMount(() => {
    port.postMessage('Hello from widget');
  });
</script>

<div>
  <p>Current url: {url}</p>
</div>

<style>
  div {
    width: 100%;
    height: auto;
    padding: 8px;
  }
</style>
