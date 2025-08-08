<script lang="ts">
  import EntryForm from '$lib/components/EntryForm.svelte';
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

<form onsubmit={handleSubmit} class="mx-auto w-full max-w-2xl p-6">
  <fieldset class="fieldset bg-base-100/50 border-base-300 rounded-box border p-4">
    <legend class="fieldset-legend text-xl">New entry</legend>

    <label for="entry-id" class="label">ID</label>
    <input
      id="entry-id"
      placeholder="UMLAndPatterns"
      class="input w-full font-mono"
      type="text"
      bind:value={newEntryId}
    />

    <EntryForm bind:entryData={newEntryData} />

    <button class="btn btn-primary mt-4">Add</button>
    <a href={`/bibliography/${params.id}/`} class="btn btn-secondary">Cancel</a>
  </fieldset>
</form>
