<script lang="ts">
  import { onMount } from 'svelte';
  import FormattableStringInput from './schema-definitions/FormattableStringInput.svelte';
  import DateInput from './schema-definitions/DateInput.svelte';
  import LanguageInput from './schema-definitions/LanguageInput.svelte';
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import { ENTRY_TYPES } from '$lib/validators/entry-type';
  import EntryTypeInput from './schema-definitions/EntryTypeInput.svelte';

  const { entry, onUpdate } = $props<{
    entry: BibliographyEntry | null;
    onUpdate: (updatedEntry: BibliographyEntry) => void;
  }>();

  let entryTypes = $state<string[]>([]);

  onMount(async () => {
    entryTypes = ENTRY_TYPES;
  });

  function updateField<K extends keyof BibliographyEntry>(field: K, value: BibliographyEntry[K]) {
    if (!entry) return;
    onUpdate({ ...entry, [field]: value });
  }

  function formatEntryType(type: BibliographyEntry['type']): string {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
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

        <DateInput
          label="Date"
          placeholder="YYYY, YYYY-MM, or YYYY-MM-DD"
          value={entry.date}
          update={(newValue) => {
            updateField('date', newValue);
          }}
        />

        <LanguageInput />
      </form>
    {:else}
      <div class="text-base-content/60 flex h-full items-center justify-center text-center">
        <p>Select an entry from the list to see its details.</p>
      </div>
    {/if}
  </div>
</div>
