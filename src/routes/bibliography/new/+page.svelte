<script lang="ts">
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import { db } from '$lib/db';

  let id = $state('');
  let title = $state('');
  let description = $state('');
  let errorMessage = $state('');

  async function handleSubmit() {
    await db
      .saveBibliography({
        metadata: {
          id: id.trim(),
          title: title.trim(),
          description: description.trim() || '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        data: {}
      })
      .then(() => {
        goto('/');
      })
      .catch((error) => {
        if (error.name == 'ConstraintError') {
          errorMessage = 'Bibliography with this ID already exists.';
          return;
        } else {
          errorMessage = 'Failed to save bibliography. Please try again.';
        }

        console.error('Error saving bibliography:', error);
      });
  }
</script>

<form class="mx-auto w-full max-w-md p-6" onsubmit={handleSubmit}>
  <fieldset
    class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4"
  >
    <legend class="fieldset-legend"> New Bibliography </legend>

    {#if errorMessage}
      <div class="alert alert-error" role="alert">
        <span>{errorMessage}</span>
      </div>
    {/if}
    <!-- FIXME: single bind -->
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
