<script lang="ts">
  import EntryForm from '$lib/components/EntryForm.svelte';
  import type { Hayagriva, TopLevelEntry } from '$lib/types/hayagriva';
  import type { PageProps } from './$types';
  import { ClipboardPaste, Save, X } from '@lucide/svelte';
  import { bibliographyService } from '$lib/services/bibliography.service';
  import { hayagrivaService } from '$lib/services/hayagriva.service';

  let { params }: PageProps = $props();

  let newEntryId: string = $state('');
  let newEntryData: TopLevelEntry = $state({
    type: 'misc'
  });

  // TODO: Handle submit
  // Here is where the data should be properly formatted, not in every component
  // For example, if a formattable string is an object with only "value", it should be converted into a string.
  async function handleSubmit() {
    await bibliographyService.saveEntry(
      params.bibliographyId,
      newEntryId,
      newEntryData
    );
  }
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
          const data = hayagrivaService.import(text);

          if (data === null || data === undefined) {
            alert('Invalid bibliography.');
            return;
          }

          const dataLength = Object.keys(data).length;

          if (dataLength > 1 || dataLength <= 0) {
            alert(
              `The bibliography needs to have 1 entry. It has ${dataLength} entries.`
            );
            return;
          }

          newEntryId = Object.keys(data)[0];
          newEntryData = data[newEntryId];
        });
      }}
    >
      <ClipboardPaste class="size-[1.2em]" />
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
      <Save class="size-[1.2em]" />
      Add
    </button>
    <a
      href={`/bibliography/${params.bibliographyId}/`}
      class="btn btn-error"
      type="button"
    >
      <X class="size-[1.2em]" />
      Cancel
    </a>
  </fieldset>
</form>
