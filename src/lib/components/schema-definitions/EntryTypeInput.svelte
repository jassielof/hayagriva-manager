<script lang="ts">
  import {
    ENTRY_TYPES,
    formatEntryType
  } from '$lib/formatters/entry-type-formatter';
  import type { Type } from '$lib/types/hayagriva';

  let {
    value = $bindable()
  }: {
    value: Type;
  } = $props();
</script>

<label for="entry-type" class="label">Type </label>
<select id="entry-type" class="select w-full" bind:value>
  <option disabled selected>Select an entry type</option>
  {#each ENTRY_TYPES as type}
    {@const { label } = formatEntryType(type)}
    <option value={type}>
      {label}
    </option>
  {/each}
</select>
