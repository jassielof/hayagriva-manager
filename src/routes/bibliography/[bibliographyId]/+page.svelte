<script lang="ts">
  import type { Bibliography } from '$lib/types/bibliography';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';
  import EntryList from '$lib/components/EntryList.svelte';
  import type { Hayagriva, BibliographyEntry } from '$lib/types/hayagriva';
  import { db } from '$lib/db';
  import { BookPlus } from '@lucide/svelte';

  let bibliography: Bibliography | null = $state(null);
  let entries: [string, BibliographyEntry][] = $state([]);

  let { params }: PageProps = $props();

  onMount(async () => {
    const bib = await db.getBibliography(params.bibliographyId);

    if (bib) {
      bibliography = bib;
      entries = Object.entries(bib.data as Hayagriva);
    }
  });

  // TODO: Implement search by, sort by, and filter by

  $effect(() => {
    if (bibliography) {
      const updatedBib = {
        ...bibliography,
        data: Object.fromEntries(entries),
        metadata: { ...bibliography.metadata, updatedAt: new Date() }
      };
      // Convert the reactive proxy object into a plain JS object before saving.
      const plainBib = JSON.parse(JSON.stringify(updatedBib));
      db.saveBibliography(plainBib);
    }
  });
</script>

<main class="mx-auto flex w-full max-w-5xl flex-col p-4">
  {#if bibliography}
    <div class="flex flex-col gap-2 md:flex-row">
      <div class="mb-2 flex-auto">
        <h1 class="truncate text-2xl font-bold">
          {bibliography.metadata.title}
        </h1>
        {#if bibliography.metadata.description}
          <p class="truncate text-sm opacity-70">
            {bibliography.metadata.description}
          </p>
        {/if}
      </div>
      <div class="flex flex-auto items-end justify-end md:items-start">
        <a
          class="btn btn-primary"
          href={`/bibliography/${bibliography.metadata.id}/entry/`}
        >
          <BookPlus />
          New entry
        </a>
      </div>
    </div>
    <EntryList {entries} bibliographyId={bibliography.metadata.id} />
  {:else}
    <div class="flex flex-grow flex-col items-center justify-center">
      <span class="loading loading-spinner loading-xl"></span>
    </div>
  {/if}
</main>
