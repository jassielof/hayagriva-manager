<script lang="ts">
  import type { FormattableString } from '$lib/types/formattable-string';
  let {
    value = $bindable(),
    label,
    placeholder,
    multiline = false
  }: {
    value: FormattableString;
    label: string;
    placeholder: string;
    multiline?: boolean;
  } = $props();

  let showAdvanced = $state(typeof value === 'object' && value !== null);
  let mainValue = $state('');
  let shortValue = $state('');
  let verbatimValue = $state(false);

  $effect(() => {
    if (typeof value === 'string') {
      mainValue = value;
      shortValue = '';
      verbatimValue = false;
      showAdvanced = false;
    } else if (value && typeof value === 'object') {
      mainValue = value.value || '';
      shortValue = value.short || '';
      verbatimValue = value.verbatim || false;
      showAdvanced = true;
    }
  });

  function updateValue() {
    if (showAdvanced) {
      const newValue: any = {
        value: mainValue
      };
      if (shortValue) newValue.short = shortValue;
      if (verbatimValue) newValue.verbatim = verbatimValue;
      value = newValue;
    } else {
      value = mainValue;
    }
  }
</script>

{#if multiline}
  <label class="label" for="textarea-entry">{label}</label>
  <textarea
    id="textarea-entry"
    class="textarea w-full"
    {placeholder}
    bind:value={mainValue}
    oninput={updateValue}
  ></textarea>
{:else}
  <label for="main-value" class="label">{label}</label>
  <input
    id="main-value"
    type="text"
    class="input w-full"
    {placeholder}
    bind:value={mainValue}
    oninput={updateValue}
  />
{/if}

<label class="label mt-4">
  <input type="checkbox" class="checkbox" bind:checked={showAdvanced} onchange={updateValue} />
  Advanced {label}
</label>

{#if showAdvanced}
  <fieldset class="fieldset bg-base-300 border-base-300 rounded-box border p-4">
    <legend class="fieldset-legend">Advanced {label}</legend>

    <label for="short-form" class="label">Short form</label>
    <input id="short-form" type="text" class="input" bind:value={shortValue} oninput={updateValue} />

    <label class="label mt-4">
      <input type="checkbox" class="checkbox" bind:checked={verbatimValue} onchange={updateValue} />
      Verbatim
    </label>
  </fieldset>
{/if}
