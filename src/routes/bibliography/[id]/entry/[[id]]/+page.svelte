<!-- TODO: Form for editing bibliographic entry, live edit isn't good -->
<!-- TODO: /bibliography/[id]/entry/ is for new entries-->
<!-- TODO: /bibliography/[id]/entry/[[id]]/edit is for editing entries -->
<!-- TODO: /bibliography/[id]/entry/[[id]]/ for viewing the entry -->
<script lang="ts">
  import type { Bibliography } from '$lib/types/bibliography';
  import { onMount } from 'svelte';

  let bibliography: Bibliography | null = $state(null);
  let entryId: string = $state('');
  let isCreateMode = $state(false);
  onMount(async () => {});
</script>

<svelte:head>
  <title>{isCreateMode ? 'New Entry' : `Editing ${entryId}`}</title>
</svelte:head>

<div class="container">
  <!-- TODO: Add form -->
</div>
