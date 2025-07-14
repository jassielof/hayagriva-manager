<script lang="ts">
  import { ENTRY_TYPES } from '$lib/validators/entry-type';

  let { value, onUpdate } = $props<{
    value: string | undefined;
    onUpdate: (value: string | undefined) => void;
  }>();

  function handleChange(e: Event) {
    const target = e.currentTarget as HTMLSelectElement;
    if (target.value) onUpdate(target.value);
  }
</script>

<label class="select w-full">
  <span class="label">Type</span>
  <select class="select" bind:value onchange={handleChange}>
    <option disabled selected>Select an entry type</option>
    {#each ENTRY_TYPES as type}
      <option value={type}>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</option>
    {/each}
  </select>
</label>
