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

<!-- FIXME: Improve the design of this input, just make it show all, without a detailed checkbox. -->
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
  <input
    type="checkbox"
    class="checkbox"
    bind:checked={showAdvanced}
    onchange={updateValue}
  />
  Detailed {label}
</label>

{#if showAdvanced}
  <fieldset
    class="fieldset bg-base-300/50 border-base-content/20 rounded-box gap-2 border p-4"
  >
    <legend class="fieldset-legend">Detailed {label}</legend>

    <label for="short-form" class="label">Short form</label>
    <input
      id="short-form"
      type="text"
      class="input input-sm w-full"
      bind:value={shortValue}
      oninput={updateValue}
    />

    <label class="label">
      <input
        type="checkbox"
        class="checkbox checkbox-sm"
        bind:checked={verbatimValue}
        onchange={updateValue}
      />
      Verbatim
    </label>
  </fieldset>
{/if}
