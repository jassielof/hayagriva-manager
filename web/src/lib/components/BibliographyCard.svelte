<script lang="ts">
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';
  import { createEventDispatcher } from 'svelte';

  export let metadata: BibliographyMetadata;
  const dispatch = createEventDispatcher();

  function edit() {
    dispatch('edit', metadata.id);
  }

  function del() {
    dispatch('delete', metadata.id);
  }
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">{metadata.title}</h2>
    <p>{metadata.description || 'No description'}</p>
    <div class="text-xs text-gray-500">
      Last updated: {new Date(metadata.updatedAt).toLocaleString()}
    </div>
    <div class="card-actions justify-end">
      <a href="/bibliographies/{metadata.id}" class="btn btn-sm btn-outline btn-primary">Open</a>
      <button class="btn btn-sm btn-outline" on:click={edit}>Edit</button>
      <button class="btn btn-sm btn-outline btn-error" on:click={del}>Delete</button>
    </div>
  </div>
</div>
