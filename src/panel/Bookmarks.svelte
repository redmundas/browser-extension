<script lang="ts">
  import Button from '../libs/components/Button.svelte';
  import { getContext } from '../libs/svelte/context';
  import { faviconUrl } from '../libs/utils';

  const { bookmarks, port } = getContext();

  function addBookmark() {
    port.postMessage('add_bookmark');
  }

  function removeBookmark(id: string) {
    return () => {
      port.postMessage('remove_bookmark', { id });
    };
  }
</script>

<section class="relative flex-1 w-full text-sm">
  <div class="w-full flex flex-col divide-y">
    {#each $bookmarks as { id, title, url }}
      <div class="flex w-full items-center gap-x-2 py-2 justify-between">
        <a href={url} target="_blank" class="truncate flex items-center gap-x-2 hover:text-blue-600">
          <span class="w-[16px] h-[16px] flex items-center justify-center">
            <img src={faviconUrl(url)} alt="icon" class="max-w-[16px] max-h-[16px]" />
          </span>
          <span class="truncate flex-1">{title || url}</span>
        </a>
        <button class="flex-0" on:click={removeBookmark(id)}>&#x2717;</button>
      </div>
    {:else}
      <div class="w-full italic text-center">No bookmarks saved</div>
    {/each}
  </div>
  <div class="w-full absolute bottom-0 left-0 right-0">
    <Button on:click={addBookmark}>Save current tab</Button>
  </div>
</section>
