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

<label class="label" for="entry-language"> Language </label>
<input
  type="text"
  id="entry-language"
  placeholder="en-US"
  class="input"
  class:input-error={!isValid && inputValue !== ''}
  bind:value={inputValue}
  oninput={handleInput}
/>
{#if !isValid && inputValue !== ''}
  <div class="label text-error">Invalid language code.</div>
{/if}
