<script lang="ts">
  import type { NumericOrString } from '$lib/types/hayagriva';

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

<label class="label" for="numeric-or-string">{label}</label>
<input
  class="input w-full"
  type="text"
  id="numeric-or-string"
  {placeholder}
  bind:value
/>
