<script lang="ts">
  import yaml from 'js-yaml';
  import ConfirmModal from '$lib/components/ConfirmModal.svelte';
  import type { Bibliography } from '$lib/types/bibliography';
  import { onMount } from 'svelte';
  import AlertModal from '$lib/components/AlertModal.svelte';
  import { db } from '$lib/db';
  import {
    BookOpen,
    BookPlus,
    Copy,
    Download,
    Import,
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
      await db.bibliographies.delete(id);
      bibliographies = await db.bibliographies.toArray();
    };
    showConfirmModal = true;
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
    <a
      href="/bibliography/new"
      class="btn btn-primary"
      title="Create a new bibliography"
      aria-label="Create a new bibliography"
    >
      <BookPlus class="inline-block" />
      New
    </a>
    <a
      href="/bibliography/import"
      class="btn btn-secondary"
      title="Import from a YAML file"
      aria-label="Import from a YAML file"
    >
      <Import class="inline-block" />
      Import
    </a>
  </div>
{/snippet}

<main class="container mx-auto mt-8 max-w-5xl p-4">
  {#if bibliographies.length === 0}
    <section class="grid min-h-[60vh] place-content-center text-center">
      <h2 class="text-2xl font-bold">No bibliographies found</h2>
      <p class="mt-2 mb-4">Create a new one or import it from a YAML file.</p>
      <div class="flex flex-wrap justify-center gap-2">
        {@render actions()}
      </div>
    </section>
  {:else}
    <div class="mb-4 flex justify-end">
      {@render actions()}
    </div>

    <div class="overflow-x-auto">
      <ul class="list rounded-box bg-base-200 shadow-md">
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
              <a
                class="btn btn-soft join-item"
                href={`/bibliography/${bib.metadata.id}/edit`}
                title="Edit metadata"
                aria-label="Edit metadata"
              >
                <Pencil />
              </a>

              <a
                class="btn btn-soft join-item"
                title="Download as YAML file"
                aria-label="Download as YAML file"
                href={URL.createObjectURL(
                  new Blob([yaml.dump(bib.data)], {
                    type: 'application/x-yaml'
                  })
                )}
                download={`${bib.metadata.id}.yaml`}
                onclick={(event) => {
                  setTimeout(() => {
                    URL.revokeObjectURL(event?.currentTarget.href);
                  }, 1000);
                }}
              >
                <Download />
              </a>

              <button
                class="btn btn-soft join-item"
                title="Copy to clipboard as YAML"
                aria-label="Copy to clipboard as YAML"
                onclick={() =>
                  navigator.clipboard.writeText(yaml.dump(bib.data))}
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
  onCancel={() => (showConfirmModal = false)}
/>

<AlertModal
  show={showAlertModal}
  title={alertTitle}
  message={alertMessage}
  onClose={() => (showAlertModal = false)}
/>
