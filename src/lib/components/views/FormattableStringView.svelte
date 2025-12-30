<script lang="ts">
  import type { FormattableString } from '$lib/types/hayagriva';

  let {
    value,
    multiline = false
  }: { multiline?: boolean; value?: FormattableString } = $props();
</script>

{#if typeof value === 'object'}
  {value.value}
{:else}
  {value}
{/if}
