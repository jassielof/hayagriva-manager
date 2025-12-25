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

  let mainValue = $derived.by(() => {
    if (typeof value === 'object' && value) return value.value;
    if (typeof value === 'string') return value;
  });

  let shortValue = $derived.by(() => {
    if (typeof value === 'object' && value) return value.short;
    if (typeof value === 'string') return undefined;
  });

  let verbatimValue = $derived.by(() => {
    if (typeof value === 'object' && value) return value.verbatim;
    if (typeof value === 'string') return undefined;
  });

  $effect(() => {
    if (shortValue || verbatimValue) {
      value = {
        value: mainValue!,
        short: shortValue,
        verbatim: verbatimValue
      };
    } else {
      value = mainValue!;
    }
  });
</script>

<fieldset
  class="fieldset bg-base-200/30 border-base-300 space-y-4 rounded-lg border p-5"
>
  <legend class="fieldset-legend px-2 text-sm font-semibold">{label}</legend>

  <div class="form-control w-full">
    {#if multiline}
      <label class="label" for="textarea-entry-{label}">
        <span class="label-text font-medium">{label}</span>
      </label>
      <textarea
        id="textarea-entry-{label}"
        class="textarea textarea-bordered w-full"
        {placeholder}
        rows="4"
        bind:value={mainValue}
      ></textarea>
    {:else}
      <label for="main-value-{label}" class="label">
        <span class="label-text font-medium">{label}</span>
      </label>
      <input
        id="main-value-{label}"
        type="text"
        class="input input-bordered w-full"
        {placeholder}
        bind:value={mainValue}
      />
    {/if}
  </div>

  <div class="form-control w-full">
    <label for="short-form-{label}" class="label">
      <span class="label-text text-sm font-medium">Short form</span>
      <span class="label-text-alt text-base-content/60">Optional</span>
    </label>
    <input
      id="short-form-{label}"
      type="text"
      placeholder={shortPlaceholder}
      class="input input-bordered input-sm w-full"
      bind:value={shortValue}
    />
    <label for="short-form-{label}" class="label">
      <span class="label-text-alt text-base-content/60"
        >Abbreviated version for citations</span
      >
    </label>
  </div>

  <div class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
      <input
        type="checkbox"
        class="checkbox checkbox-sm"
        bind:checked={verbatimValue}
      />
      <span class="label-text font-medium">Verbatim</span>
      <span class="label-text-alt text-base-content/60"
        >(Use exact formatting)</span
      >
    </label>
  </div>
</fieldset>
