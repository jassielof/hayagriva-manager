<script lang="ts">
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import { datePattern } from '$lib/validators/date';

  let {
    value = $bindable(),
    label = 'Date',
    placeholder = '2025, 2020-12, or 2010-12-30'
  }: {
    value?: BibliographyEntry['date'];
    label?: string;
    placeholder?: string;
  } = $props();

  $effect(() => {
    if (typeof value === 'string' && /^-?\d+$/.test(value)) {
      value = parseInt(value);
    }
  });
</script>

<div class="form-control w-full">
  <label class="label" for="entry-date">
    <span class="label-text font-medium">{label}</span>
  </label>
  <input
    pattern={datePattern}
    title="Date must match the format: YYYY, YYYY-MM, or YYYY-MM-DD."
    bind:value
    id="entry-date"
    type="text"
    class="input input-bordered w-full"
    {placeholder}
  />
  <label class="label">
    <span class="label-text-alt text-base-content/60"
      >Year, Year-Month, or full YYYY-MM-DD format</span
    >
  </label>
</div>
