<script lang="ts">
  import type { FormattableString } from '$lib/types/formattable-string';
  let {
    value = $bindable(),
    label,
    placeholder,
    shortPlaceholder = 'Optional short form',
    multiline = false
  }: {
    value?: FormattableString;
    label: string;
    placeholder: string;
    shortPlaceholder?: string;
    multiline?: boolean;
  } = $props();

  let mainValue = $state('');
  let shortValue = $state('');
  let verbatimValue = $state(false);

  $effect(() => {
    if (typeof value === 'string') {
      mainValue = value;
      shortValue = '';
      verbatimValue = false;
    } else if (value && typeof value === 'object') {
      mainValue = value.value || '';
      shortValue = value.short || '';
      verbatimValue = value.verbatim || false;
    } else {
      mainValue = '';
      shortValue = '';
      verbatimValue = false;
    }
  });

  $effect(() => {
    if (!mainValue) {
      value = undefined;
    } else if (!shortValue && !verbatimValue) {
      value = mainValue;
    } else {
      const newValue: any = {
        value: mainValue
      };
      if (shortValue) newValue.short = shortValue;
      if (verbatimValue) newValue.verbatim = verbatimValue;
      value = newValue;
    }
  });
</script>

<fieldset
  class="fieldset bg-base-100/50 border-base-300 rounded-box border p-4"
>
  <legend class="fieldset-legend">{label}</legend>

  {#if multiline}
    <label class="label" for="textarea-entry">{label}</label>
    <textarea
      id="textarea-entry"
      class="textarea w-full"
      {placeholder}
      bind:value={mainValue}
    ></textarea>
  {:else}
    <label for="main-value" class="label">{label}</label>
    <input
      id="main-value"
      type="text"
      class="input w-full"
      {placeholder}
      bind:value={mainValue}
    />
  {/if}

  <label for="short-form" class="label">Short form of {label}</label>
  <input
    id="short-form"
    type="text"
    placeholder={shortPlaceholder}
    class="input w-full"
    bind:value={shortValue}
  />

  <label class="label mt-2 font-mono">
    <input type="checkbox" class="checkbox" bind:checked={verbatimValue} />
    Verbatim
  </label>
</fieldset>
