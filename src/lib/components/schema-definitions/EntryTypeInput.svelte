<script lang="ts">
  import { formatEntryType } from '$lib/formatters/entry-type-formatter';
  import type { Type } from '$lib/types/hayagriva';
  import { ENTRY_TYPES } from '$lib/validators/entry-type';

  let {
    value = $bindable()
  }: {
    value: Type;
  } = $props();
</script>

<div class="form-control w-full">
  <label for="entry-type" class="label">
    <span class="label-text font-semibold"
      >Entry Type<span class="text-error ml-1">*</span></span
    >
  </label>
  <select
    id="entry-type"
    class="select select-bordered w-full"
    bind:value
    required
    aria-required="true"
  >
    <option disabled selected>Select an entry type</option>
    {#each ENTRY_TYPES as type}
      {@const { label } = formatEntryType(type)}
      <option value={type}>
        {label}
      </option>
    {/each}
  </select>
  <label for="entry-type" class="label">
    <span class="label-text-alt text-base-content/60"
      >The type of bibliographic entry (book, article, etc.)</span
    >
  </label>
</div>
