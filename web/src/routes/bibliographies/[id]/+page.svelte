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

<main class="flex h-[calc(100vh-4rem)] flex-col p-4">
  {#if bibliography}
    <div class="mb-2">
      <h1 class="truncate text-2xl font-bold">{bibliography.metadata.title}</h1>
      {#if bibliography.metadata.description}
        <p class="truncate text-sm opacity-70">{bibliography.metadata.description}</p>
      {/if}
    </div>

    <div class="grid flex-grow grid-cols-1 gap-4 overflow-hidden md:grid-cols-3">
      <div class="flex flex-col overflow-y-auto md:col-span-2">
        <h2 class="card-title p-2">Entries</h2>
        <EntryList {entries} {selectedId} onSelect={handleSelectEntry} />
      </div>
      <div class="overflow-y-auto">
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
