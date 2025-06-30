<script lang="ts">
  import { getBibliography } from '$lib/db';
  import type { Bibliography } from '$lib/types/bibliography';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';

  let bibliography = $state<Bibliography | null>(null);
  let entries = $state<[string, any][]>([]);

  let { data }: PageProps = $props();

  onMount(async () => {
    const bib = await getBibliography(data.id);
    if (bib) {
      bibliography = bib;
      entries = Object.entries(bib.data);
    }
  });
</script>

<main class="container mx-auto p-4">
  {#if bibliography}
    <h1 class="text-3xl font-bold">{bibliography.metadata.title}</h1>
    <p>{bibliography.metadata.description}</p>
  {:else}
    <p>Loading bibliography or not found...</p>
  {/if}
</main>
