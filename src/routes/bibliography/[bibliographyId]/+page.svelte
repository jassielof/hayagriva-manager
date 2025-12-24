<script lang="ts">
  import type { PageProps } from './$types';
  import EntryList from '$lib/components/EntryList.svelte';
  import { BookPlus, Search } from '@lucide/svelte';
  import { formatEntryType } from '$lib/formatters/entry-type-formatter';
  import { ENTRY_TYPES } from '$lib/validators/entry-type';
  import type { BibliographyEntry, FormattableString, Hayagriva } from '$lib/types/hayagriva';

  let { data }: PageProps = $props();

  let bibliography = $state(data.bibliography);

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
      return author.map((a) => (typeof a === 'string' ? a : a.name || '')).join('; ').toLowerCase();
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

  // Filtered and sorted entries
  let filteredEntries = $derived.by(() => {
    if (!bibliography) return {};

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

    // Convert back to Hayagriva format (object)
    const result: Hayagriva = {};
    entries.forEach(([id, entry]) => {
      result[id] = entry;
    });

    return result;
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
        <select name="sort" id="sort" class="select mr-2 w-auto">
          <option disabled selected>Sort by</option>
          <option value="id">ID</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
        <a
          class="btn btn-primary"
          href="/bibliography/{bibliography.metadata.id}/entry/"
        >
          <BookPlus class="size-[1.2em]" />
          New entry
        </a>
      </div>
    </div>
    <EntryList
      bind:entries={bibliography.data}
      bind:bibliographyId={bibliography.metadata.id}
    />
  {:else}
    <div class="flex flex-grow flex-col items-center justify-center">
      <span class="loading loading-spinner loading-xl"></span>
    </div>
  {/if}
</main>
