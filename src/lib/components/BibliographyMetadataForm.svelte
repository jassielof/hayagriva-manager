<script lang="ts">
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';

  let {
    bibliographyMetadata = $bindable()
  }: {
    bibliographyMetadata: BibliographyMetadata;
  } = $props();
</script>

<div class="form-control w-full">
  <label for="bibliography-id" class="label">
    <span class="label-text font-semibold"
      >ID<span class="text-error ml-1">*</span></span
    >
  </label>
  <input
    id="bibliography-id"
    type="text"
    title="Enter a unique ID for the bibliography"
    placeholder="my-research-papers"
    class="input input-bordered w-full font-mono"
    bind:value={bibliographyMetadata.id}
    onblur={() => {
      bibliographyMetadata.id = bibliographyMetadata.id.trim();
      if (
        bibliographyMetadata.id === 'new' ||
        bibliographyMetadata.id === 'import'
      ) {
        alert(
          `"${bibliographyMetadata.id}" is a reserved ID. Please choose another one.`
        );
        return;
      }
    }}
    required
    aria-required="true"
  />
  <label for="bibliography-id" class="label">
    <span class="label-text-alt text-base-content/60"
      >A unique identifier for this bibliography (lowercase, dashes allowed)</span
    >
  </label>
</div>

<div class="form-control w-full">
  <label for="bibliography-title" class="label">
    <span class="label-text font-semibold"
      >Title<span class="text-error ml-1">*</span></span
    >
  </label>
  <input
    id="bibliography-title"
    type="text"
    placeholder="My Research Papers"
    title="Enter a title for the bibliography"
    class="input input-bordered w-full"
    bind:value={bibliographyMetadata.title}
    onblur={() =>
      (bibliographyMetadata.title = bibliographyMetadata.title.trim())}
    required
    aria-required="true"
  />
  <label for="bibliography-title" class="label">
    <span class="label-text-alt text-base-content/60"
      >A human-readable name for your bibliography</span
    >
  </label>
</div>

<div class="form-control w-full">
  <label for="bibliography-description" class="label">
    <span class="label-text font-semibold">Description</span>
    <span class="label-text-alt text-base-content/60">Optional</span>
  </label>
  <textarea
    id="bibliography-description"
    class="textarea textarea-bordered w-full"
    placeholder="Research papers on various topics"
    rows="3"
    bind:value={bibliographyMetadata.description}
    onblur={() =>
      (bibliographyMetadata.description =
        bibliographyMetadata.description?.trim())}
  ></textarea>
  <label for="bibliography-description" class="label">
    <span class="label-text-alt text-base-content/60"
      >Add notes or details about this bibliography collection</span
    >
  </label>
</div>
