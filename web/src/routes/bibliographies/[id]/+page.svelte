<script lang="ts">
  import { getBibliography, saveBibliography } from '$lib/db';
  import type { Bibliography } from '$lib/types/bibliography';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';
  import EntryList from '$lib/components/EntryList.svelte';
  import EntryDetail from '$lib/components/EntryDetail.svelte';
  import type { HayagrivaData } from '$lib/types/hayagriva-data';

  let bibliography = $state<Bibliography | null>(null);
  let entries = $state<[string, HayagrivaData[string]][]>([]);
  let selectedId = $state<string | null>(null);

  let { data: pageData }: PageProps = $props();

  onMount(async () => {
    const bib = await getBibliography(pageData.id);
    if (bib) {
      bibliography = bib;
      entries = Object.entries(bib.data);
    }
  });

  function handleSelectEntry(id: string) {
    selectedId = id;
  }

  const selectedEntry = $derived.by(() => {
    if (!selectedId) return null;
    const entryTuple = entries.find(([id]) => id === selectedId);
    return entryTuple ? entryTuple[1] : null;
  });
</script>

<main class="container mx-auto p-4">
  {#if bibliography}
    <div class="mb-4">
      <h1 class="text-3xl font-bold">{bibliography.metadata.title}</h1>
      <p class="opacity-80">{bibliography.metadata.description}</p>
    </div>

    <div class="flex flex-col gap-4 md:flex-row">
      <div class="flex-1">
        <EntryList {entries} {selectedId} onSelect={handleSelectEntry} />
      </div>
      <div class="w-full md:w-96">
        <EntryDetail entry={selectedEntry} />
      </div>
    </div>
  {:else}
    <div class="text-center">
      <span class="loading loading-lg loading-spinner"></span>
      <p>Loading bibliography...</p>
    </div>
  {/if}
</main>
