<script lang="ts">
  import type { HayagrivaData } from '$lib/types/hayagriva-data';

  type Entry = HayagrivaData[string];

  const { entry } = $props<{
    entry: Entry | null;
  }>();
</script>

<div class="card bg-base-100 sticky top-4 shadow-md">
  <div class="card-body">
    <h2 class="card-title mb-2">Entry Details</h2>
    {#if entry}
      <pre class="whitespace-pre-wrap break-all text-xs">{JSON.stringify(entry, null, 2)}</pre>
    {:else}
      <div class="p-4 text-center text-gray-500">
        <p>Select an entry from the list to see its details.</p>
      </div>
    {/if}
  </div>
</div>
