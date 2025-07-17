<script lang="ts">
  import type { Date } from '$lib/types/hayagriva';
  import { isValidDate } from '$lib/validators/date';

  const {
    value,
    label,
    placeholder,
    update
  }: {
    value: Date | undefined | null;
    label: string;
    placeholder?: string;
    update: (newValue: Date | undefined) => void;
  } = $props();

  let inputValue = $state(value?.toString() ?? '');
  let isValid = $state(true);
  let isFocused = $state(false);

  // Helper: is this a year-only string (for number conversion)?
  function isYearOnly(val: string) {
    // Accepts optional +, -, ~, then 4+ digits, and nothing else
    return /^([+-~]?\d{4,})$/.test(val);
  }

  $effect(() => {
    if (!isFocused) {
      inputValue = value?.toString() ?? '';
      isValid = isValidDate(inputValue);
    }
  });

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const currentValue = target.value;
    inputValue = currentValue;
    isValid = isValidDate(currentValue);

    if (isValid) {
      if (currentValue === '') {
        update(undefined);
      } else if (isYearOnly(currentValue)) {
        // Store as number if possible
        const yearNum = Number(currentValue);
        update(Number.isNaN(yearNum) ? currentValue : yearNum);
      } else {
        update(currentValue);
      }
    } else {
      update(undefined);
    }
  }
</script>

<label class="label" for="entry-date">{label} </label>
<input
  id="entry-date"
  type="text"
  class="input validator"
  {placeholder}
  value={inputValue}
  oninput={handleInput}
  onfocus={() => (isFocused = true)}
  onblur={() => (isFocused = false)}
/>
{#if !isValid && inputValue !== ''}
  <p class="validator-hint">
    Invalid format. Use YYYY, YYYY-MM, or YYYY-MM-DD.
  </p>
{/if}
