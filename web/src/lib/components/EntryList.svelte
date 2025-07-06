<script lang="ts">
  import type { Entry } from '$lib/types/entry';
  import type { FormattableString } from '$lib/types/hayagriva-definitions';

  const { entries, selectedId, onSelect } = $props<{
    entries: [string, Entry][];
    selectedId: string | null;
    onSelect: (id: string) => void;
  }>();

  function formatTitle(title: FormattableString | undefined | null): string {
    if (!title) return '';
    if (typeof title === 'string') {
      return title;
    }
    return title.short || title.value || '';
  }

  function formatAuthor(author: Entry['author']): string {
    if (!author) return '';
    if (typeof author === 'string') return author;
    if (Array.isArray(author)) {
      return author.map((a) => (typeof a === 'string' ? a : a.name)).join('; ');
    }
    return author.name || '';
  }

  function formatEntryType(type: Entry['type']): string {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  function formatEntryDate(date: Entry['date']): string {
    if (!date) {
      return '';
    }

    if (typeof date === 'number') {
      return date.toString();
    }

    if (typeof date === 'string') {
      // The date string can be YYYY, YYYY-MM, YYYY-MM-DD, or a full ISO string.
      // We only want the date part (YYYY-MM-DD).
      return date.split('T')[0];
    }

    return '';
  }
</script>

<div class="card bg-base-100 flex-grow shadow-md">
  {#if entries.length === 0}
    <div class="card-body">
      <p class="text-center text-gray-500">This bibliography has no entries.</p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table-zebra table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Type</th>
            <th>Date</th>
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
                {formatTitle(entry.title)}
              </td>
              <td class="max-w-xs truncate">{formatAuthor(entry.author)}</td>
              <td>{formatEntryType(entry.type)}</td>
              <td>{formatEntryDate(entry.date)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
