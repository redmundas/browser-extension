<script lang="ts">
  export let checked = false;
</script>

<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" role="switch" class="sr-only peer" bind:checked on:change />
  <div
    class="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 hover:peer-checked:bg-blue-700"
  ></div>
</label>
