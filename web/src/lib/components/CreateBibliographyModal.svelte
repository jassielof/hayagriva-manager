<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';

  export let bibliography: BibliographyMetadata | null = null;
  const dispatch = createEventDispatcher();

  let title = '';
  let description = '';

  onMount(() => {
    if (bibliography) {
      title = bibliography.title;
      description = bibliography.description || '';
    }
  });

  function save() {
    if (!title) {
      alert('Title is required');
      return;
    }
    const metadata: Partial<BibliographyMetadata> = { ...bibliography, title, description };
    dispatch('save', metadata);
  }
</script>

<div class="modal modal-open">
  <div class="modal-box">
    <h3 class="text-lg font-bold">{bibliography ? 'Edit' : 'Create'} Bibliography</h3>
    <div class="py-4">
      <label class="form-control w-full">
        <div class="label"><span class="label-text">Title</span></div>
        <input
          type="text"
          placeholder="e.g., 'My Research Papers'"
          class="input input-bordered w-full"
          bind:value={title}
        />
      </label>
      <label class="form-control mt-4 w-full">
        <div class="label"><span class="label-text">Description</span></div>
        <textarea
          class="textarea textarea-bordered"
          placeholder="A short description"
          bind:value={description}
        ></textarea>
      </label>
    </div>
    <div class="modal-action">
      <button class="btn" on:click={() => dispatch('close')}>Cancel</button>
      <button class="btn btn-primary" on:click={save}>Save</button>
    </div>
  </div>
</div>
