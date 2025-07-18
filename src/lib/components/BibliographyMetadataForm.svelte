<script lang="ts">
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';

  let {
    title = $bindable(''),
    description = $bindable(''),
    bibliography = null,
    showValidation = false
  }: {
    title: string;
    description: string;
    bibliography?: BibliographyMetadata | null;
    showValidation?: boolean;
  } = $props();

  let titleError = $state('');
  let hasInteracted = $state(false);

  // Auto-populate form when bibliography is provided
  $effect(() => {
    if (bibliography) {
      title = bibliography.title;
      description = bibliography.description || '';
    }
  });

  // Validation effect
  $effect(() => {
    if (showValidation || hasInteracted) {
      titleError = !title.trim() ? 'Title is required' : '';
    }
  });

  function handleTitleInput() {
    hasInteracted = true;
  }

  // Expose validation state to parent
  export function isValid(): boolean {
    return title.trim().length > 0;
  }

  // Expose form data to parent
  export function getFormData(): Partial<BibliographyMetadata> {
    return {
      title: title.trim(),
      description: description.trim()
    };
  }

  export function validate(): boolean {
    hasInteracted = true;
    return isValid();
  }
</script>

<label for="bibliography-title" class="label">Title</label>
<input
  id="bibliography-title"
  type="text"
  placeholder="My Research Papers"
  class="input validator w-full"
  class:input-error={titleError}
  bind:value={title}
  oninput={handleTitleInput}
  required
/>
<p class="validaotor-hint">{titleError}</p>

<label for="bibliography-description" class="label"> Description </label>
<textarea
  id="bibliography-description"
  class="textarea w-full"
  placeholder="A short description of this collection"
  bind:value={description}
></textarea>
