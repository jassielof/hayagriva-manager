<script lang="ts">
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import DateInput from './DateInput.svelte';

  let {
    value = $bindable(),
    label = 'URL',
    placeholder = 'https://example.com'
  }: {
    value: BibliographyEntry['url'];
    label?: string;
    placeholder?: string;
  } = $props();

  let urlValue = $state('');
  let dateValue: BibliographyEntry['date'] = $state(undefined);

  $effect(() => {
    if (typeof value === 'string') {
      urlValue = value;
      dateValue = undefined;
    } else if (value && typeof value === 'object') {
      urlValue = value.value;
      dateValue = value.date;
    } else {
      urlValue = '';
      dateValue = undefined;
    }
  });

  $effect(() => {
    if (!urlValue) {
      value = undefined;
    } else if (!dateValue) {
      value = urlValue;
    } else {
      value = {
        value: urlValue,
        date: dateValue
      };
    }
  });
</script>

<fieldset
  class="fieldset bg-base-100/50 border-base-300 rounded-box border p-4"
>
  <legend class="fieldset-legend"> {label} </legend>

  <label class="label" for="entry-url">{label}</label>
  <input
    bind:value={urlValue}
    id="entry-url"
    type="url"
    class="input validator w-full"
    {placeholder}
    required={dateValue ? true : false}
  />

  <DateInput bind:value={dateValue} />
</fieldset>
