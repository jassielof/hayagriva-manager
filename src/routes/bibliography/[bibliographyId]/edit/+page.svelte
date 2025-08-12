<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import { db } from '$lib/db';
  import type { PageProps } from './$types';

  let { params }: PageProps = $props();

  let id = $state('');
  let title = $state('');
  let description = $state('');
  let errorMessage = $state('');
  let originalCreationDate: Date;

  // Load bibliography metadata by ID from route param
  onMount(async () => {
    const bibId = params.bibliographyId;

    try {
      const bib = await db.getBibliography(bibId!);
      if (!bib) {
        errorMessage = 'Bibliography not found.';
        return;
      }
      id = bib.metadata.id;
      title = bib.metadata.title;
      description = bib.metadata.description!;
      originalCreationDate = new Date(bib.metadata.createdAt);
    } catch (error) {
      errorMessage = 'Failed to load bibliography.';
      console.error(error);
    }
  });

  async function handleSubmit() {
    try {
      const originalId = params.bibliographyId!;
      const trimmedId = id.trim();
      const existingBib = await db.getBibliography(originalId);

      if (trimmedId !== originalId) {
        const existingByNewId = await db.getBibliography(trimmedId);
        if (existingByNewId) {
          errorMessage = 'A bibliography with this ID already exists.';
          return;
        }
      }

      if (trimmedId !== originalId) {
        await db.deleteBibliography(originalId);
      }

      await db.updateBibliography({
        metadata: {
          id: id.trim(),
          title: title.trim(),
          description: description.trim() || '',
          createdAt: existingBib!.metadata.createdAt,
          updatedAt: new Date()
        },
        data: existingBib!.data
      });

      goto('/');
    } catch (error) {
      errorMessage = 'Failed to update bibliography. Please try again.';
      console.error('Error updating bibliography:', error);
    }
  }
</script>

<form class="mx-auto w-full max-w-md p-6" onsubmit={handleSubmit}>
  <fieldset
    class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4"
  >
    <legend class="fieldset-legend"> Edit Bibliography </legend>

    {#if errorMessage}
      <div class="alert alert-error" role="alert">
        <span>{errorMessage}</span>
      </div>
    {/if}

    <BibliographyMetadataForm bind:id bind:title bind:description />

    <button class="btn btn-primary mt-4">Save</button>
    <button
      class="btn"
      type="button"
      onclick={() => {
        goto('/');
      }}>Cancel</button
    >
  </fieldset>
</form>
