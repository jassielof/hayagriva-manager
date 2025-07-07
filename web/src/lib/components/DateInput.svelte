<script lang="ts">
  import type { HayagrivaDate } from '$lib/types/hayagriva-definitions';

  const { value, label, placeholder, update } = $props<{
    value: HayagrivaDate | undefined | null;
    label: string;
    placeholder?: string;
    update: (newValue: HayagrivaDate | undefined) => void;
  }>();

  // Regex from the Hayagriva schema to validate date strings.
  const DATE_REGEX = /^([+-~]?\d{4,})(-(0[1-9]|1[0-2])(-(0[1-9]|[12][0-9]|3[01]))?)?$/;
  const YEAR_ONLY_REGEX = /^\d{4,}$/;

  let inputValue = $state(value?.toString() ?? '');
  let isValid = $state(true);
  let isFocused = $state(false);

  $effect(() => {
    // Only sync from the external prop if the user is not currently editing the input.
    if (!isFocused) {
      inputValue = value?.toString() ?? '';
      validate(inputValue);
    }
  });

  function validate(currentValue: string) {
    if (currentValue === '') {
      isValid = true;
      return;
    }
    isValid = DATE_REGEX.test(currentValue);
  }

  function handleInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const currentValue = target.value;
    inputValue = currentValue;
    validate(currentValue);

    if (isValid) {
      if (currentValue === '') {
        update(undefined);
      } else if (YEAR_ONLY_REGEX.test(currentValue)) {
        // If it's just a year, store it as a number per the schema.
        update(parseInt(currentValue, 10));
      } else {
        update(currentValue);
      }
    } else {
      // If the input is invalid, we still need to inform the parent
      // so the data is cleared, preventing it from reverting.
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
