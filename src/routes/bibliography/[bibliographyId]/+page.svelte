<script lang="ts">
  import type { PageProps } from './$types';
  import EntryList from '$lib/components/EntryList.svelte';
  import { BookPlus, Search } from '@lucide/svelte';
  import { formatEntryType } from '$lib/formatters/entry-type-formatter';
  import type {
    BibliographyEntry,
    FormattableString,
    Hayagriva
  } from '$lib/types/hayagriva';

  let { data }: PageProps = $props();

  const initialBibliography = data.bibliography;
  let bibliography = $state(initialBibliography);

  // Search, sort, and filter state
  let searchQuery = $state('');
  let sortBy = $state<'id' | 'title' | 'author' | 'date' | 'type'>('id');
  let filterByType = $state<string>('all');

  // Helper functions to format entry fields for search/comparison
  function formatTitle(title: FormattableString | undefined | null): string {
    if (!title) return '';
    if (typeof title === 'string') return title.toLowerCase();
    return (title.short || title.value || '').toLowerCase();
  }

  function formatAuthor(author: BibliographyEntry['author']): string {
    if (!author) return '';
    if (typeof author === 'string') return author.toLowerCase();
    if (Array.isArray(author)) {
      return author
        .map((a) => (typeof a === 'string' ? a : a.name || ''))
        .join('; ')
        .toLowerCase();
    }
    return (author.name || '').toLowerCase();
  }

  function formatDate(date: BibliographyEntry['date']): string | number {
    if (!date) return '';
    if (typeof date === 'number') return date;
    if (typeof date === 'string') return date;
    return '';
  }

  // Get unique entry types from current entries
  let availableEntryTypes = $derived.by(() => {
    if (!bibliography) return [];
    const types = new Set<string>();
    Object.values(bibliography.data).forEach((entry) => {
      if (entry.type) {
        types.add(entry.type.toLowerCase());
      }
    });
    return Array.from(types).sort();
  });

  // Filtered and sorted entries - use state to allow bind:entries in EntryList
  // Sync it reactively with filters/sorts applied
  let filteredEntries = $state<Hayagriva>({});

  // Compute which entries should be shown (for filtering/sorting)
  let entryOrder = $derived.by(() => {
    if (!bibliography) return [];

    let entries = Object.entries(bibliography.data);

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      entries = entries.filter(([id, entry]) => {
        const titleMatch = formatTitle(entry.title).includes(query);
        const authorMatch = formatAuthor(entry.author).includes(query);
        const idMatch = id.toLowerCase().includes(query);
        return titleMatch || authorMatch || idMatch;
      });
    }

    // Filter by type
    if (filterByType !== 'all') {
      entries = entries.filter(([, entry]) => {
        const entryType = entry.type?.toLowerCase() || '';
        return entryType === filterByType.toLowerCase();
      });
    }

    // Sort entries
    entries.sort(([idA, entryA], [idB, entryB]) => {
      let comparison = 0;

      switch (sortBy) {
        case 'id':
          comparison = idA.localeCompare(idB);
          break;
        case 'title':
          const titleA = formatTitle(entryA.title);
          const titleB = formatTitle(entryB.title);
          comparison = titleA.localeCompare(titleB);
          break;
        case 'author':
          const authorA = formatAuthor(entryA.author);
          const authorB = formatAuthor(entryB.author);
          comparison = authorA.localeCompare(authorB);
          break;
        case 'date':
          const dateA = formatDate(entryA.date);
          const dateB = formatDate(entryB.date);
          if (typeof dateA === 'number' && typeof dateB === 'number') {
            comparison = dateB - dateA; // Most recent first
          } else if (typeof dateA === 'string' && typeof dateB === 'string') {
            comparison = dateB.localeCompare(dateA); // Most recent first
          } else if (dateA && !dateB) {
            comparison = -1;
          } else if (!dateA && dateB) {
            comparison = 1;
          }
          break;
        case 'type':
          const typeA = entryA.type?.toLowerCase() || '';
          const typeB = entryB.type?.toLowerCase() || '';
          comparison = typeA.localeCompare(typeB);
          break;
      }

      return comparison;
    });

    return entries.map(([id]) => id);
  });

  // Sync filteredEntries based on entryOrder, maintaining references to original entries
  // This creates a filtered and sorted view of bibliography.data
  $effect(() => {
    if (!bibliography) {
      filteredEntries = {};
      return;
    }

    // Build new filtered entries object based on current entryOrder
    const result: Hayagriva = {};
    entryOrder.forEach((id) => {
      if (bibliography.data[id]) {
        // Use reference to original entry so changes propagate
        result[id] = bibliography.data[id];
      }
    });

    // Update filteredEntries - replace entire object to trigger reactivity
    filteredEntries = result;
  });

  // Separate effect to handle deletions from EntryList
  // When EntryList deletes from filteredEntries, also delete from bibliography.data
  $effect(() => {
    if (!bibliography) return;

    // Watch filteredEntries for deletions
    const currentFilteredIds = new Set(Object.keys(filteredEntries));
    const expectedIds = new Set(entryOrder);

    // If an entry should be visible (in entryOrder) but isn't in filteredEntries,
    // it was deleted by EntryList - delete it from bibliography.data
    expectedIds.forEach((id) => {
      if (!currentFilteredIds.has(id) && bibliography.data[id]) {
        // Entry was deleted from filteredEntries, delete from bibliography.data
        delete bibliography.data[id];
      }
    });
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
          href="/bibliography/{bibliography.metadata.id}/entry/"
        >
          <BookPlus class="size-[1.2em]" />
          New entry
        </a>
      </div>
    </div>

    <!-- Search, Sort, and Filter Controls -->
    <div class="mt-4 flex flex-col gap-3 md:flex-row">
      <!-- Search Input -->
      <label class="input flex-1">
        <span>
          <Search class="size-5" />
        </span>
        <input
          type="search"
          placeholder="Search by ID, title, or author..."
          class="grow"
          bind:value={searchQuery}
        />
      </label>

      <!-- Filter by Type -->
      <select
        name="filter"
        id="filter"
        class="select select-bordered w-full md:w-48"
        bind:value={filterByType}
      >
        <option value="all">All types</option>
        {#each availableEntryTypes as entryType}
          {@const { label } = formatEntryType(entryType)}
          <option value={entryType}>{label}</option>
        {/each}
      </select>

      <!-- Sort by -->
      <select
        name="sort"
        id="sort"
        class="select select-bordered w-full md:w-40"
        bind:value={sortBy}
      >
        <option value="id">Sort: ID</option>
        <option value="title">Sort: Title</option>
        <option value="author">Sort: Author</option>
        <option value="date">Sort: Date</option>
        <option value="type">Sort: Type</option>
      </select>
    </div>

    <EntryList
      bind:entries={filteredEntries}
      bind:bibliographyId={bibliography.metadata.id}
    />
  {:else}
    <div class="flex flex-grow flex-col items-center justify-center">
      <span class="loading loading-spinner loading-xl"></span>
    </div>
  {/if}
</main>
