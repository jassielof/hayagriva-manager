<script lang="ts">
  import type { Bibliography } from '$lib/types/bibliography';
  import {
    Book,
    BookOpen,
    Copy,
    Download,
    Pencil,
    Trash
  } from '@lucide/svelte';

  const {
    bibliographies,
    edit,
    del
  }: {
    bibliographies: Bibliography[];
    edit: (id: string) => void;
    del: (id: string) => void;
  } = $props();

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }
</script>

<div class="overflow-x-auto">
  <ul class="list">
    {#each bibliographies as bib (bib.metadata.id)}
      <li class="list-row">
        <div class="flex h-full items-center justify-center">
          <Book />
        </div>
        <div class="list-col-grow flex flex-col items-start justify-center">
          <h6 class="font-bold">{bib.metadata.title}</h6>
          <time class="text-xs opacity-60">
            Updated: {formatDate(bib.metadata.updatedAt)}
          </time>
          <p class="mt-1 text-sm opacity-80">
            {bib.metadata.description || 'No description provided.'}
          </p>
        </div>

        <div
          class="join lg:join-horizontal join-vertical flex items-center justify-end"
        >
          <a
            href={`/bibliographies/${bib.metadata.id}`}
            class="btn btn-soft join-item"
            title="Open"
          >
            <BookOpen />
          </a>

          <button
            class="btn btn-soft join-item"
            onclick={() => edit(bib.metadata.id)}
            title="Edit metadata"
            aria-label="Edit metadata"
          >
            <Pencil />
          </button>

          <button class="btn btn-soft join-item" title="Download as YAML file">
            <Download />
          </button>

          <button
            class="btn btn-soft join-item"
            title="Copy to clipboard as YAML"
          >
            <Copy />
          </button>

          <button
            class="btn btn-soft btn-error join-item"
            onclick={() => del(bib.metadata.id)}
            title="Delete Bibliography"
            aria-label="Delete Bibliography"
          >
            <Trash />
          </button>
        </div>
      </li>
    {/each}
  </ul>
</div>
