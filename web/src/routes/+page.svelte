<script lang="ts">
  import BibliographyList from '$lib/components/BibliographyList.svelte';
  import CreateBibliographyModal from '$lib/components/CreateBibliographyModal.svelte';
  import { deleteBibliography, getAllBibliographies, saveBibliography } from '$lib/db';
  import type { Bibliography } from '$lib/types/bibliography';
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';
  import type { HayagrivaData } from '$lib/types/hayagriva-data';
  import { onMount } from 'svelte';

  import { v4 as uuidv4 } from 'uuid';

  let bibliographies: Bibliography[] = [];
  let showCreateModal = false;
  let showImportModal = false;
  let editingBibliography: BibliographyMetadata | null = null;

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

  async function handleSave(event: CustomEvent<BibliographyMetadata>) {
    const metadata = event.detail;
    if (editingBibliography) {
      const bib = bibliographies.find((b) => b.metadata.id === metadata.id);

      if (bib) {
        bib.metadata = { ...metadata, updatedAt: new Date() };
        await saveBibliography(bib);
      }
    } else {
      const newBib: Bibliography = {
        metadata: {
          ...metadata,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        data: {}
      };
      await saveBibliography(newBib);
      showCreateModal = false;
    }
  }

  async function handleImportSave(
    event: CustomEvent<{ metadata: BibliographyMetadata; data: HayagrivaData }>
  ) {
    const { metadata, data } = event.detail;
    const newBib: Bibliography = {
      metadata: {
        ...metadata,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      data: data
    };
    await saveBibliography(newBib);
    await loadBibliographies();
    showImportModal = false;
  }

  async function handleDelete(event: CustomEvent<string>) {
    if (confirm('Are you sure you want to delete this bibliography? This cannot be undone.')) {
      await deleteBibliography(event.detail);
      await loadBibliographies();
    }
  }

  function handleEdit(event: CustomEvent<string>) {
    const bib = bibliographies.find((b) => b.metadata.id === event.detail);
    if (bib) {
      editingBibliography = bib.metadata;
      showCreateModal = true;
    }
  }
</script>

<div class="navbar bg-base-100 px-4 shadow-sm">
  <a class="btn btn-ghost text-xl" href="/">Hayagriva Manager</a>
  <div class="flex-1 justify-end">
    <button class="btn btn-primary mr-2" on:click={handleCreateNew}>New Bibliography</button>
    <button class="btn btn-secondary" on:click={handleImport}>Import from YAML</button>
  </div>
</div>

<main class="container mx-auto mt-8 p-4">
  {#if bibliographies.length === 0}
    <div class="text-center">
      <h2 class="text-2xl font-bold">No Bibliographies Found</h2>
      <p class="mt-2">Create a new bibliography or import a YAML file to get started.</p>
    </div>
  {:else}
    <BibliographyList {bibliographies} on:edit={handleEdit} on:delete={handleDelete} />
  {/if}
</main>

{#if showCreateModal}
  <CreateBibliographyModal
    bibliography={editingBibliography}
    on:close={() => (showCreateModal = false)}
    on:save={handleSave}
  />
{/if}

{#if showImportModal}
  <ImportBibliographyModal on:close={() => (showImportModal = false)} on:save={handleImportSave} />
{/if}
