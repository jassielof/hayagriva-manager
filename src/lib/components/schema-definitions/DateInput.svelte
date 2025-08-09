<script lang="ts">
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import { datePattern } from '$lib/validators/date';

  let {
    value = $bindable(),
    label,
    placeholder
  }: {
    value: BibliographyEntry['date'];
    label: string;
    placeholder?: string;
  } = $props();
</script>

<label class="label" for="entry-date">{label} </label>
<input
  pattern={datePattern}
  title="Date must match the format: YYYY, YYYY-MM, or YYYY-MM-DD"
  bind:value
  id="entry-date"
  type="text"
  class="input validator w-full"
  {placeholder}
/>
