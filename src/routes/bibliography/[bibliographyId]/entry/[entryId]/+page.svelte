<script lang="ts">
  import { Code, Eye } from '@lucide/svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<main>
  <section class="container mx-auto pt-4">
    <div class="tabs tabs-lift">
      <label class="tab">
        <input type="radio" name="entry-preview" checked={true} />
        <Eye class="me-2 size-4" />
        Entry preview
      </label>
      <div class="tab-content bg-base-100 border-base-300 p-6">
        <!-- TODO: Normal content rendered -->
        <h1 class="text-xl font-bold">{data.entry.title}</h1>
        <p class="italic">{data.entry.abstract}</p>
        <span class="badge badge-info">{data.entry.language}</span>
      </div>

      <label class="tab">
        <input type="radio" name="entry-preview" />
        <Code class="me-2 size-4" />
        Code preview
      </label>
      <div class="tab-content bg-base-100 border-base-300 p-6">
        <div class="mockup-code w-full">
          {#each data.entryYamlData as line, i}
            <pre data-prefix={i + 1}><code>{line}</code></pre>
          {/each}
        </div>
      </div>
    </div>
  </section>
</main>
