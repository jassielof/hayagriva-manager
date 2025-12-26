<script lang="ts">
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import { BibliographyService } from '$lib/services/bibliography.service';
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
      await BibliographyService.add(newBibliography);
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

<div class="grid min-h-full place-items-center py-50 px-4">
  <form class="w-full max-w-md" onsubmit={handleSubmit}>
    <fieldset
      class="fieldset w-full rounded-box border border-base-300 bg-base-200 p-4"
    >
      <legend class=" fieldset-legend text-2xl"> New Bibliography </legend>

      <BibliographyMetadataForm
        bind:bibliographyMetadata={newBibliography.metadata}
      />

      <button class="btn mt-4 btn-primary">Save</button>
      <a class="btn btn-error" href="/">Cancel</a>
    </fieldset>
  </form>
</div>
