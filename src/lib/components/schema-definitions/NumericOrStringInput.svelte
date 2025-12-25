<script lang="ts">
  import type { NumericOrString } from '$lib/types/numeric-or-string';

  let {
    value = $bindable(),
    label,
    placeholder
  }: {
    value?: NumericOrString;
    label: string;
    placeholder: string;
  } = $props();

  $effect(() => {
    if (typeof value === 'string' && !isNaN(Number(value))) {
      value = Number(value);
    }
  });
</script>

<div class="form-control w-full">
  <label class="label" for="numeric-or-string">
    <span class="label-text font-medium">{label}</span>
    <span class="label-text-alt text-base-content/60">Optional</span>
  </label>
  <input
    class="input input-bordered w-full"
    type="text"
    id="numeric-or-string"
    {placeholder}
    bind:value
  />
</div>
