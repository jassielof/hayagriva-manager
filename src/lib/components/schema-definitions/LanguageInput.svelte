<script lang="ts">
  import type { Language } from '$lib/types/hayagriva';
  import { isValidLanguage } from '$lib/validators/language';

  let { value, onUpdate } = $props<{
    value: Language | undefined;
    onUpdate: (value: Language | undefined) => void;
  }>();

  let inputValue = $state(value ?? '');
  let isValid = $state(true);

  $effect(() => {
    inputValue = value ?? '';
    isValid = inputValue === '' || isValidLanguage(inputValue);
  });

  function handleInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    inputValue = val;
    isValid = val === '' || isValidLanguage(val);
    onUpdate(val === '' ? undefined : val);
  }
</script>

<label class="input">
  <span class="label">Language</span>
  <input
    type="text"
    placeholder="en-US"
    class:input-error={!isValid && inputValue !== ''}
    bind:value={inputValue}
    oninput={handleInput}
  />
</label>
{#if !isValid && inputValue !== ''}
  <div class="label text-error">Invalid language code.</div>
{/if}
