<script lang="ts">
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import EntryForm from './EntryForm.svelte';
  import EntryTypeInput from '$lib/components/schema-definitions/EntryTypeInput.svelte';
  import FormattableStringInput from '$lib/components/schema-definitions/FormattableStringInput.svelte';
  import { Plus } from '@lucide/svelte';

  let { entryData = $bindable() }: { entryData: BibliographyEntry } = $props();

  // Helper state to manage the UI for the parent type
  let parentType: 'none' | 'single' | 'list' = $state('none');

  // Sync the `parentType` state with the actual data structure of `entry.parent`
  $effect(() => {
    if (entryData.parent === undefined || entryData.parent === null) {
      parentType = 'none';
    } else if (Array.isArray(entryData.parent)) {
      parentType = 'list';
    } else {
      parentType = 'single';
    }
  });

  // Function to change the parent structure based on user selection
  function handleParentTypeChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const newType = target.value;

    switch (newType) {
      case 'none':
        entryData.parent = undefined;
        break;
      case 'single':
        if (!entryData.parent || Array.isArray(entryData.parent)) {
          entryData.parent = { type: 'Misc' }; // Start with a default empty entry
        }
        break;
      case 'list':
        if (!Array.isArray(entryData.parent)) {
          entryData.parent = entryData.parent ? [entryData.parent] : [];
        }
        break;
    }
  }

  function addParent() {
    if (Array.isArray(entryData.parent)) {
      entryData.parent = [...entryData.parent, { type: 'Misc' }];
    }
  }

  function removeParent(index: number) {
    if (Array.isArray(entryData.parent)) {
      entryData.parent = entryData.parent.filter((_, i) => i !== index);
    }
  }
</script>

<fieldset
  class="fieldset bg-base-100 border-base-300 rounded-box mt-4 border-2 p-4"
>
  <legend class="fieldset-legend text-primary text-lg">Entry Details</legend>

  <EntryTypeInput bind:value={entryData.type!} />

  <FormattableStringInput
    label="Title"
    placeholder="UML & Patterns"
    bind:value={entryData.title!}
  />

  <!-- TODO: Add Author input -->
  <!-- TODO: Add Date input -->
  <!-- TODO: Add ParentEntry input -->

  <FormattableStringInput
    label="Abstract"
    placeholder="This article compares..."
    bind:value={entryData.abstract!}
    multiline={true}
  />

  <FormattableStringInput
    label="Genre"
    placeholder="Doctoral dissertation"
    bind:value={entryData.genre!}
  />

  <FormattableStringInput
    label="Call Number"
    placeholder="QA76.76.D47 G66 2005"
    bind:value={entryData['call-number']!}
  />

  <FormattableStringInput
    label="Location"
    placeholder="New York, NY"
    bind:value={entryData.location!}
  />

  <FormattableStringInput
    label="Organization"
    placeholder="ACM"
    bind:value={entryData.organization!}
  />

  <FormattableStringInput
    label="Archive"
    placeholder="Library of Congress"
    bind:value={entryData.archive!}
  />

  <FormattableStringInput
    label="Archive Location"
    placeholder="Box 12, Folder 3"
    bind:value={entryData['archive-location']!}
  />

  <FormattableStringInput
    label="Note"
    placeholder="See also related work in appendix."
    bind:value={entryData.note!}
    multiline={true}
  />

  <div class="divider"></div>

  <label for="parent-type" class="label">Parent Type</label>
  <select
    id="parent-type"
    class="select w-full"
    value={parentType}
    onchange={handleParentTypeChange}
  >
    <option value="none">None</option>
    <option value="single">Single Parent</option>
    <option value="list">List of Parents</option>
  </select>

  {#if parentType === 'single' && entryData.parent && !Array.isArray(entryData.parent)}
    <h3 class="text-secondary text-lg font-bold">
      Parent entry of {entryData.title}
    </h3>
    <EntryForm bind:entryData={entryData.parent} />
  {/if}

  {#if parentType === 'list' && Array.isArray(entryData.parent)}
    {#each entryData.parent as _, i}
      <div class=" relative mt-4">
        <h3 class="text-secondary text-lg font-bold">
          Parent entry #{i + 1} of {entryData.title}
        </h3>

        <button
          type="button"
          class="btn btn-sm btn-circle btn-outline btn-error absolute top-0 right-0"
          onclick={() => removeParent(i)}
        >
          &times;
        </button>

        <EntryForm bind:entryData={entryData.parent[i]} />
      </div>
    {/each}

    <button
      type="button"
      class="btn btn-secondary btn-outline mt-4"
      onclick={addParent}
    >
      Add Parent
    </button>
  {/if}
</fieldset>
