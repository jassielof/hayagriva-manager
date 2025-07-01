<script lang="ts">
  import type { Bibliography } from '$lib/types/bibliography';
  import { Book, Pencil, Trash } from '@lucide/svelte';

  const { bibliographies, edit, del } = $props<{
    bibliographies: Bibliography[];
    edit: (id: string) => void;
    del: (id: string) => void;
  }>();

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }
</script>

<div class="overflow-x-auto">
  <ul class="list bg-base-100 rounded-box shadow-md">
    {#each bibliographies as bib (bib.metadata.id)}
      <li class="list-row">
        <div>
          <Book class="size-6 opacity-60" />
        </div>
        <div>
          <h6 class="font-semibold">{bib.metadata.title}</h6>
          <time class="text-xs opacity-60">Updated: {formatDate(bib.metadata.updatedAt)}</time>
          <p class="mt-1 text-sm opacity-80">
            {bib.metadata.description || 'No description provided.'}
          </p>
        </div>
        <a href={`/bibliographies/${bib.metadata.id}`} class="btn btn-sm btn-primary">Open</a>

        <button
          class="btn btn-sm btn-square btn-ghost"
          onclick={() => edit(bib.metadata.id)}
          title="Edit Bibliography Metadata"
          aria-label="Edit Bibliography Metadata"
        >
          <Pencil class="size-4" />
        </button>

        <button
          class="btn btn-sm btn-square btn-ghost text-error"
          onclick={() => del(bib.metadata.id)}
          title="Delete Bibliography"
          aria-label="Delete Bibliography"
        >
          <Trash class="size-4" />
        </button>
      </li>
    {/each}
  </ul>
</div>
