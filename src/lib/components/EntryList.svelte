<script lang="ts">
  import { formatEntryType } from '$lib/formatters/entry-type-formatter';
  import { bibliographyService } from '$lib/services/bibliography.service';
  import type { FormattableString } from '$lib/types/formattable-string';
  import type { BibliographyEntry, Hayagriva } from '$lib/types/hayagriva';
  import {
    Calendar,
    Ellipsis,
    Eye,
    Hash,
    Pencil,
    Trash,
    User
  } from '@lucide/svelte';

  let {
    entries = $bindable(),
    bibliographyId = $bindable()
  }: {
    entries: Hayagriva;
    bibliographyId: string;
  } = $props();

  function formatTitle(title: FormattableString | undefined | null): string {
    if (!title) return '';

    if (typeof title === 'string') {
      return title;
    }

    return title.short || title.value || '';
  }

  function formatAuthor(author: BibliographyEntry['author']): string {
    if (!author) return '';
    if (typeof author === 'string') return author;
    if (Array.isArray(author)) {
      return author.map((a) => (typeof a === 'string' ? a : a.name)).join('; ');
    }
    return author.name || '';
  }

  function formatEntryDate(date: BibliographyEntry['date']): string {
    if (!date) {
      return '';
    }

    if (typeof date === 'number') {
      return date.toString();
    }

    if (typeof date === 'string') {
      return date.split('T')[0];
    }

    return '';
  }
</script>

<div class="card mt-4 shadow-md">
  {#if Object.entries(entries).length === 0}
    <div class="card-body">
      <p class="text-center text-gray-500">This bibliography has no entries.</p>
    </div>
  {:else}
    <ul class="list bg-base-200 rounded-box shadow-md">
      {#each Object.entries(entries) as [id, entry] (id)}
        {@const { label, Icon } = formatEntryType(entry.type)}
        <li class="list-row">
          <div class="flex flex-col items-center justify-center">
            <div class="tooltip tooltip-right" data-tip={label}>
              <Icon />
            </div>
          </div>
          <div>
            <span class="font-mono text-sm">
              <Hash class="inline size-[1.2em]" />
              {id}
            </span>
            <br />
            <span class="text-lg font-semibold">
              {formatTitle(entry.title)}
            </span>
            {#if entry.author}
              <br />
              <span class="font-serif italic">
                <User class="inline size-[1.2em]" />
                {formatAuthor(entry.author)}
              </span>
            {/if}
            {#if entry.date}
              <br />
              <span class="text-xs">
                <Calendar class="inline size-[1.2em]" />
                {formatEntryDate(entry.date)}
              </span>
            {/if}
          </div>
          <div class="flex flex-col items-center justify-center">
            <button
              class="btn m-1"
              popovertarget={`popover-${id}`}
              style={`anchor-name: --anchor-${id};`}
            >
              <Ellipsis class="inline-block" />
            </button>
            <ul
              class="dropdown dropdown-left menu rounded-box bg-base-100 w-max shadow-sm"
              popover
              id={`popover-${id}`}
              style={`position-anchor: --anchor-${id};`}
            >
              <li>
                <a href="/bibliography/{bibliographyId}/entry/{id}">
                  <Eye class="inline size-[1.2em]" />
                  View
                </a>
              </li>
              <li>
                <a href="/bibliography/{bibliographyId}/entry/{id}/edit">
                  <Pencil class="inline size-[1.2em]" />
                  Edit</a
                >
              </li>
              <li>
                <button
                  class="btn btn-error btn-sm btn-soft"
                  onclick={async () => {
                    confirm(
                      `Are you sure you want to delete the following entry: ${id}?`
                    );

                    await bibliographyService.deleteEntry(bibliographyId, id);
                    delete entries[id];
                  }}
                >
                  <Trash class="inline size-[1.2em]" />
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
