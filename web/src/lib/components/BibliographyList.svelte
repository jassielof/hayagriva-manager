<script lang="ts">
  import type { Bibliography } from '$lib/types/bibliography';
  import BibliographyCard from '$lib/components/BibliographyCard.svelte';

  const { bibliographies, edit, del } = $props<{
    bibliographies: Bibliography[];
    edit: (id: string) => void;
    del: (id: string) => void;
  }>();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {#each bibliographies as bib (bib.metadata.id)}
    <BibliographyCard metadata={bib.metadata} {edit} {del} />
  {/each}
</div>
