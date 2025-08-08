<!-- TODO: New entry form -->
<script lang="ts">
  import EntryTypeInput from '$lib/components/schema-definitions/EntryTypeInput.svelte';
  import FormattableStringInput from '$lib/components/schema-definitions/FormattableStringInput.svelte';
  import type {
    BibliographyEntry,
    Hayagriva,
    TopLevelEntry
  } from '$lib/types/hayagriva';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  let newEntryId: string = $state('');
  let newEntryData: TopLevelEntry = $state({});

  function handleSubmit() {}
</script>

<form onsubmit={handleSubmit} class="mx-auto w-full max-w-md p-6">
  <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
    <legend class="fieldset-legend">New entry</legend>

    <label for="entry-id" class="label">ID</label>
    <input
      id="entry-id"
      class="input w-full font-mono"
      type="text"
      bind:value={newEntryId}
    />

    <EntryTypeInput bind:value={newEntryData.type!} />

    <FormattableStringInput
      label="Title"
      placeholder="UML & Patterns"
      bind:value={newEntryData.title!}
    />

    <button class="btn btn-primary mt-4">Add</button>
    <a href={`/bibliography/${params.id}/`} class="btn btn-secondary">Cancel</a>
  </fieldset>
</form>
