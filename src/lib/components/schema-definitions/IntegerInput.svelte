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

<div class="form-control w-full">
  <label for="integer-input-{label}" class="label">
    <span class="label-text font-medium">{label}</span>
    <span class="label-text-alt text-base-content/60">Optional</span>
  </label>
  <input
    type="number"
    min={naturalSet ? '0' : undefined}
    id="integer-input-{label}"
    class="input input-bordered w-full"
    bind:value
    {placeholder}
  />
</div>
