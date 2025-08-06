<script lang="ts">
  import type { FormattableString } from '$lib/types/formattable-string';
  import { ChevronsUpDown } from '@lucide/svelte';
  // FIXME: Type safety is not const {} = props<{}> but const {}: {} = $props()
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
  <label class="label" for="textarea-entry">{label}</label>
  <textarea
    id="textarea-entry"
    class="textarea"
    {placeholder}
    bind:value={mainValue}
    rows="4"
    oninput={handleUpdate}
  ></textarea>
{:else}
  <label for="main-value" class="label">{label}</label>
  <input
    id="main-value"
    type="text"
    class="input"
    {placeholder}
    bind:value={mainValue}
    oninput={handleUpdate}
  />
{/if}
<label class="label">
  <input type="checkbox" class="checkbox" bind:checked={showAdvanced} />
  Advanced
</label>

{#if showAdvanced}
  <fieldset
    class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
  >
    <legend class="fieldset-legend">Advanced {label}</legend>
    <label for="short-form" class="label">Short Form</label>
    <input
      id="short-form"
      type="text"
      class="input"
      bind:value={shortValue}
      oninput={handleUpdate}
    />
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
