<script lang="ts">
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';

  let { edit, del, metadata } = $props<{
    metadata: BibliographyMetadata;
    edit: (id: string) => void;
    del: (id: string) => void;
  }>();
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
      <button class="btn btn-sm btn-outline" onclick={() => edit(metadata.id)}>Edit</button>
      <button class="btn btn-sm btn-outline btn-error" onclick={() => del(metadata.id)}
        >Delete</button
      >
    </div>
  </div>
</div>
