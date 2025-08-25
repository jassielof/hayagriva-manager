<script lang="ts">
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import { bibliographyService } from '$lib/services/bibliography.service';
  import type { Bibliography } from '$lib/types/bibliography';

  let newBibliography: Bibliography = $state({
    data: {},
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '',
      title: ''
    }
  });

  let errorMessage = $state('');

  async function handleSubmit() {
    try {
      await bibliographyService.add(newBibliography);
      goto('/');
    } catch (error: any) {
      if (error.name === 'ConstraintError') {
        errorMessage = 'Bibliography with this ID already exists.';
      } else {
        errorMessage = 'Failed to save bibliography. Please try again.';
      }
      console.error('Error saving bibliography:', error);
    }
  }
</script>

<form class="mx-auto max-w-md p-6" onsubmit={handleSubmit}>
  <fieldset
    class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4"
  >
    <legend class="fieldset-legend"> New Bibliography </legend>

    {#if errorMessage}
      <div class="alert alert-error" role="alert">
        <span>{errorMessage}</span>
      </div>
    {/if}

    <BibliographyMetadataForm
      bind:bibliographyMetadata={newBibliography.metadata}
    />

    <button class="btn btn-primary mt-4">Save</button>
    <a class="btn" href="/">Cancel</a>
  </fieldset>
</form>
