<script lang="ts">
  import { onMount } from 'svelte';

  import { getContext } from '../context';

  const { port } = getContext();

  onMount(() => {
    port.postMessage('Hello from widget');
  });
</script>

<div>
  <p>Extension widget</p>
</div>

<style>
  div {
    width: 100%;
    height: auto;
    padding: 0 8px;
  }
</style>
