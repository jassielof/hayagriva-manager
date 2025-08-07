<script lang="ts">
  import BibliographyList from '$lib/components/BibliographyList.svelte';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import type { Bibliography } from '$lib/types/bibliography';
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';
  import { onMount } from 'svelte';
  import AlertModal from '$lib/components/AlertModal.svelte';
  import { db } from '$lib/db';
  import { goto } from '$app/navigation';
  import {
    BookOpen,
    Copy,
    Download,
    Library,
    Pencil,
    Trash
  } from '@lucide/svelte';

  let bibliographies: Bibliography[] = $state([]);
  let showConfirmModal = $state(false);
  let confirmAction = $state(() => {});
  let showAlertModal = $state(false);
  let alertTitle = $state('');
  let alertMessage = $state('');

  onMount(async () => {
    try {
      bibliographies = await db.bibliographies.toArray();
    } catch (error) {
      console.error('Error loading bibliographies:', error);
      alertTitle = 'Error';
      alertMessage = 'Failed to load bibliographies. Please try again later.';
      showAlertModal = true;
    }
  });

  async function handleDelete(id: string) {
    confirmAction = async () => {
      await db.deleteBibliography(id);
      bibliographies = await db.bibliographies.toArray();
    };
    showConfirmModal = true;
  }

  function handleEdit(id: string) {
    goto(`/bibliography/${id}/edit`);
  }

  function closeConfirmModal() {
    showConfirmModal = false;
  }

  function closeAlertModal() {
    showAlertModal = false;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
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

    <!-- <BibliographyList {bibliographies} edit={handleEdit} del={handleDelete} /> -->
    <div class="overflow-x-auto">
      <ul class="list">
        {#each bibliographies as bib (bib.metadata.id)}
          <li class="list-row">
            <div class="flex h-full items-center justify-center">
              <Library />
            </div>
            <div class="list-col-grow flex flex-col items-start justify-center">
              <h6 class="font-bold">{bib.metadata.title}</h6>
              <time class="text-xs opacity-60">
                Created: {formatDate(bib.metadata.createdAt)}
              </time>
              <time class="text-xs opacity-60">
                Updated: {formatDate(bib.metadata.updatedAt)}
              </time>
              <p class="mt-1 text-sm opacity-80">
                {bib.metadata.description || 'No description provided.'}
              </p>
            </div>

            <div
              class="join lg:join-horizontal join-vertical flex items-center justify-end"
            >
              <a
                href={`/bibliography/${bib.metadata.id}`}
                class="btn btn-soft join-item"
                title="Open"
                aria-label="Open Bibliography"
              >
                <BookOpen />
              </a>
              <button
                class="btn btn-soft join-item"
                onclick={() => goto(`/bibliography/${bib.metadata.id}/edit`)}
                title="Edit metadata"
                aria-label="Edit metadata"
              >
                <Pencil />
              </button>

              <!-- TODO: Implement download functionality -->
              <button
                class="btn btn-soft join-item"
                title="Download as YAML file"
              >
                <Download />
              </button>

              <!-- TODO: Implement copy to clipboard functionality -->
              <button
                class="btn btn-soft join-item"
                title="Copy to clipboard as YAML"
              >
                <Copy />
              </button>

              <button
                class="btn btn-soft btn-error join-item"
                onclick={() => handleDelete(bib.metadata.id)}
                title="Delete Bibliography"
                aria-label="Delete Bibliography"
              >
                <Trash />
              </button>
            </div>
          </li>
        {/each}
      </ul>
    </div>
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
