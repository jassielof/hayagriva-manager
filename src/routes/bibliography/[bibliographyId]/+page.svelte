<script lang="ts">
  import type { PageProps } from './$types';
  import EntryList from '$lib/components/EntryList.svelte';
  import { BookPlus } from '@lucide/svelte';

  let { data }: PageProps = $props();

  let bibliography = $state(data.bibliography);

  // TODO: Implement search by, sort by, and filter by
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
