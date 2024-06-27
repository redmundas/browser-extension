<script lang="ts">
  import { writable } from 'svelte/store';

  import Tabs from '../libs/components/Tabs.svelte';
  import { getContext } from '../libs/svelte/context';
  import Bookmarks from './Bookmarks.svelte';
  import Snippets from './Snippets.svelte';

  const tabs = [
    { label: 'Saved bookmarks', value: 'bookmarks' },
    { label: 'Saved snippets', value: 'snippets' },
  ];

  const tab = writable(localStorage.getItem('active_tab') ?? 'bookmarks');
  const { port, settings } = getContext();
  port.addListener(() => {
    window.close();
  }, 'close_window');

  tab.subscribe((value) => {
    localStorage.setItem('active_tab', value);
  });
</script>

<main class="w-full h-full p-4 flex flex-col gap-y-2 hover:blur-none" class:blur-sm={$settings.privacy}>
  <Tabs items={tabs} bind:value={$tab} />
  {#if $tab === 'bookmarks'}
    <Bookmarks />
  {/if}
  {#if $tab === 'snippets'}
    <Snippets />
  {/if}
</main>
