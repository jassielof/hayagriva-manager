<script lang="ts">
  import type { FormattableString } from '$lib/types/hayagriva-definitions';
  import { ChevronsUpDown } from '@lucide/svelte';

  const { value, label, placeholder, update } = $props<{
    value: FormattableString | undefined | null;
    label: string;
    placeholder: string;
    update: (newValue: FormattableString | undefined) => void;
  }>();

  let showAdvanced = $state(false);

  const isObject = $derived(typeof value === 'object' && value !== null);

  let mainValue = $derived(value ? (isObject ? value.value : value) : '');
  let shortValue = $derived(isObject ? (value.short ?? '') : '');
  let verbatimValue = $derived(isObject ? (value.verbatim ?? false) : false);

  $effect(() => {
    if (isObject) {
      showAdvanced = true;
    }
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

<div class="form-control w-full">
  <div class="label">
    <span class="label-text">{label}</span>
    <button
      class="btn btn-xs btn-ghost gap-1"
      onclick={() => (showAdvanced = !showAdvanced)}
      title="Toggle advanced options"
    >
      Advanced
      <ChevronsUpDown class="size-3" />
    </button>
  </div>
  <input
    type="text"
    {placeholder}
    class="input input-bordered w-full"
    bind:value={mainValue}
    oninput={handleUpdate}
  />

  {#if showAdvanced}
    <div class="border-base-300 bg-base-200/30 mt-2 flex flex-col gap-2 rounded-md border p-2">
      <label class="form-control w-full">
        <div class="label pb-1 pt-0">
          <span class="label-text text-xs">Short Form</span>
        </div>
        <input
          type="text"
          placeholder="A shorter version for citations"
          class="input input-sm input-bordered w-full"
          bind:value={shortValue}
          oninput={handleUpdate}
        />
      </label>
      <div class="form-control">
        <label class="label cursor-pointer py-1">
          <span class="label-text text-xs">Verbatim</span>
          <input
            type="checkbox"
            class="toggle toggle-sm"
            bind:checked={verbatimValue}
            onchange={handleUpdate}
          />
        </label>
        <p class="text-xs opacity-60">Disables automatic case transformations.</p>
      </div>
    </div>
  {/if}
</div>
