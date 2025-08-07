<script lang="ts">
  import BibliographyList from '$lib/components/BibliographyList.svelte';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import type { Bibliography } from '$lib/types/bibliography';
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';
  import { onMount } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  import AlertModal from '$lib/components/AlertModal.svelte';
  import type { Hayagriva } from '$lib/types/hayagriva';
  import { db } from '$lib/db';

  // FIXME: states type safety is let foo: type = $state(initialValue)
  let bibliographies = $state<Bibliography[]>([]);
  let showCreateModal = $state(false);
  let showImportModal = $state(false);
  let editingBibliography = $state<BibliographyMetadata | null>(null);
  let showConfirmModal = $state(false);
  let confirmAction = $state(() => {});
  let showAlertModal = $state(false);
  let alertTitle = $state('');
  let alertMessage = $state('');

  onMount(async () => {
    try {
      await loadBibliographies();
    } catch (error) {
      console.error('Error loading bibliographies:', error);
      alertTitle = 'Error';
      alertMessage = 'Failed to load bibliographies. Please try again later.';
      showAlertModal = true;
    }
  });

  async function loadBibliographies() {
    bibliographies = await db.getAllBibliographies();
  }

  async function handleDelete(id: string) {
    // 4. Replace confirm() with logic to show the modal
    confirmAction = async () => {
      await db.deleteBibliography(id);
      await loadBibliographies();
    };
    showConfirmModal = true;
  }

  function handleEdit(id: string) {
    const bib = bibliographies.find((b) => b.metadata.id === id);
    if (bib) {
      editingBibliography = bib.metadata;
      showCreateModal = true;
    }
  }

  function closeConfirmModal() {
    showConfirmModal = false;
  }

  function closeAlertModal() {
    showAlertModal = false;
  }
</script>

{#snippet actions()}
  <div class="gap-4">
    <a href="/bibliography/new" class="btn btn-primary"> New Bibliography </a>
    <a href="/bibliography/import" class="btn btn-secondary">
      Import from YAML
    </a>
  </div>
{/snippet}

<main class="container mx-auto mt-8 max-w-5xl p-4">
  {#if bibliographies.length === 0}
    <div class="text-center">
      <h2 class="text-2xl font-bold">No Bibliographies Found</h2>
      <p class="mt-2 mb-4">
        Create a new bibliography or import a YAML file to get started.
      </p>
      <div class="flex flex-wrap justify-center gap-2">
        {@render actions()}
      </div>
    </div>
  {:else}
    <div class="mb-4 flex justify-end">
      {@render actions()}
    </div>
    <BibliographyList {bibliographies} edit={handleEdit} del={handleDelete} />
  {/if}
</main>

<ConfirmModal
  show={showConfirmModal}
  title="Confirm Deletion"
  message="Are you sure you want to delete this bibliography? This cannot be undone."
  onConfirm={confirmAction}
  onCancel={closeConfirmModal}
/>

<AlertModal
  show={showAlertModal}
  title={alertTitle}
  message={alertMessage}
  onClose={closeAlertModal}
/>
