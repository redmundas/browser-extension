<script lang="ts">
  import Button from '../libs/components/Button.svelte';
  import { getContext } from '../libs/svelte/context';
  import { faviconUrl } from '../libs/utils';

  const { bookmarks, port } = getContext();
  port.addListener(() => {
    window.close();
  }, 'close_window');

  function addBookmark() {
    port.postMessage('add_bookmark');
  }

  function removeBookmark(id: string) {
    return () => {
      port.postMessage('remove_bookmark', { id });
    };
  }
</script>

<main class="w-full h-full p-4 relative">
  <section class="w-full flex flex-col gap-y-3">
    <h3 class="font-semibold">Saved Pages</h3>
    {#each $bookmarks as { id, title, url }}
      <div class="flex w-full items-center gap-x-2 justify-between">
        <a href={url} target="_blank" class="truncate flex items-center gap-x-2">
          <span class="w-[16px] h-[16px] flex items-center justify-center">
            <img src={faviconUrl(url)} alt="icon" class="max-w-[16px] max-h-[16px]" />
          </span>
          <span class="truncate flex-1">{title || url}</span>
        </a>
        <button class="flex-0" on:click={removeBookmark(id)}>&#x2717;</button>
      </div>
    {/each}
  </section>
  <section class="w-full absolute bottom-0 left-0 right-0 p-4">
    <Button on:click={addBookmark}>Save current tab</Button>
  </section>
</main>
