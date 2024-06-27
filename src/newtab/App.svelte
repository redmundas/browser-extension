<script lang="ts">
  import { writable } from 'svelte/store';
  import browser from 'webextension-polyfill';

  import Button from '../libs/components/Button.svelte';
  import { getTopVisits } from '../libs/history';
  import { requestPermissions } from '../libs/permissions';
  import { getContext } from '../libs/svelte/context';
  import { faviconUrl } from '../libs/utils';

  const entries = writable<Array<browser.History.HistoryItem>>([]);
  const { permissions } = getContext();

  async function onRequestHistory() {
    await requestPermissions({ permissions: ['history'] });
  }

  permissions.subscribe(async ({ history }) => {
    if (!history) return;
    $entries = await getTopVisits();
  });
</script>

<main class="w-full h-full flex items-center justify-center text-sm">
  {#if $permissions.history}
    <div class="w-96 flex flex-col gap-y-2">
      <h3 class="font-semibold">Top Visits</h3>
      <div class="w-full border rounded-lg p-4 flex flex-col gap-y-3">
        {#each $entries as { title, url, visitCount }}
          <a href={url} class="w-full truncate flex items-center gap-x-2">
            <div class="w-[16px] h-[16px] flex items-center justify-center">
              <img src={faviconUrl(url ?? '')} alt="icon" class="max-w-[16px] max-h-[16px]" />
            </div>
            <span class="truncate flex-1">{title || url}</span>
            <span class="bg-slate-100 rounded-xl px-2 py-1 text-xs">{visitCount}</span>
          </a>
        {/each}
      </div>
    </div>
  {:else}
    <Button on:click={onRequestHistory}>Enable history permission</Button>
  {/if}
</main>
