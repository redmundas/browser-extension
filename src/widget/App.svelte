<script lang="ts">
  import { onMount } from 'svelte';

  import { getContext } from '../context';

  const { port } = getContext();

  onMount(() => {
    port.postMessage('Hello from widget');
  });
</script>

<div>Extension widget</div>

<style>
  div {
    width: calc(100% - 40px);
    height: calc(100vh - 50px);
    background: white;
    border: solid 1px #dddddd;
    border-radius: 6px;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
    margin: 20px 20px 30px;
  }
</style>
