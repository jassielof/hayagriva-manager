<script lang="ts">
  import { Clipboard, Code, Eye } from '@lucide/svelte';
  import type { PageProps } from './$types';
  import PreviewEntry from '$lib/components/views/PreviewEntry.svelte';

  // 1. Import Core & Language
  import hljs from 'highlight.js/lib/core';
  import yaml from 'highlight.js/lib/languages/yaml';

  // 2. Import a theme (Choose one that matches your UI)
  // 'github-dark' fits well with standard dark mode terminals
  import 'highlight.js/styles/tomorrow-night-blue.css';

  // 3. Register YAML
  hljs.registerLanguage('yaml', yaml);

  let { data }: PageProps = $props();

  // 4. Helper to highlight single lines
  function highlight(line: string) {
    // .value contains the safe HTML string
    return hljs.highlight(line, { language: 'yaml' }).value;
  }
</script>

<main>
  <div class="container mx-auto pt-4">
    <div class="tabs-lift tabs">
      <label class="tab">
        <input type="radio" name="entry-preview" checked={true} />
        <Eye class="me-2 size-4" />
        Entry preview
      </label>
      <div class="tab-content border-base-300 bg-base-100 p-6">
        <PreviewEntry entry={data.entry} baseHeadingLevel={1} />
      </div>

      <label class="tab">
        <input type="radio" name="entry-preview" />
        <Code class="me-2 size-4" />
        Code preview
      </label>
      <div class="tab-content border-base-300 bg-base-100 p-6">
        <div class="relative">
          <div class="mockup-code w-full">
            {#each data.entryYamlData as line, i}
              <!-- 5. Render with {@html} -->
              <pre data-prefix={i + 1}><code>{@html highlight(line)}</code
                ></pre>
            {/each}
          </div>
          <button
            type="button"
            class="btn absolute top-2 right-2 btn-sm btn-neutral"
            onclick={() =>
              navigator.clipboard.writeText(data.entryYamlData.join('\n'))}
          >
            <Clipboard class="size-4" />
          </button>
        </div>
      </div>
      <!-- TODO: Add a hayagriva rendered preview, powered by the Hayagriva WASM compiled module -->
    </div>
  </div>
</main>
