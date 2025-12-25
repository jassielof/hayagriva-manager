<script lang="ts">
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import EntryForm from './EntryForm.svelte';
  import EntryTypeInput from '$lib/components/schema-definitions/EntryTypeInput.svelte';
  import FormattableStringInput from '$lib/components/schema-definitions/FormattableStringInput.svelte';
  import { X, Plus } from '@lucide/svelte';
  import PeopleInput from './schema-definitions/PeopleInput.svelte';
  import DateInput from './schema-definitions/DateInput.svelte';
  import LanguageInput from './schema-definitions/LanguageInput.svelte';
  import UrlInput from './schema-definitions/UrlInput.svelte';
  import NumericOrStringInput from './schema-definitions/NumericOrStringInput.svelte';
  import IntegerInput from './schema-definitions/IntegerInput.svelte';
  import PublisherInput from './schema-definitions/PublisherInput.svelte';
  import SerialNumberInput from './schema-definitions/SerialNumberInput.svelte';
  import AffiliatedListInput from './schema-definitions/AffiliatedListInput.svelte';
  import TimestampInput from './schema-definitions/TimestampInput.svelte';
  import TimestampRangeInput from './schema-definitions/TimestampRangeInput.svelte';

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

<div class="space-y-6">
  <!-- Basic Information -->
  <div class="space-y-4">
    <EntryTypeInput bind:value={entryData.type!} />

    <FormattableStringInput
      label="Title"
      placeholder="UML & Patterns"
      shortPlaceholder="UML"
      bind:value={entryData.title}
    />
  </div>

  <!-- People -->
  <div class="space-y-4">
    <PeopleInput label="Author" bind:value={entryData.author} />

    <DateInput bind:value={entryData.date} />

    <PeopleInput label="Editor" bind:value={entryData.editor} />

    <AffiliatedListInput bind:value={entryData.affiliated} />
  </div>

  <!-- Publication Details -->
  <div class="space-y-4">
    <PublisherInput bind:value={entryData.publisher} />

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <NumericOrStringInput
        label="Issue"
        placeholder="5"
        bind:value={entryData.issue}
      />

      <NumericOrStringInput
        label="Volume"
        placeholder="10"
        bind:value={entryData.volume}
      />

      <NumericOrStringInput
        label="Edition"
        placeholder="2nd"
        bind:value={entryData.edition}
      />

      <NumericOrStringInput
        label="Page range"
        placeholder="1-10"
        bind:value={entryData['page-range']}
      />

      <IntegerInput
        bind:value={entryData['volume-total']}
        label="Volume total"
        naturalSet={true}
        placeholder="0"
      />

      <IntegerInput
        bind:value={entryData['page-total']}
        label="Page total"
        naturalSet={true}
        placeholder="0"
      />
    </div>
  </div>

  <!-- Media & Time -->
  <div class="space-y-4">
    <TimestampRangeInput
      bind:value={entryData['time-range']}
      label="Time range"
    />

    <TimestampInput bind:value={entryData.runtime} label="Runtime" />
  </div>

  <!-- Digital & Identification -->
  <div class="space-y-4">
    <UrlInput bind:value={entryData.url} />

    <SerialNumberInput bind:value={entryData['serial-number']} />

    <LanguageInput bind:value={entryData.language} />
  </div>

  <!-- Additional Information -->
  <div class="space-y-4">
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
  </div>

  <div class="divider my-8"></div>

  <div class="form-control w-full">
    <label for="parent-type" class="label">
      <span class="label-text text-base font-semibold"
        >Parent Entry Configuration</span
      >
    </label>
    <select
      id="parent-type"
      class="select select-bordered w-full"
      value={parentType}
      onchange={handleParentTypeChange}
    >
      <option value="none">No parent entry</option>
      <option value="single">Single parent entry</option>
      <option value="list">Multiple parent entries</option>
    </select>
    <label for="parent-type" class="label">
      <span class="label-text-alt text-base-content/60"
        >Parent entries represent works this entry is part of (e.g., a chapter
        in a book)</span
      >
    </label>
  </div>

  {#if parentType === 'single' && entryData.parent && !Array.isArray(entryData.parent)}
    <div class="card bg-primary/5 border-primary/30 mt-6 border-2">
      <div class="card-body gap-4 p-6">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-primary flex items-center gap-2 text-lg font-bold">
              <span class="badge badge-primary badge-sm">Parent</span>
              Parent Entry
            </h3>
            <p class="text-base-content/70 mt-1 text-sm">
              This entry is contained within:
              <span class="font-semibold italic">
                {#if typeof entryData.title == 'string'}
                  "{entryData.title}"
                {:else if typeof entryData.title === 'object' && entryData.title.value}
                  "{entryData.title.value}"
                {/if}
              </span>
            </p>
          </div>
        </div>
        <div class="border-primary/40 border-l-4 pl-4">
          <EntryForm bind:entryData={entryData.parent} />
        </div>
      </div>
    </div>
  {/if}

  {#if parentType === 'list' && Array.isArray(entryData.parent)}
    <div class="mt-6 space-y-6">
      {#each entryData.parent as _, i}
        <div class="card bg-primary/5 border-primary/30 border-2">
          <div class="card-body gap-4 p-6">
            <div class="flex items-start justify-between">
              <div>
                <h3
                  class="text-primary flex items-center gap-2 text-lg font-bold"
                >
                  <span class="badge badge-primary badge-sm"
                    >Parent {i + 1}</span
                  >
                  Parent Entry #{i + 1}
                </h3>
                <p class="text-base-content/70 mt-1 text-sm">
                  This entry is contained within:
                  <span class="font-semibold italic">"{entryData.title}"</span>
                </p>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-circle btn-outline btn-error"
                onclick={() => removeParent(i)}
                aria-label="Remove parent entry {i + 1}"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <div class="border-primary/40 border-l-4 pl-4">
              <EntryForm bind:entryData={entryData.parent[i]} />
            </div>
          </div>
        </div>
      {/each}

      <button
        type="button"
        class="btn btn-primary btn-outline btn-block gap-2"
        onclick={addParent}
      >
        <Plus class="size-5" />
        Add Another Parent Entry
      </button>
    </div>
  {/if}
</div>
