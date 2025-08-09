<script lang="ts">
  import yaml from 'js-yaml';
  import EntryForm from '$lib/components/EntryForm.svelte';
  import type { Hayagriva, TopLevelEntry } from '$lib/types/hayagriva';
  import type { PageProps } from './$types';
  import { Clipboard, ClipboardPaste, Save, X } from '@lucide/svelte';

  let { data, params }: PageProps = $props();

  let newEntryId: string = $state('');
  let newEntryData: TopLevelEntry = $state({});

  function handleSubmit() {}
</script>

<form onsubmit={handleSubmit} class="mx-auto w-full max-w-2xl p-6">
  <fieldset
    class="fieldset bg-base-100/50 border-base-300 rounded-box border p-4"
  >
    <legend class="fieldset-legend text-xl">New entry</legend>
    <button
      class="btn btn-dash btn-info"
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
      }}
    >
      <ClipboardPaste class="inline-block" />
      Paste from clipboard
    </button>
    <label for="entry-id" class="label">ID</label>
    <input
      id="entry-id"
      placeholder="UMLAndPatterns"
      class="input w-full font-mono"
      type="text"
      bind:value={newEntryId}
    />

    <EntryForm bind:entryData={newEntryData} />

    <button class="btn btn-success mt-4">
      <Save class="inline-block" />
      Add
    </button>
    <a href={`/bibliography/${params.id}/`} class="btn btn-error">
      <X />
      Cancel</a
    >
  </fieldset>
</form>
