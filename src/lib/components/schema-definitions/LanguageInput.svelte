<script lang="ts">
  import type { Language } from '$lib/types/hayagriva';
  import { isValidLanguage, languagePattern } from '$lib/validators/language';

  let {
    value = $bindable()
  }: {
    value: Language | undefined;
  } = $props();
</script>

<label class="label" for="entry-language"> Language </label>
<input
  type="text"
  id="entry-language"
  placeholder="en-US"
  class="input validator w-full"
  title="Language must match the Unicode Language Identifier format."
  pattern={languagePattern}
  bind:value
/>
