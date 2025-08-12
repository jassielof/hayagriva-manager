<!-- TODO: View entry in both rendered and code -->
<script lang="ts">
  import type { PageProps } from './$types';

  let { data, params }: PageProps = $props();
</script>

<main>
  <section class="container mx-auto pt-4">
    <div class="tabs tabs-lift">
      <label class="tab">
        <input type="radio" name="entry-preview" />
        Entry preview
      </label>
      <div class="tab-content bg-base-100 border-base-300 p-6">
        Tab content 1
      </div>

      <label class="tab">
        <input type="radio" name="entry-preview" checked={true} />
        Code preview
      </label>
      <div class="tab-content bg-base-100 border-base-300 p-6">
        <div class="mockup-code w-full">
          <pre><code>without prefix</code></pre>
        </div>
      </div>
    </div>
  </section>
</main>
