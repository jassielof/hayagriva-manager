<script lang="ts">
  import { X } from '@lucide/svelte';

  let {
    value = $bindable(),
    label = '',
    placeholder = '00:00'
  }: {
    value?: string;
    label?: string;
    placeholder?: string;
  } = $props();

  let days = $state(0);
  let hours = $state(0);
  let minutes = $state(0);
  let seconds = $state(0);
  let milliseconds = $state(0);

  function parseTimestamp(ts: string | undefined) {
    if (!ts) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
      milliseconds = 0;
      return;
    }

    const [timePart, msPart] = ts.split(',');
    milliseconds = msPart ? parseInt(msPart) : 0;

    const parts = timePart.split(':').map(Number);
    if (parts.length === 2) {
      // MM:SS
      [minutes, seconds] = parts;
      hours = 0;
      days = 0;
    } else if (parts.length === 3) {
      // HH:MM:SS
      [hours, minutes, seconds] = parts;
      days = 0;
    } else if (parts.length === 4) {
      // DD:HH:MM:SS
      [days, hours, minutes, seconds] = parts;
    }
  }

  function formatTimestamp() {
    if (!days && !hours && !minutes && !seconds && !milliseconds) {
      value = undefined;
      return;
    }

    let parts = [];
    if (days > 0) {
      parts.push(String(days).padStart(2, '0'));
    }
    if (days > 0 || hours > 0) {
      parts.push(String(hours).padStart(2, '0'));
    }
    parts.push(String(minutes).padStart(2, '0'));
    parts.push(String(seconds).padStart(2, '0'));

    let timeString = parts.join(':');

    if (milliseconds > 0) {
      timeString += `,${milliseconds}`;
    }

    value = timeString;
  }

  $effect(() => {
    parseTimestamp(value);
  });

  $effect(() => {
    formatTimestamp();
  });

  function clearInput() {
    value = undefined;
  }
</script>
<!-- FIXME: UI -->
<div class="form-control w-full">
  {#if label}
    <label for={label} class="label">
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <div class="join w-full">
    <input
      type="number"
      min="0"
      placeholder="DD"
      class="input join-item input-bordered w-1/5"
      bind:value={days}
    />
    <input
      type="number"
      min="0"
      max="23"
      placeholder="HH"
      class="input join-item input-bordered w-1/5"
      bind:value={hours}
    />
    <input
      type="number"
      min="0"
      max="59"
      placeholder="MM"
      class="input join-item input-bordered w-1/5"
      bind:value={minutes}
    />
    <input
      type="number"
      min="0"
      max="59"
      placeholder="SS"
      class="input join-item input-bordered w-1/5"
      bind:value={seconds}
    />
    <input
      type="number"
      min="0"
      max="999"
      placeholder="ms"
      class="input join-item input-bordered w-1/5"
      bind:value={milliseconds}
    />
    {#if value}
      <button class="btn btn-square join-item" onclick={clearInput}>
        <X class="h-4 w-4" />
      </button>
    {/if}
  </div>
</div>
