<script lang="ts">
  import BibliographyList from '$lib/components/BibliographyList.svelte';
  import CreateBibliographyModal from '$lib/components/CreateBibliographyModal.svelte';
  import ImportBibliographyModal from '$lib/components/ImportBibliographyModal.svelte';
  import { deleteBibliography, getAllBibliographies, saveBibliography } from '$lib/db';
  import type { Bibliography } from '$lib/types/bibliography';
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';
  import type { HayagrivaData } from '$lib/types/hayagriva-data';
  import { onMount } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';

  let bibliographies = $state<Bibliography[]>([]);
  let showCreateModal = $state(false);
  let showImportModal = $state(false);
  let editingBibliography = $state<BibliographyMetadata | null>(null);

  onMount(async () => {
    await loadBibliographies();
  });

  async function loadBibliographies() {
    bibliographies = await getAllBibliographies();
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
      const bib = bibliographies.find((b) => b.metadata.id === editingBibliography?.id);
      if (bib) {
        bib.metadata = {
          ...bib.metadata,
          ...metadata,
          updatedAt: new Date()
        };
        await saveBibliography(bib);
      }
    } else {
      const newBib: Bibliography = {
        metadata: {
          ...metadata,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date()
        } as BibliographyMetadata,
        data: {}
      };
      await saveBibliography(newBib);
    }
    showCreateModal = false;
    await loadBibliographies();
  }

  async function handleImportSave(payload: {
    metadata: Partial<BibliographyMetadata>;
    data: HayagrivaData;
  }) {
    console.log('handleImportSave called with payload:', payload);

    try {
      // The 'data' from the payload is a Svelte 5 state proxy.
      // IndexedDB cannot store proxies, so we convert it to a plain object.
      const plainData = JSON.parse(JSON.stringify(payload.data));
      const { metadata } = payload;
      console.log('Extracted metadata:', metadata);
      console.log('Extracted plain data:', plainData);

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

      console.log('Created new bibliography object:', newBib);

      // Close modal first to prevent re-triggering
      showImportModal = false;

      // Save the bibliography
      console.log('Saving bibliography...');
      await saveBibliography(newBib);
      console.log('Bibliography saved successfully');

      // Reload the list
      console.log('Reloading bibliographies...');
      await loadBibliographies();
      console.log('Bibliographies reloaded, current count:', bibliographies.length);
    } catch (error) {
      console.error('Error in handleImportSave:', error);
      // Optionally show an error message to the user
      alert('Failed to save bibliography: ' + (error as Error).message);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this bibliography? This cannot be undone.')) {
      await deleteBibliography(id);
      await loadBibliographies();
    }
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
</script>

<div class="navbar bg-base-100 px-4 shadow-sm">
  <a class="btn btn-ghost text-xl" href="/">Hayagriva Manager</a>
  <div class="flex-1 justify-end">
    <button class="btn btn-primary mr-2" onclick={handleCreateNew}>New Bibliography</button>
    <button class="btn btn-secondary" onclick={handleImport}>Import from YAML</button>
  </div>
</div>

<main class="container mx-auto mt-8 p-4">
  {#if bibliographies.length === 0}
    <div class="text-center">
      <h2 class="text-2xl font-bold">No Bibliographies Found</h2>
      <p class="mt-2">Create a new bibliography or import a YAML file to get started.</p>
    </div>
  {:else}
    <BibliographyList {bibliographies} edit={handleEdit} del={handleDelete} />
  {/if}
</main>

<CreateBibliographyModal
  show={showCreateModal}
  bibliography={editingBibliography}
  onClose={closeCreateModal}
  onSave={handleSave}
/>

{#if showImportModal}
  <ImportBibliographyModal onClose={closeImportModal} onSave={handleImportSave} />
{/if}
