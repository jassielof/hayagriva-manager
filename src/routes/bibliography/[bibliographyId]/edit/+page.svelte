<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import { db } from '$lib/db';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();


  let id = $state(data.oldBibliography?.metadata.id);
  let title = $state(data.oldBibliography?.metadata.title);
  let description = $state(data.oldBibliography?.metadata.description);
  let errorMessage = $state('');
  let originalCreationDate = data.oldBibliography.metadata.createdAt;

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
          description: description,
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

<form class="mx-auto max-w-md p-6" onsubmit={handleSubmit}>
  <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
    <legend class="fieldset-legend"> Edit Bibliography </legend>

    {#if errorMessage}
      <div class="alert alert-error" role="alert">
        <span>{errorMessage}</span>
      </div>
    {/if}

    <BibliographyMetadataForm
      bind:bibliographyMetadata={data.oldBibliography.metadata}
    />

    <button class="btn btn-primary mt-4">Save</button>
    <a class="btn" href="/">Cancel</a>
  </fieldset>
</form>
