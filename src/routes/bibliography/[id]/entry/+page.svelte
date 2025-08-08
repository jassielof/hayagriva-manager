<script lang="ts">
  import yaml from 'js-yaml';
  import EntryForm from '$lib/components/EntryForm.svelte';
  import type { Hayagriva, TopLevelEntry } from '$lib/types/hayagriva';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  let newEntryId: string = $state('');
  let newEntryData: TopLevelEntry = $state({});

  function handleSubmit() {}
</script>

<!-- TODO: Add paste button to read the content from the clipboard, it should be a valid Hayagriva key. -->
<form onsubmit={handleSubmit} class="mx-auto w-full max-w-2xl p-6">
  <fieldset
    class="fieldset bg-base-100/50 border-base-300 rounded-box border p-4"
  >
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
    <button
      class="btn btn-secondary"
      onclick={() => {
        navigator.clipboard.readText().then((text) => {
          const data = yaml.load(text);
          if (typeof data === 'object' && data !== null) {
            newEntryId = Object.keys(data as Hayagriva).at(0)!;
            newEntryData = (data as Hayagriva)[newEntryId];
          } else {
            alert('Invalid YAML format');
          }
        });
      }}>Paste</button
    >
    <a href={`/bibliography/${params.id}/`} class="btn btn-error">Cancel</a>
  </fieldset>
</form>
