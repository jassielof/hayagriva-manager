<script lang="ts">
  import type { FormattableString } from '$lib/types/formattable-string';
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import {
    BookOpen,
    BookType,
    Calendar,
    Ellipsis,
    Hash,
    Type,
    User
  } from '@lucide/svelte';

  let {
    entries,
    selectedId,
    onSelect
  }: {
    entries: [string, BibliographyEntry][];
    selectedId: string | null;
    onSelect: (id: string) => void;
  } = $props();

  let bibliographyId = $state('');
  let entryId = $state('');

  function formatTitle(title: FormattableString | undefined | null): string {
    if (!title) return '';
    if (typeof title === 'string') {
      return title;
    }
    return title.shortForm || title.value || '';
  }

  function formatAuthor(author: BibliographyEntry['author']): string {
    if (!author) return '';
    if (typeof author === 'string') return author;
    if (Array.isArray(author)) {
      return author.map((a) => (typeof a === 'string' ? a : a.name)).join('; ');
    }
    return author.name || '';
  }

  function formatEntryType(type: BibliographyEntry['type']): string {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  function formatEntryDate(date: BibliographyEntry['date']): string {
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
      <table class="table-zebra table">
        <thead>
          <tr>
            <th>
              <Hash class="mr-1 inline-block" /> ID
            </th>
            <th>
              <BookOpen class="mr-1 inline-block" />
              Title
            </th>

            <th>
              <User class="mr-1 inline-block" />
              Author/s
            </th>
            <th>
              <BookType class="mr-1 inline-block" />
              Type
            </th>
            <th>
              <Calendar class="mr-1 inline-block" />
              Date
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each entries as [id, entry] (id)}
            <tr
              class="cursor-pointer hover:bg-gray-100"
              class:active={selectedId === id}
              onclick={() => onSelect(id)}
            >
              <td class="max-w-xs truncate font-mono">{id}</td>
              <td class="max-w-xs truncate font-semibold">
                {formatTitle(entry.title)}
              </td>
              <td class="max-w-xs truncate">{formatAuthor(entry.author)}</td>
              <td class="max-w-xs">{formatEntryType(entry.type)}</td>
              <td class="">{formatEntryDate(entry.date)}</td>
              <td>
                <!-- TODO: For each entry add copy, delete, update actions -->
                <details class="dropdown dropdown-left">
                  <summary class="btn m-1">
                    <Ellipsis class="inline-block" />
                  </summary>
                  <ul
                    class="menu dropdown-content bg-base-100 rounded-box z-1 w-min p-2 shadow-sm"
                  >
                    <!-- TODO: View is a card dialog -->
                    <!-- TODO: The card should have an option to copy the content of that single entry -->
                    <li><button onclick={() => {}}>View</button></li>
                    <!-- TODO: Edit goes to /bibliography/[id]/entry/[entryId]/edit -->
                    <li>
                      <a
                        href={`/bibliography/${bibliographyId}/entry/${entryId}/edit`}
                        >Edit</a
                      >
                    </li>
                    <!-- TODO: Delete uses a confirmation dialog -->
                    <li><button onclick={() => {}}>Delete</button></li>
                  </ul>
                </details>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
