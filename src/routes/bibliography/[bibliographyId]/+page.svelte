<script lang="ts">
  import type { PageProps } from './$types';
  import {
    BookPlus,
    Calendar,
    Ellipsis,
    Eye,
    Hash,
    Pencil,
    Search,
    Trash,
    User
  } from '@lucide/svelte';
  import { formatEntryType } from '$lib/formatters/entry-type-formatter';
  import type {
    BibliographyEntry,
    FormattableString,
    Hayagriva
  } from '$lib/types/hayagriva';
  import { page } from '$app/state';
  import { stateQuery } from 'dexie-svelte-query';
  import { BibliographyService } from '$lib/services/bibliography.service';

  const bibliographyId = page.params.bibliographyId;
  const bibliographyQuery = stateQuery(() =>
    BibliographyService.get(bibliographyId!)
  );

  const bibliographyQueryLoading = $derived(bibliographyQuery.isLoading);

  const bibliography = $derived(bibliographyQuery.current);

  function formatTitle(title: FormattableString | undefined | null): string {
    if (!title) return '';
    if (typeof title === 'string') return title;
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
    if (!date) return '';
    if (typeof date === 'number') return date.toString();
    if (typeof date === 'string') return date.split('T')[0];
    return '';
  }

  function formatDate(date: BibliographyEntry['date']): string | number {
    if (!date) return '';
    if (typeof date === 'number') return date;
    if (typeof date === 'string') return date;
    return '';
  }
</script>

<main class="mx-auto flex w-full max-w-5xl flex-col p-4">
  {#if bibliographyQueryLoading}
    <div class="flex min-h-[60vh] items-center justify-center">
      <span class="loading loading-xl loading-spinner"></span>
    </div>
  {:else if bibliography}
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

    <div class="card mt-4 shadow-md">
      {#if Object.entries(bibliography.data).length === 0}
        <div class="card-body">
          <p class="text-center text-gray-500">
            This bibliography has no entries.
          </p>
        </div>
      {:else}
        <ul class="list rounded-box bg-base-200 shadow-md">
          {#each Object.entries(bibliography.data) as [id, entry] (id)}
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
                  class="menu dropdown dropdown-left w-max rounded-box bg-base-100 shadow-sm"
                  popover
                  id={`popover-${id}`}
                  style={`position-anchor: --anchor-${id};`}
                >
                  <li>
                    <a
                      href="/bibliography/{bibliography.metadata.id}/entry/{id}"
                    >
                      <Eye class="inline size-[1.2em]" />
                      View
                    </a>
                  </li>
                  <li>
                    <a
                      href="/bibliography/{bibliography.metadata
                        .id}/entry/{id}/edit"
                    >
                      <Pencil class="inline size-[1.2em]" />
                      Edit
                    </a>
                  </li>
                  <li>
                    <button
                      class="btn btn-soft btn-sm btn-error"
                      onclick={async () => {
                        if (
                          confirm(
                            `Are you sure you want to delete the following entry: ${id}?`
                          )
                        ) {
                          await BibliographyService.deleteEntry(
                            bibliography.metadata.id,
                            id
                          );
                        }
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
  {/if}
</main>
