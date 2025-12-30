<script lang="ts">
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import type { PageProps } from './$types';
  import { BibliographyService } from '$lib/services/bibliography.service';
  import { CircleAlert } from '@lucide/svelte';
  import type { Bibliography } from '$lib/types/bibliography';

  let { data, params }: PageProps = $props();

  // svelte-ignore state_referenced_locally
  const bibliography = $state(data.oldBibliography);

  let errorMessage = $state(undefined as string | undefined);

  async function handleSubmit() {
    try {
      await BibliographyService.updateMetadata(
        params.bibliographyId,
        bibliography
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
      bind:bibliographyMetadata={bibliography.metadata}
    />

    <div class="divider"></div>

    <button class="btn btn-primary">Save</button>
    <a class="btn btn-error" href="/">Cancel</a>
  </fieldset>
</form>
