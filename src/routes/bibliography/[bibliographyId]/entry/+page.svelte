<script lang="ts">
  import EntryForm from '$lib/components/EntryForm.svelte';
  import type { TopLevelEntry } from '$lib/types/hayagriva';
  import type { PageProps } from './$types';
  import { ClipboardPaste, Save, X } from '@lucide/svelte';
  import { loadHayagrivaYaml } from '$lib/hayagriva';

  let { params }: PageProps = $props();

  let newEntryId: string = $state('');
  let newEntryData: TopLevelEntry = $state({
    type: 'misc'
  });

  // TODO: Handle submit
  function handleSubmit() {}
</script>

<form onsubmit={handleSubmit} class="mx-auto w-full max-w-5xl p-6">
  <fieldset
    class="fieldset bg-base-100/50 border-base-300 rounded-box border p-4"
  >
    <legend class="fieldset-legend text-xl">New entry</legend>
    <button
      class="btn btn-dash btn-info"
      type="button"
      onclick={() => {
        navigator.clipboard.readText().then((text) => {
          const data = loadHayagrivaYaml(text);

          // throw alert if the data has more than 1 key
          if (Object.keys(data).length > 1) {
            alert('The pasted data has more than 1 key.');
          } else {
            // FIXME: Paste from clipboard
            // newEntryData = data;
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
    <a
      href={`/bibliography/${params.bibliographyId}/`}
      class="btn btn-error"
      type="button"
    >
      <X class="inline-block" />
      Cancel
    </a>
  </fieldset>
</form>
