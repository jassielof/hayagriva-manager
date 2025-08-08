<!-- TODO: New entry form -->
<script lang="ts">
  import EntryTypeInput from '$lib/components/schema-definitions/EntryTypeInput.svelte';
  import FormattableStringInput from '$lib/components/schema-definitions/FormattableStringInput.svelte';
  import type {
    BibliographyEntry,
    Hayagriva,
    TopLevelEntry
  } from '$lib/types/hayagriva';
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();

  let newEntryId: string = $state('');
  let newEntryData: TopLevelEntry = $state({});

  function handleSubmit() {}
</script>

<form onsubmit={handleSubmit} class="mx-auto w-full max-w-md p-6">
  <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
    <legend class="fieldset-legend">New entry</legend>

    <label for="entry-id" class="label">ID</label>
    <input
      id="entry-id"
      placeholder="UMLAndPatterns"
      class="input w-full font-mono"
      type="text"
      bind:value={newEntryId}
    />

    <EntryTypeInput bind:value={newEntryData.type!} />

    <FormattableStringInput
      label="Title"
      placeholder="UML & Patterns"
      bind:value={newEntryData.title!}
    />

    <!-- TODO: Add Author input -->
    <!-- TODO: Add Date input -->
    <!-- TODO: Add ParentEntry input -->

    <FormattableStringInput
      label="Abstract"
      placeholder="This article compares..."
      bind:value={newEntryData.abstract!}
      multiline={true}
    />

    <FormattableStringInput
      label="Genre"
      placeholder="Doctoral dissertation"
      bind:value={newEntryData.genre!}
    />

    <FormattableStringInput
      label="Call Number"
      placeholder="QA76.76.D47 G66 2005"
      bind:value={newEntryData['call-number']!}
    />

    <FormattableStringInput
      label="Location"
      placeholder="New York, NY"
      bind:value={newEntryData.location!}
    />

    <FormattableStringInput
      label="Organization"
      placeholder="ACM"
      bind:value={newEntryData.organization!}
    />

    <FormattableStringInput
      label="Archive"
      placeholder="Library of Congress"
      bind:value={newEntryData.archive!}
    />

    <FormattableStringInput
      label="Archive Location"
      placeholder="Box 12, Folder 3"
      bind:value={newEntryData['archive-location']!}
    />

    <FormattableStringInput
      label="Note"
      placeholder="See also related work in appendix."
      bind:value={newEntryData.note!}
      multiline={true}
    />

    <button class="btn btn-primary mt-4">Add</button>
    <a href={`/bibliography/${params.id}/`} class="btn btn-secondary">Cancel</a>
  </fieldset>
</form>
