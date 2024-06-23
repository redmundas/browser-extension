<script lang="ts">
  import { getContext } from './context';

  const { size } = getContext();

  $: vh = $size.vh;
  $: vw = $size.vw;
</script>

<div class="p-2">{vw} &#x2717; {vh}</div>
