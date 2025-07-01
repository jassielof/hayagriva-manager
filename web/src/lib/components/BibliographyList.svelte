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
      <li>
        <a href={`/bibliographies/${bib.metadata.id}`} class="list-row">
          <div
            class="bg-base-200 rounded-box flex size-12 flex-shrink-0 items-center justify-center"
          >
            <Book class="size-6 opacity-60" />
          </div>

          <div class="flex-shrink-0">
            <div class="font-semibold">{bib.metadata.title}</div>
            <div class="text-xs opacity-60">Updated: {formatDate(bib.metadata.updatedAt)}</div>
          </div>

          <p class="list-col-wrap text-sm opacity-80">
            {bib.metadata.description || 'No description provided.'}
          </p>

          <div class="flex flex-shrink-0 gap-1">
            <button
              class="btn btn-square btn-ghost"
              onclick={(e) => {
                e.stopPropagation();
                edit(bib.metadata.id);
              }}
              title="Edit Bibliography"
              aria-label="Edit Bibliography"
            >
              <Pencil class="size-5" />
            </button>
            <button
              class="btn btn-square btn-ghost text-error"
              onclick={(e) => {
                e.stopPropagation();
                del(bib.metadata.id);
              }}
              title="Delete Bibliography"
              aria-label="Delete Bibliography"
            >
              <Trash class="size-5" />
            </button>
          </div>
        </a>
      </li>
    {/each}
  </ul>
</div>
