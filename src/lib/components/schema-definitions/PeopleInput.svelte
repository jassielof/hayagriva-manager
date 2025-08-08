<script lang="ts">
  import type { Author } from '$lib/types/hayagriva';
  import PersonInput from './PersonInput.svelte';
  import { X, Plus } from '@lucide/svelte';

  let {
    value = $bindable(),
    label
  }: { value: Author | undefined; label: string } = $props();

  let authorType: 'none' | 'single' | 'list' = $state('none');

  $effect(() => {
    if (value === undefined || value === null) {
      authorType = 'none';
    } else if (Array.isArray(value)) {
      authorType = 'list';
    } else {
      authorType = 'single';
    }
  });

  function handleTypeChange(e: Event) {
    const newType = (e.target as HTMLSelectElement).value;
    switch (newType) {
      case 'none':
        value = undefined;
        break;
      case 'single':
        value = Array.isArray(value) && value.length > 0 ? value[0] : '';
        break;
      case 'list':
        value = value && !Array.isArray(value) ? [value] : [];
        break;
    }
  }

  function addAuthor() {
    if (Array.isArray(value)) {
      value = [...value, ''];
    }
  }

  function removeAuthor(index: number) {
    if (Array.isArray(value)) {
      value = value.filter((_, i) => i !== index);
    }
  }
</script>

<label for="author-type" class="label">{label}</label>
<select
  id="author-type"
  class="select w-full"
  value={authorType}
  onchange={handleTypeChange}
>
  <option value="none">None</option>
  <option value="single">Single</option>
  <option value="list">List</option>
</select>

{#if authorType === 'single' && value !== undefined && !Array.isArray(value)}
  <PersonInput bind:value />
{/if}

{#if authorType === 'list' && Array.isArray(value)}
  <div class="mt-2 space-y-2">
    {#each value as _person, i (i)}
      <div class="flex gap-2">
        <div class="indicator w-full">
          <span class="indicator-item">
            <button
              type="button"
              class="btn btn-error btn-xs btn-circle mt-9 mr-0.25"
              onclick={() => removeAuthor(i)}
            >
              <X class="h-4 w-4" />
            </button>
          </span>
          <div class="w-full">
            <PersonInput bind:value={value[i]} />
          </div>
        </div>
      </div>
    {/each}

    <button
      type="button"
      class="btn btn-outline btn-success w-full"
      onclick={addAuthor}
    >
      <Plus class="h-4 w-4" /> Add Person
    </button>
  </div>
{/if}
