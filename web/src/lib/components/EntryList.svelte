<script lang="ts">
  import type { Entry } from '$lib/types/entry';

  const { entries, selectedId, onSelect } = $props<{
    entries: [string, Entry][];
    selectedId: string | null;
    onSelect: (id: string) => void;
  }>();

  function formatAuthor(author: Entry['author']): string {
    if (!author) return '';
    if (typeof author === 'string') return author;
    if (Array.isArray(author)) {
      return author.map((a) => (typeof a === 'string' ? a : a.name)).join('; ');
    }
    return author.name || '';
  }

  function getYear(date: Entry['date']): string {
    if (!date) return '';
    if (typeof date === 'string') return date.toString();
    if (typeof date === 'string') return date.substring(0, 4);
    return '';
  }

  function formatEntryType(type: Entry['type']): string {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
</script>

<div class="card bg-base-100 shadow-md">
  <div class="card-body p-0">
    <h2 class="card-title border-base-300 mb-2 border-b p-4">Entries</h2>
    {#if entries.length === 0}
      <p class="p-4 text-center text-gray-500">This bibliography has no entries.</p>
    {:else}
      <div class="overflow-x-auto">
        <table class="table-zebra table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Type</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {#each entries as [id, entry] (id)}
              <tr
                class="cursor-pointer"
                class:active={selectedId === id}
                onclick={() => onSelect(id)}
              >
                <td class="max-w-xs truncate font-mono text-xs">{id}</td>
                <td class="max-w-xs truncate font-semibold">
                  {entry.title || ''}
                </td>
                <td class="max-w-xs truncate">{formatAuthor(entry.author)}</td>
                <td>{formatEntryType(entry.type)}</td>
                <td>{getYear(entry.date)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
