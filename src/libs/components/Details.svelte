<script lang="ts">
  export let open = false;
</script>

<details bind:open class:w-full={true} {...$$restProps} on:change>
  <summary class="flex w-full items-center cursor-pointer">
    <slot name="summary" />
  </summary>
  <div class="w-full">
    <slot />
  </div>
</details>
