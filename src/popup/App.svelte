<script lang="ts">
  import { writable } from 'svelte/store';
  import browser from 'webextension-polyfill';

  import Toggle from '../libs/components/Toggle.svelte';
  import { removePermissions, requestPermissions } from '../libs/permissions';
  import { getContext } from '../libs/svelte/context';

  const { components, permissions, port } = getContext();
  const panel = writable($components.panel);
  const history = writable($permissions.history);
  const widget = writable($components.widget);

  function onToggleWidget() {
    port.postMessage('toggle_component', { name: 'widget' });
  }

  async function onTogglePanel() {
    const value = $panel;
    if (value) {
      const window = await browser.windows.getLastFocused();
      // only supported by chrome
      await chrome.sidePanel.open({ windowId: window.id });
    } else {
      port.postMessage('disable_component', { name: 'panel' });
    }
  }

  async function onToggleHistory() {
    const value = $history;
    if (value) {
      await requestPermissions({ permissions: ['history'] });
    } else {
      await removePermissions({ permissions: ['history'] });
    }
  }
</script>

<main class="w-full p-4 flex flex-col gap-y-4">
  <section class="w-full flex flex-col gap-y-2">
    <h3 class="font-semibold">UI Components</h3>
    <div class="w-full flex flex-col gap-y-2">
      <div class="w-full flex items-center justify-between">
        <h5>Panel</h5>
        <Toggle bind:checked={$panel} on:change={onTogglePanel} />
      </div>
      <div class="w-full flex items-center justify-between">
        <h5>Widget</h5>
        <Toggle bind:checked={$widget} on:change={onToggleWidget} />
      </div>
    </div>
  </section>

  <section class="w-full flex flex-col gap-y-2">
    <h3 class="font-semibold">Optional permissions</h3>
    <div class="w-full flex flex-col gap-y-2">
      <div class="w-full flex items-center justify-between">
        <h5>History</h5>
        <Toggle bind:checked={$history} on:change={onToggleHistory} />
      </div>
    </div>
  </section>
</main>
