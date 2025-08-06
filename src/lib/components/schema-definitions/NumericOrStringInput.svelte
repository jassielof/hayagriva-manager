<script lang="ts">
  import type { NumericOrString } from '$lib/types/numeric-or-string';

  const {
    value,
    label,
    placeholder,
    update
  }: {
    value: NumericOrString;
    label: string;
    placeholder: string;
    update: (value: NumericOrString) => void;
  } = $props();
</script>

<input type="checkbox" checked={true} class="toggle" />
Numeric or string?

