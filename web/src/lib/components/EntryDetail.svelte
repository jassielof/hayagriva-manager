<script lang="ts">
  import type { Entry } from '$lib/types/entry';
  import { onMount } from 'svelte';
  import FormattableStringInput from './FormattableStringInput.svelte';

  const { entry } = $props<{
    entry: Entry | null;
  }>();

  let entryTypes = $state<string[]>([]);

  onMount(async () => {
    try {
      // Fetch the schema to get the list of valid entry types
      const res = await fetch(
        'https://jassielof.github.io/json-schemas/docs/hayagriva.schema.json'
      );
      if (!res.ok) throw new Error('Failed to fetch schema');
      const schema = await res.json();
      const types = schema?.definitions?.entryType?.examples;
      if (Array.isArray(types)) {
        entryTypes = types;
      }
    } catch (e) {
      console.error('Could not fetch or parse Hayagriva schema:', e);
      // Fallback in case of network error
      entryTypes = ['article', 'book', 'misc', 'web'];
    }
  });

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
        <label class="select">
          <span class="label">Type</span>
          <select bind:value={entry.type}>
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
            entry.title = newValue;
          }}
        />

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Date</span>
          </div>
          <input
            type="text"
            placeholder="YYYY, YYYY-MM, or YYYY-MM-DD"
            class="input input-bordered w-full"
            bind:value={entry.date}
          />
        </label>
      </form>
    {:else}
      <div class="text-base-content/60 flex h-full items-center justify-center text-center">
        <p>Select an entry from the list to see its details.</p>
      </div>
    {/if}
  </div>
</div>
