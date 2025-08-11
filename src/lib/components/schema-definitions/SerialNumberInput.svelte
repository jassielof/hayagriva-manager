<script lang="ts">
  import type { BibliographyEntry } from '$lib/types/hayagriva';

  // TODO: Implement Serial Number input component
  let {
    value = $bindable(),
    label = 'Serial Number',
    placeholder = 'SN12345'
  }: {
    value: BibliographyEntry['serial-number'];
    label?: string;
    placeholder?: string;
  } = $props();

  $effect(() => {});
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
</fieldset>
