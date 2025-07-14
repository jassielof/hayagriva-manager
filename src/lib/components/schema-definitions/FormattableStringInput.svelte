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

<div class="w-full">
  <label class="input w-full">
    <span class="label">{label}</span>
    <div class="join w-full">
      {#if multiline}
        <textarea
          class="textarea join-item"
          {placeholder}
          bind:value={mainValue}
          rows="4"
          oninput={handleUpdate}
        ></textarea>
      {:else}
        <input
          type="text"
          class="join-item"
          {placeholder}
          bind:value={mainValue}
          oninput={handleUpdate}
        />
      {/if}
      <button
        class="btn btn-xs btn-ghost join-item gap-1"
        type="button"
        onclick={() => (showAdvanced = !showAdvanced)}
      >
        Advanced
        <ChevronsUpDown class="size-3" />
      </button>
    </div>
  </label>

  {#if showAdvanced}
    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
      <legend class="fieldset-legend">Advanced {label}</legend>

      <label class="input w-full">
        <span class="label">Short Form</span>
        <input type="text" bind:value={shortValue} oninput={handleUpdate} />
      </label>

      <label class="label w-full">
        <input
          type="checkbox"
          class="toggle"
          bind:checked={verbatimValue}
          onchange={handleUpdate}
        />
        Verbatim
      </label>
    </fieldset>
  {/if}
</div>
