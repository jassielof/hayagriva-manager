<script lang="ts">
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import type { PageProps } from './$types';
  import { BibliographyService } from '$lib/services/bibliography.service';
  import { CircleAlert } from '@lucide/svelte';

  let { data, params }: PageProps = $props();

  let oldBibliography = $derived(data.oldBibliography);

  let errorMessage = $state(undefined as string | undefined);

  async function handleSubmit() {
    try {
      await BibliographyService.updateMetadata(
        params.bibliographyId,
        oldBibliography
      );

      goto('/');
    } catch (err: any) {
      errorMessage =
        err.body?.message || 'Failed to update bibliography. Please try again.';
      console.error('Error updating bibliography:', err);
    }
  }
</script>

<form class="mx-auto max-w-md p-6" onsubmit={handleSubmit}>
  <fieldset class="fieldset rounded-box border border-base-300 bg-base-200 p-4">
    <legend class="fieldset-legend"> Edit Bibliography </legend>

    {#if errorMessage}
      <div role="alert" class="alert alert-error">
        <CircleAlert />
        <span>{errorMessage}</span>
      </div>
      <div class="divider"></div>
    {/if}

    <BibliographyMetadataForm
      bind:bibliographyMetadata={oldBibliography.metadata}
    />

    <div class="divider"></div>

    <button class="btn btn-primary">Save</button>
    <a class="btn btn-error" href="/">Cancel</a>
  </fieldset>
</form>
