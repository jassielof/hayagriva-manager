<script lang="ts">
  import type { Author } from '$lib/types/hayagriva';
  import PersonInput from './PersonInput.svelte';
  import { Plus } from '@lucide/svelte';

  let { value = $bindable(), label }: { value?: Author; label: string } =
    $props();

  function addPerson() {
    if (value === undefined || value === null) {
      // start as single
      value = '';
      return;
    }

    if (Array.isArray(value)) {
      // already a list, append another
      value = [...value, ''];
      return;
    }

    // currently single -> convert to list and add a new empty one
    value = [value, ''];
  }

  function removeSingle() {
    value = undefined;
  }

  function removePerson(index: number) {
    if (!Array.isArray(value)) return;
    const next = value.filter((_, i) => i !== index);
    if (next.length === 0) {
      value = undefined;
    } else if (next.length === 1) {
      // collapse back to single
      value = next[0];
    } else {
      value = next;
    }
  }
</script>

<fieldset
  class="fieldset bg-base-200/30 border-base-300 gap-4 rounded-lg border p-5"
>
  <legend class="fieldset-legend px-2 text-sm font-semibold">{label}</legend>
  {#if value === undefined || value === null}
    <div class="py-4">
      <button
        type="button"
        class="btn btn-outline btn-success btn-block gap-2"
        onclick={addPerson}
      >
        <Plus class="size-[1.2em]" /> Add {label}
      </button>
    </div>
  {:else if Array.isArray(value)}
    <div class="space-y-4">
      {#each value as _person, i (i)}
        <div class="border-primary/20 rounded-lg border-2 p-1">
          <PersonInput bind:value={value[i]} remove={() => removePerson(i)} />
        </div>
      {/each}
    </div>

    <button
      type="button"
      class="btn btn-outline btn-success btn-block mt-4 gap-2"
      onclick={addPerson}
    >
      <Plus class="size-[1.2em]" /> Add Another Person
    </button>
  {:else}
    <PersonInput bind:value remove={removeSingle} />

    <button
      type="button"
      class="btn btn-outline btn-success btn-block mt-4 gap-2"
      onclick={addPerson}
    >
      <Plus class="size-[1.2em]" /> Add Another Person
    </button>
  {/if}
</fieldset>
