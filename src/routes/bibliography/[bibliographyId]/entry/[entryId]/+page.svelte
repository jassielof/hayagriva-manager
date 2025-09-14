<script lang="ts">
  import { Clipboard, Code, Eye } from '@lucide/svelte';
  import type { PageProps } from './$types';
  import PreviewEntry from '$lib/components/views/PreviewEntry.svelte';

  let { data }: PageProps = $props();
</script>

<main>
  <div class="container mx-auto pt-4">
    <div class="tabs tabs-lift">
      <label class="tab">
        <input type="radio" name="entry-preview" checked={true} />
        <Eye class="me-2 size-4" />
        Entry preview
      </label>
      <div class="tab-content bg-base-100 border-base-300 p-6">
        <PreviewEntry entry={data.entry} baseHeadingLevel={1} />
      </div>

      <label class="tab">
        <input type="radio" name="entry-preview" />
        <Code class="me-2 size-4" />
        Code preview
      </label>
      <div class="tab-content bg-base-100 border-base-300 p-6">
        <div class="relative">
          <div class="mockup-code w-full">
            {#each data.entryYamlData as line, i}
              <pre data-prefix={i + 1}><code>{line}</code></pre>
            {/each}
          </div>
          <button
            type="button"
            class="btn btn-sm btn-neutral absolute top-2 right-2"
            onclick={() =>
              navigator.clipboard.writeText(data.entryYamlData.join('\n'))}
          >
            <Clipboard class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</main>
