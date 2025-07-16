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
    {#if entry}
      <form class="flex flex-col gap-4">
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

        <FormattableStringInput
          label="Organization"
          placeholder="Organization at/for which the entry was produced"
          value={entry.organization}
          update={(newValue) => {
            updateField('organization', newValue);
          }}
        />

        <label class="input">
          <span class="label">Volume total</span>
          <input
            type="number"
            placeholder="Total number of volumes, parts, seasons, etc."
            bind:value={entry['volume-total']}
          />
        </label>

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
