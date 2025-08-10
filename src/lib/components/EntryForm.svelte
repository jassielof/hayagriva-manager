<script lang="ts">
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import EntryForm from './EntryForm.svelte';
  import EntryTypeInput from '$lib/components/schema-definitions/EntryTypeInput.svelte';
  import FormattableStringInput from '$lib/components/schema-definitions/FormattableStringInput.svelte';
  import { Plus, X } from '@lucide/svelte';
  import PeopleInput from './schema-definitions/PeopleInput.svelte';
  import DateInput from './schema-definitions/DateInput.svelte';
  import LanguageInput from './schema-definitions/LanguageInput.svelte';
  import UrlInput from './schema-definitions/UrlInput.svelte';

  let { entryData = $bindable() }: { entryData: BibliographyEntry } = $props();

  let parentType: 'none' | 'single' | 'list' = $state('none');

  $effect(() => {
    if (entryData.parent === undefined || entryData.parent === null) {
      parentType = 'none';
    } else if (Array.isArray(entryData.parent)) {
      parentType = 'list';
    } else {
      parentType = 'single';
    }
  });

  function handleParentTypeChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const newType = target.value;

    switch (newType) {
      case 'none':
        entryData.parent = undefined;
        break;
      case 'single':
        if (!entryData.parent || Array.isArray(entryData.parent)) {
          entryData.parent = { type: 'Misc' };
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

  <PeopleInput label="Author" bind:value={entryData.author} />

  <DateInput bind:value={entryData.date} />

  <PeopleInput label="Editor" bind:value={entryData.editor} />

  <!-- TODO: Add affiliated as affiliated list-->
  <!-- TODO: Add publisher as publisher -->
  <!-- TODO: Add issue as numeric or string -->
  <!-- TODO: Add volume as numeric or string -->
  <!-- TODO: Add volume total as integer -->
  <!-- TODO: Add edition as numeric or string -->
  <!-- TODO: Add page range as numeric or string -->
  <!-- TODO: Add page total as integer -->
  <!-- TODO: Add time range as timestamp range -->
  <!-- TODO: Add runtime as timestamp -->

  <UrlInput bind:value={entryData.url} />

  <!-- TODO: Add serial number as serial number -->

  <LanguageInput bind:value={entryData.language} />

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
    <h3 class="text-secondary mt-4 text-lg">
      Parent entry of
      <span class="font-semibold italic">
        {#if typeof entryData.title == 'string'}
          {entryData.title}
        {:else if typeof entryData.title === 'object' && entryData.title.value}
          {entryData.title.value}
        {/if}
      </span>
    </h3>
    <EntryForm bind:entryData={entryData.parent} />
  {/if}

  {#if parentType === 'list' && Array.isArray(entryData.parent)}
    {#each entryData.parent as _, i}
      <div class="mt-4 flex">
        <div class="flex-1">
          <h3 class="text-secondary text-lg">
            Parent entry #{i + 1} of
            <span class="font-semibold italic">
              {entryData.title}
            </span>
          </h3>
        </div>

        <div class="flex items-center">
          <button
            type="button"
            class="btn btn-sm btn-circle btn-outline btn-error"
            onclick={() => removeParent(i)}
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <EntryForm bind:entryData={entryData.parent[i]} />
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
