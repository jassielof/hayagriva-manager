<script lang="ts">
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import type { PageProps } from './$types';
  import { bibliographyService } from '$lib/services/bibliography.service';

  let { data, params }: PageProps = $props();

  const initialOldBibliography = data.oldBibliography;
  let oldBibliography = $state(initialOldBibliography);

  let errorMessage = $state('');

  async function handleSubmit() {
    try {
      if (oldBibliography.metadata.id !== params.bibliographyId) {
        if (await bibliographyService.get(oldBibliography.metadata.id)) {
          errorMessage = 'A bibliography with this ID already exists.';
          return;
        }

        await bibliographyService.put(oldBibliography);
        await bibliographyService.delete(params.bibliographyId);
      } else await bibliographyService.put(oldBibliography);

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
      bind:bibliographyMetadata={oldBibliography.metadata}
    />

    <button class="btn btn-primary mt-4">Save</button>
    <a class="btn" href="/">Cancel</a>
  </fieldset>
</form>
