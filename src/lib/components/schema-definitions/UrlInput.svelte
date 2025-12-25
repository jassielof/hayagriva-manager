<script lang="ts">
  import type { BibliographyEntry, URL } from '$lib/types/hayagriva';
  import DateInput from './DateInput.svelte';

  let {
    value = $bindable(),
    label = 'URL',
    placeholder = 'https://example.com'
  }: {
    value?: URL;
    label?: string;
    placeholder?: string;
  } = $props();

  let urlValue = $derived.by(() => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return value.value;
  });

  let dateValue: BibliographyEntry['date'] = $derived.by(() => {
    if (typeof value === 'string') return undefined;
    if (typeof value === 'object') return value.date;
  });

  $effect(() => {
    if (dateValue) {
      value = { value: urlValue!, date: dateValue };
    } else {
      value = urlValue;
    }
  });
</script>

<fieldset
  class="fieldset bg-base-200/30 border-base-300 space-y-4 rounded-lg border p-5"
>
  <legend class="fieldset-legend px-2 text-sm font-semibold">{label}</legend>

  <div class="form-control w-full">
    <label class="label" for="entry-url">
      <span class="label-text font-medium">{label}</span>
    </label>
    <input
      bind:value={urlValue}
      id="entry-url"
      type="url"
      class="input input-bordered w-full"
      {placeholder}
      required={dateValue ? true : false}
    />
    <label class="label">
      <span class="label-text-alt text-base-content/60"
        >Full URL including https://</span
      >
    </label>
  </div>

  <DateInput bind:value={dateValue} label="Visit/Access Date" />
</fieldset>
