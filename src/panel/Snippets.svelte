<script lang="ts">
  import Copy from 'svelte-octicons/lib/Copy16.svelte';
  import Link from 'svelte-octicons/lib/LinkExternal16.svelte';
  import Trash from 'svelte-octicons/lib/Trash16.svelte';

  import Details from '../libs/components/Details.svelte';
  import { clipboard } from '../libs/svelte/clipboard';
  import { getContext } from '../libs/svelte/context';
  import { getHostname } from '../libs/urls';
  import { faviconUrl } from '../libs/utils';

  const { port, snippets } = getContext();

  function removeSnippet(id: string) {
    return () => {
      port.postMessage('remove_snippet', { id });
    };
  }
</script>

<section class="flex-1 w-full flex flex-col divide-y text-sm">
  {#each $snippets as { id, content, title, url }}
    <Details class="py-2">
      <div slot="summary" class="flex w-full truncate items-center gap-x-2">
        {#if url}
          <span class="w-[16px] h-[16px] flex items-center justify-center flex-0">
            <img src={faviconUrl(url)} alt="icon" class="max-w-[16px] max-h-[16px]" />
          </span>
        {/if}
        <span class="truncate flex-1">{title}</span>
      </div>
      <div class="w-full flex flex-col gap-y-2 pt-2">
        <div>{content}</div>
        <div class="w-full flex items-center justify-between">
          <button use:clipboard={{ trigger: 'click', text: content }}><Copy fill="#2563eb" /></button>
          {#if url}
            <a href={url} target="_blank" class="text-blue-600 flex items-center gap-x-2">
              <span>{getHostname(url)}</span>
              <Link fill="#2563eb" />
            </a>
          {/if}
          <button on:click|stopPropagation={removeSnippet(id)}><Trash fill="#be123c" /></button>
        </div>
      </div>
    </Details>
  {:else}
    <div class="w-full italic text-center">No snippets saved</div>
  {/each}
</section>
