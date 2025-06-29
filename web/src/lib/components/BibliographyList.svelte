<script lang="ts">
  import type { Bibliography } from '$lib/types/bibliography';
  import BibliographyCard from './BibliographyCard.svelte';

  export let bibliographies: Bibliography[] = [];
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {#each bibliographies as bib (bib.metadata.id)}
    <BibliographyCard metadata={bib.metadata} />
  {/each}
</div>
