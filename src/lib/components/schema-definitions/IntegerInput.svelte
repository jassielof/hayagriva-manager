<script lang="ts">
  let {
    value = $bindable(),
    label,
    naturalSet = false,
    placeholder
  }: {
    value?: number;
    label: string;
    naturalSet?: boolean;
    placeholder: string;
  } = $props();
</script>

<label for="integer-input" class="label">{label}</label>
<input
  type="number"
  min={naturalSet ? '0' : undefined}
  id="integer-input"
  class="input w-full"
  bind:value
  {placeholder}
/>
