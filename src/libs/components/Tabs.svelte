<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let items: string[] | { label: string; value: string }[] = [];
  export let value: string | undefined = undefined;

  const dispatch = createEventDispatcher();

  function changeTab(tab: string) {
    return () => {
      value = tab;
      dispatch('change', tab);
    };
  }

  $: entries = items.map((value) => (typeof value === 'string' ? { label: value, value } : value));
</script>

<div class="bg-white">
  <nav class="flex w-full">
    {#each entries as entry}
      {@const active = entry.value === value}
      <button
        class="py-2 px-3 flex-1 hover:text-blue-500 focus:outline-none text-gray-600 border-b-2 font-bold"
        class:border-blue-500={active}
        class:text-blue-500={active}
        on:click={changeTab(entry.value)}
      >
        {entry.label}
      </button>
    {/each}
  </nav>
</div>
