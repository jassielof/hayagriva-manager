<script lang="ts">
  import BibliographyList from '$lib/components/BibliographyList.svelte';
  import CreateBibliographyModal from '$lib/components/CreateBibliographyModal.svelte';
  import ImportBibliographyModal from '$lib/components/ImportBibliographyModal.svelte';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte'; // 1. Import the new component
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

  function handleCreateNew() {
    editingBibliography = null;
    showCreateModal = true;
  }

  function handleImport() {
    showImportModal = true;
  }

  async function handleSave(metadata: Partial<BibliographyMetadata>) {
    if (editingBibliography) {
      const bib = bibliographies.find(
        (b) => b.metadata.id === editingBibliography?.id
      );
      if (bib) {
        bib.metadata = {
          ...bib.metadata,
          ...metadata,
          updatedAt: new Date()
        };
        await db.saveBibliography(bib);
      }
    } else {
      // TODO: UUID is too much, specially since the UUID becomes the URL slug.
      // It should be considered to just use the bibliography title or a slug of it.
      // For example, "UPSA 550" could become "upsa-550". Or use "UPSA 550" itself depending on the user preference.
      // It should support titles in other languages (it's up to the browser if it doesn't support unicode URLs).

      const newBib: Bibliography = {
        metadata: {
          ...metadata,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date()
        } as BibliographyMetadata,
        data: {}
      };
      await db.saveBibliography(newBib);
    }
    showCreateModal = false;
    await loadBibliographies();
  }

  async function handleImportSave(payload: {
    metadata: Partial<BibliographyMetadata>;
    data: Hayagriva;
  }) {
    try {
      // The 'data' from the payload is a Svelte 5 state proxy.
      // IndexedDB cannot store proxies, so we convert it to a plain object.
      const plainData = JSON.parse(JSON.stringify(payload.data));
      const { metadata } = payload;
      const newBib: Bibliography = {
        metadata: {
          title: metadata.title || 'Untitled',
          description: metadata.description || '',
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date()
        } as BibliographyMetadata,
        data: plainData // Use the plain object here
      };

      // Close modal first to prevent re-triggering
      showImportModal = false;

      // Save the bibliography
      await db.saveBibliography(newBib);

      // Reload the list
      await loadBibliographies();
    } catch (error) {
      console.error('Error in handleImportSave:', error);
      // Optionally show an error message to the user
      alert('Failed to save bibliography: ' + (error as Error).message);
    }
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

  function closeCreateModal() {
    showCreateModal = false;
  }

  function closeImportModal() {
    showImportModal = false;
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
    <button type="button" class="btn btn-primary" onclick={handleCreateNew}>
      New Bibliography
    </button>
    <button type="button" class="btn btn-secondary" onclick={handleImport}>
      Import from YAML
    </button>
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

<CreateBibliographyModal
  show={showCreateModal}
  bibliography={editingBibliography}
  onClose={closeCreateModal}
  onSave={handleSave}
/>

<ImportBibliographyModal
  show={showImportModal}
  onClose={closeImportModal}
  onSave={handleImportSave}
/>

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
