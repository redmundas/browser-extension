<script lang="ts">
  import { onMount } from 'svelte';

  import { getContext } from '../context';

  const { port } = getContext();

  onMount(() => {
    port.postMessage('Hello from popup');
  });
</script>

<div>Extension popup</div>
