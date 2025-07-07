<script lang="ts">
  import type { Entry } from '$lib/types/entry';
  import { onMount } from 'svelte';
  import FormattableStringInput from './FormattableStringInput.svelte';
  import { getEntryTypes } from '$lib/hayagriva-schema';
  import DateInput from './DateInput.svelte';

  const { entry, onUpdate } = $props<{
    entry: Entry | null;
    onUpdate: (updatedEntry: Entry) => void;
  }>();

  let entryTypes = $state<string[]>([]);

  onMount(async () => {
    entryTypes = await getEntryTypes();
  });

  function updateField<K extends keyof Entry>(field: K, value: Entry[K]) {
    if (!entry) return;
    onUpdate({ ...entry, [field]: value });
  }

  function formatEntryType(type: Entry['type']): string {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
</script>

<div class="card bg-base-100 sticky top-4 shadow-md">
  <div class="card-body">
    <h2 class="card-title mb-2">Entry Details</h2>
    {#if entry}
      <form class="flex flex-col gap-4">
        <label class="select w-full">
          <span class="label">Type</span>
          <select value={entry.type} onchange={(e) => updateField('type', e.currentTarget.value)}>
            {#each entryTypes as type}
              <option value={type}>{formatEntryType(type)}</option>
            {/each}
          </select>
        </label>

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
      </form>
    {:else}
      <div class="text-base-content/60 flex h-full items-center justify-center text-center">
        <p>Select an entry from the list to see its details.</p>
      </div>
    {/if}
  </div>
</div>
