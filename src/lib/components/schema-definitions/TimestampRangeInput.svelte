<script lang="ts">
  import TimestampInput from './TimestampInput.svelte';
  import { X } from '@lucide/svelte';

  let {
    value = $bindable(),
    label
  }: {
    value?: string;
    label?: string;
  } = $props();

  let start: string | undefined = $state();
  let end: string | undefined = $state();

  function parseRange(range: string | undefined) {
    if (range && range.includes('-')) {
      const [startStr, endStr] = range.split('-');
      start = startStr;
      end = endStr;
    } else {
      start = undefined;
      end = undefined;
    }
  }

  function formatRange() {
    if (start && end) {
      value = `${start}-${end}`;
    } else {
      value = undefined;
    }
  }

  $effect(() => {
    parseRange(value);
  });

  $effect(() => {
    formatRange();
  });

  function clearInput() {
    value = undefined;
  }
</script>

<div class="form-control w-full">
  {#if label}
    <label for={label} class="label">
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <div class="flex items-center gap-2">
    <div class="flex-1">
      <TimestampInput bind:value={start} />
    </div>
    <span>-</span>
    <div class="flex-1">
      <TimestampInput bind:value={end} />
    </div>
    {#if value}
      <button class="btn btn-square" onclick={clearInput}>
        <X class="h-4 w-4" />
      </button>
    {/if}
  </div>
</div>
