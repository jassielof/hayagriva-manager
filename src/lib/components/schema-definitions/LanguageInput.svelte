<script lang="ts">
  import { LANGUAGE_REGEX } from '$lib/formatters/language';
  import { type Language } from '$lib/types/hayagriva';

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
  class="validator input w-full"
  title="Language must match the Unicode Language Identifier format."
  pattern={LANGUAGE_REGEX.source}
  bind:value
/>
