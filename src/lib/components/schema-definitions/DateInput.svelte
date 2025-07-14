<script lang="ts">
  import type { Date } from '$lib/types/hayagriva';
  import { isValidDate } from '$lib/validators/date';

  const { value, label, placeholder, update } = $props<{
    value: Date | undefined | null;
    label: string;
    placeholder?: string;
    update: (newValue: Date | undefined) => void;
  }>();

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

<label class="input w-full">
  <span class="label">{label}</span>
  <input
    type="text"
    {placeholder}
    class:input-error={!isValid && inputValue !== ''}
    value={inputValue}
    oninput={handleInput}
    onfocus={() => (isFocused = true)}
    onblur={() => (isFocused = false)}
  />
</label>
{#if !isValid && inputValue !== ''}
  <p class="label">Invalid format. Use YYYY, YYYY-MM, or YYYY-MM-DD.</p>
{/if}
