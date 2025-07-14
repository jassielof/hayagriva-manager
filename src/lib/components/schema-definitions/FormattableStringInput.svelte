<script lang="ts">
  import type { FormattableString } from '$lib/types/formattable-string';
  import { ChevronsUpDown } from '@lucide/svelte';

  const {
    value,
    label,
    placeholder,
    update,
    multiline = false
  } = $props<{
    value: FormattableString | undefined | null;
    label: string;
    placeholder: string;
    update: (newValue: FormattableString | undefined) => void;
    multiline?: boolean;
  }>();

  const isObject = $derived(typeof value === 'object' && value !== null);
  let showAdvanced = $state(typeof value === 'object' && value !== null);

  let mainValue = $derived(value ? (isObject ? value.value : value) : '');
  let shortValue = $derived(isObject ? (value.short ?? '') : '');
  let verbatimValue = $derived(isObject ? (value.verbatim ?? false) : false);

  $effect(() => {
    showAdvanced = isObject;
  });

  function handleUpdate() {
    if (shortValue === '' && !verbatimValue) {
      update(mainValue || undefined);
    } else {
      update({
        value: mainValue || '',
        short: shortValue || undefined,
        verbatim: verbatimValue || undefined
      });
    }
  }
</script>

{#if multiline}
  <label for="textarea-entry">{label}</label>
  <textarea
    id="textarea-entry"
    class="textarea"
    {placeholder}
    bind:value={mainValue}
    rows="4"
    oninput={handleUpdate}
  ></textarea>
{:else}
  <label class="input">
    <span class="label">{label}</span>
    <input type="text" {placeholder} bind:value={mainValue} oninput={handleUpdate} />
  </label>
{/if}
<label class="label">
  <input type="checkbox" class="checkbox" bind:checked={showAdvanced} />
  Advanced
</label>

{#if showAdvanced}
  <fieldset class="fieldset">
    <legend class="fieldset-legend">Advanced {label}</legend>
    <label class="input">
      <span class="label">Short Form</span>
      <input type="text" bind:value={shortValue} oninput={handleUpdate} />
    </label>
    <label class="label">
      <input
        type="checkbox"
        class="checkbox"
        bind:checked={verbatimValue}
        onchange={handleUpdate}
      />
      Verbatim
    </label>
  </fieldset>
{/if}
