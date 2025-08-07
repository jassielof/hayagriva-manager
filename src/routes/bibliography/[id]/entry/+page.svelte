<!-- TODO: New entry form -->
<script lang="ts">
  import type { BibliographyEntry, Hayagriva } from '$lib/types/hayagriva';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  let newEntry: Hayagriva = $state({});
  let newEntryId: string = $state('');
  let newEntryData: BibliographyEntry = $state();

  function handleSubmit() {}
</script>

<form onsubmit={handleSubmit} class="mx-auto w-full max-w-md p-6">
  <fieldset class="fieldset">
    <legend class="fieldset-legend">New entry</legend>

    <label for="entry-id" class="label">ID</label>
    <input
      id="entry-id"
      class="input font-mono"
      type="text"
      bind:value={newEntry}
    />

    <button class="btn btn-primary">Add</button>
    <a href={`/bibliography/${params.id}/`} class="btn btn-secondary">Cancel</a>
  </fieldset>
</form>
