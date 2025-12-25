<script lang="ts">
  import type { BibliographyEntry } from '$lib/types/hayagriva';

  let {
    value = $bindable(),
    label = 'Publisher',
    placeholder = 'Pearson',
    locationPlaceholder = 'USA'
  }: {
    value: BibliographyEntry['publisher'];
    label?: string;
    placeholder?: string;
    locationPlaceholder?: string;
  } = $props();

  let publisherName = $state('');
  let publisherLocation: undefined | string = $state(undefined);

  $effect(() => {
    if (typeof value === 'string') {
      publisherName = value;
      publisherLocation = undefined;
    } else if (value && typeof value === 'object') {
      publisherName = value.name;
      publisherLocation = value.location;
    } else {
      publisherName = '';
      publisherLocation = undefined;
    }
  });

  $effect(() => {
    if (!publisherName) {
      value = undefined;
    } else if (!publisherLocation) {
      value = publisherName;
    } else {
      value = {
        name: publisherName,
        location: publisherLocation
      };
    }
  });
</script>

<fieldset
  class="fieldset bg-base-100/50 border-base-300 rounded-box border p-4"
>
  <legend class="fieldset-legend"> {label} </legend>
  <label for="publisher-entry" class="label">{label}</label>
  <input
    type="text"
    id="publisher-entry"
    class="input validator w-full"
    bind:value={publisherName}
    {placeholder}
    required={publisherLocation ? true : false}
  />

  <label for="publisher-entry" class="label">Location of {label}</label>
  <input
    type="text"
    id="publisher-entry"
    class="input w-full"
    bind:value={publisherLocation}
    placeholder={locationPlaceholder}
  />
</fieldset>
