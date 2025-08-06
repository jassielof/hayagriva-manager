<script lang="ts">
  import { onMount } from 'svelte';
  import FormattableStringInput from './schema-definitions/FormattableStringInput.svelte';
  import DateInput from './schema-definitions/DateInput.svelte';
  import LanguageInput from './schema-definitions/LanguageInput.svelte';
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import { ENTRY_TYPES } from '$lib/validators/entry-type';
  import EntryTypeInput from './schema-definitions/EntryTypeInput.svelte';
  import type { Bibliography } from '$lib/types/bibliography';
  import { db } from '$lib/db';

  let {
    entry,
    entryId,
    bibliography
  }: {
    entry: BibliographyEntry | null;
    entryId: string | null;
    bibliography: Bibliography | null;
  } = $props();

  let entryTypes = $state<string[]>([]);

  onMount(async () => {
    entryTypes = ENTRY_TYPES;
  });

  async function updateField(
    field: keyof BibliographyEntry,
    value: BibliographyEntry[keyof BibliographyEntry]
  ) {
    if (!entry || !bibliography || !entryId) return;
    const updatedEntry = { ...entry, [field]: value };
    await db.saveBibliographyEntry(bibliography, entryId, updatedEntry);
  }
</script>

<div class="card bg-base-100 sticky top-4 shadow-md">
  <div class="card-body">
    <h2 class="card-title mb-2">Entry Details</h2>
    <!-- FIXME: Top entries must have a type, parent entries can omit it and default it to miscellaneous type -->
    {#if entry}
      <form class="flex flex-col gap-4">
        <label for="entry-id" class="label">ID</label>
        <input
          id="entry-id"
          class="input font-mono"
          type="text"
          bind:value={entryId}
        />

        <EntryTypeInput
          value={entry.type ?? ''}
          onUpdate={(newValue) => updateField('type', newValue ?? '')}
        />

        <FormattableStringInput
          label="Title"
          placeholder="Title of the work"
          value={entry.title}
          update={(newValue) => {
            updateField('title', newValue);
          }}
        />

        <!-- TODO: Add author -->

        <FormattableStringInput
          label="Abstract"
          placeholder="Abstract or summary of the entry"
          value={entry.abstract}
          update={(newValue) => {
            updateField('abstract', newValue);
          }}
          multiline={true}
        />

        <FormattableStringInput
          label="Genre"
          placeholder="Class or subtype of the item"
          value={entry.genre}
          update={(newValue) => {
            updateField('genre', newValue);
          }}
        />

        <FormattableStringInput
          label="Call number"
          placeholder="Number of the item in the library"
          value={entry['call-number']}
          update={(newValue) => {
            updateField('call-number', newValue);
          }}
        />

        <FormattableStringInput
          label="Location"
          placeholder="Physical location/place of the item"
          value={entry.location}
          update={(newValue) => {
            updateField('location', newValue);
          }}
        />

        <!-- TODO: Add publisher (as publisher) -->

        <FormattableStringInput
          label="Organization"
          placeholder="Organization at/for which the entry was produced"
          value={entry.organization}
          update={(newValue) => {
            updateField('organization', newValue);
          }}
        />

        <!-- TODO: Add volume (as numeric or string) -->

        <label class="label" for="volume-total">Volume total </label>
        <input
          id="volume-total"
          type="number"
          class="input"
          placeholder="Total number of volumes, parts, seasons, etc."
          bind:value={entry['volume-total']}
        />

        <!-- TODO: Add entry edition (as numeric or string) -->

        <!-- TODO: Add editor (as person or list) -->
        <!-- TODO: Add affiliated (as affiliated list) -->

        <DateInput
          label="Date"
          placeholder="YYYY, YYYY-MM, or YYYY-MM-DD"
          value={entry.date}
          update={(newValue) => {
            updateField('date', newValue);
          }}
        />

        <LanguageInput
          value={entry.language ?? ''}
          onUpdate={(newValue) => updateField('language', newValue)}
        />

        <!-- TODO: Add entry issue (as numeric or string) -->

        <!-- TODO: Add page range (as numeric or string) -->
        <label class="label" for="page-total">Page total</label>
        <input
          id="page-total"
          type="number"
          class="input"
          placeholder="Total number of pages in the entry"
          bind:value={entry['page-total']}
        />
        <!-- TODO: Add time range (as timestamp range) -->
        <!-- TODO: Add runtime (as timestamp) -->
        <!-- TODO: Add URL (as url) -->
        <!-- TODO: Add serial number (as serial number) -->
        <FormattableStringInput
          label="Archive"
          placeholder="Archive where the entry is stored"
          value={entry.archive}
          update={(newValue) => {
            updateField('archive', newValue);
          }}
        />

        <FormattableStringInput
          label="Archive location"
          placeholder="Location in the archive"
          value={entry['archive-location']}
          update={(newValue) => {
            updateField('archive-location', newValue);
          }}
        />

        <FormattableStringInput
          label="Note"
          placeholder="Additional notes or comments about the entry"
          value={entry.note}
          update={(newValue) => {
            updateField('note', newValue);
          }}
        />
        <!-- TODO: Add parent entry (as an entry) -->
      </form>
    {:else}
      <div
        class="text-base-content/60 flex h-full items-center justify-center text-center"
      >
        <p>Select an entry from the list to see its details.</p>
      </div>
    {/if}
  </div>
</div>
