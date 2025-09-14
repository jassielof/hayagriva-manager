<script lang="ts">
  import { Clipboard, Code, Eye } from '@lucide/svelte';
  import type { PageProps } from './$types';

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
        <article class="prose max-w-none">
          {#if data.entry.title}
            {#if typeof data.entry.title === 'object'}
              <h1>{data.entry.title.value}</h1>
              {#if data.entry.title.short}
                <p class="lead">
                  <em>Short title: {data.entry.title.short}</em>
                </p>
              {/if}
            {:else}
              <h1>{data.entry.title}</h1>
            {/if}
          {/if}

          <div class="mb-6 flex flex-wrap items-center gap-4">
            {#if data.entry.type}
              <div class="badge badge-neutral">{data.entry.type}</div>
            {/if}
            {#if data.entry.date}
              <p class="my-0"><strong>Date:</strong> {data.entry.date}</p>
            {/if}
            {#if data.entry.language}
              <p class="my-0">
                <strong>Language:</strong>
                {data.entry.language}
              </p>
            {/if}
          </div>

          {#if data.entry.author}
            <section>
              <h3>Authors</h3>
              {#if Array.isArray(data.entry.author)}
                <ul>
                  {#each data.entry.author as person}
                    <li>
                      {#if typeof person === 'string'}
                        {person}
                      {:else if person && typeof person === 'object'}
                        {person.prefix || ''}
                        {person['given-name'] || ''}
                        {person.name}
                        {person.suffix || ''}
                        {#if person.alias}<em>({person.alias})</em>{/if}
                      {/if}
                    </li>
                  {/each}
                </ul>
              {:else if typeof data.entry.author === 'string'}
                <p>{data.entry.author}</p>
              {:else if data.entry.author && typeof data.entry.author === 'object'}
                <p>
                  {data.entry.author.prefix || ''}
                  {data.entry.author['given-name'] || ''}
                  {data.entry.author.name}
                  {data.entry.author.suffix || ''}
                  {#if data.entry.author.alias}<em
                      >({data.entry.author.alias})</em
                    >{/if}
                </p>
              {/if}
            </section>
          {/if}

          {#if data.entry.editor}
            <section>
              <h3>Editors</h3>
              {#if Array.isArray(data.entry.editor)}
                <ul>
                  {#each data.entry.editor as person}
                    <li>
                      {#if typeof person === 'string'}
                        {person}
                      {:else if person && typeof person === 'object'}
                        {person.prefix || ''}
                        {person['given-name'] || ''}
                        {person.name}
                        {person.suffix || ''}
                        {#if person.alias}<em>({person.alias})</em>{/if}
                      {/if}
                    </li>
                  {/each}
                </ul>
              {:else if typeof data.entry.editor === 'string'}
                <p>{data.entry.editor}</p>
              {:else if data.entry.editor && typeof data.entry.editor === 'object'}
                <p>
                  {data.entry.editor.prefix || ''}
                  {data.entry.editor['given-name'] || ''}
                  {data.entry.editor.name}
                  {data.entry.editor.suffix || ''}
                  {#if data.entry.editor.alias}<em
                      >({data.entry.editor.alias})</em
                    >{/if}
                </p>
              {/if}
            </section>
          {/if}

          {#if data.entry.abstract}
            <section>
              <h3>Abstract</h3>
              {#if typeof data.entry.abstract === 'object'}
                <p>{data.entry.abstract.value}</p>
              {:else}
                <p>{data.entry.abstract}</p>
              {/if}
            </section>
          {/if}

          {#if data.entry.genre || data.entry.edition || data.entry.note}
            <section>
              <h3>Details</h3>
              {#if data.entry.genre}
                <p>
                  <strong>Genre:</strong>
                  {#if typeof data.entry.genre === 'object'}
                    {data.entry.genre.value}
                  {:else}
                    {data.entry.genre}
                  {/if}
                </p>
              {/if}
              {#if data.entry.edition}
                <p><strong>Edition:</strong> {data.entry.edition}</p>
              {/if}
              {#if data.entry.note}
                <p>
                  <strong>Note:</strong>
                  {#if typeof data.entry.note === 'object'}
                    {data.entry.note.value}
                  {:else}
                    {data.entry.note}
                  {/if}
                </p>
              {/if}
            </section>
          {/if}

          {#if data.entry.publisher || data.entry.organization || data.entry.location}
            <section>
              <h3>Publication</h3>
              {#if data.entry.publisher}
                <p>
                  <strong>Publisher:</strong>
                  {#if typeof data.entry.publisher === 'object'}
                    {data.entry.publisher.name}
                    {#if data.entry.publisher.location}
                      ({data.entry.publisher.location})
                    {/if}
                  {:else}
                    {data.entry.publisher}
                  {/if}
                </p>
              {/if}
              {#if data.entry.organization}
                <p>
                  <strong>Organization:</strong>
                  {#if typeof data.entry.organization === 'object'}
                    {data.entry.organization.value}
                  {:else}
                    {data.entry.organization}
                  {/if}
                </p>
              {/if}
              {#if data.entry.location}
                <p>
                  <strong>Location:</strong>
                  {#if typeof data.entry.location === 'object'}
                    {data.entry.location.value}
                  {:else}
                    {data.entry.location}
                  {/if}
                </p>
              {/if}
            </section>
          {/if}

          {#if data.entry.volume || data.entry.issue || data.entry['page-range'] || data.entry.runtime}
            <section>
              <h3>Sizing</h3>
              {#if data.entry.volume}
                <p><strong>Volume:</strong> {data.entry.volume}</p>
              {/if}
              {#if data.entry['volume-total']}
                <p>
                  <strong>Total Volumes:</strong>
                  {data.entry['volume-total']}
                </p>
              {/if}
              {#if data.entry.issue}
                <p><strong>Issue:</strong> {data.entry.issue}</p>
              {/if}
              {#if data.entry['page-range']}
                <p><strong>Page Range:</strong> {data.entry['page-range']}</p>
              {/if}
              {#if data.entry['page-total']}
                <p><strong>Total Pages:</strong> {data.entry['page-total']}</p>
              {/if}
              {#if data.entry.runtime}
                <p><strong>Runtime:</strong> {data.entry.runtime}</p>
              {/if}
              {#if data.entry['time-range']}
                <p><strong>Time Range:</strong> {data.entry['time-range']}</p>
              {/if}
            </section>
          {/if}

          {#if data.entry.url}
            <section>
              <h3>URL</h3>
              {#if typeof data.entry.url === 'object'}
                <a
                  href={data.entry.url.value}
                  target="_blank"
                  rel="noopener noreferrer">{data.entry.url.value}</a
                >
                {#if data.entry.url.date}
                  <p><em>(Accessed on: {data.entry.url.date})</em></p>
                {/if}
              {:else}
                <a
                  href={data.entry.url}
                  target="_blank"
                  rel="noopener noreferrer">{data.entry.url}</a
                >
              {/if}
            </section>
          {/if}

          {#if data.entry['serial-number']}
            <section>
              <h3>Serial Numbers</h3>
              {#if typeof data.entry['serial-number'] === 'object'}
                <ul>
                  {#each Object.entries(data.entry['serial-number']) as [key, value]}
                    <li><strong>{key.toUpperCase()}:</strong> {value}</li>
                  {/each}
                </ul>
              {:else}
                <p>{data.entry['serial-number']}</p>
              {/if}
            </section>
          {/if}

          {#if data.entry.archive || data.entry['archive-location'] || data.entry['call-number']}
            <section>
              <h3>Archive</h3>
              {#if data.entry.archive}
                <p>
                  <strong>Name:</strong>
                  {#if typeof data.entry.archive === 'object'}
                    {data.entry.archive.value}
                  {:else}
                    {data.entry.archive}
                  {/if}
                </p>
              {/if}
              {#if data.entry['archive-location']}
                <p>
                  <strong>Location:</strong>
                  {#if typeof data.entry['archive-location'] === 'object'}
                    {data.entry['archive-location'].value}
                  {:else}
                    {data.entry['archive-location']}
                  {/if}
                </p>
              {/if}
              {#if data.entry['call-number']}
                <p>
                  <strong>Call Number:</strong>
                  {#if typeof data.entry['call-number'] === 'object'}
                    {data.entry['call-number'].value}
                  {:else}
                    {data.entry['call-number']}
                  {/if}
                </p>
              {/if}
            </section>
          {/if}

          {#if data.entry.affiliated}
            <section>
              <h3>Affiliated People</h3>
              {#each data.entry.affiliated as affiliation}
                <h4>
                  {affiliation.role.charAt(0).toUpperCase() +
                    affiliation.role.slice(1)}
                </h4>
                {#if Array.isArray(affiliation.names)}
                  <ul>
                    {#each affiliation.names as person}
                      <li>
                        {#if typeof person === 'string'}
                          {person}
                        {:else if person && typeof person === 'object'}
                          {person.prefix || ''}
                          {person['given-name'] || ''}
                          {person.name}
                          {person.suffix || ''}
                          {#if person.alias}<em>({person.alias})</em>{/if}
                        {/if}
                      </li>
                    {/each}
                  </ul>
                {:else if typeof affiliation.names === 'string'}
                  <p>{affiliation.names}</p>
                {:else if affiliation.names && typeof affiliation.names === 'object'}
                  <p>
                    {affiliation.names.prefix || ''}
                    {affiliation.names['given-name'] || ''}
                    {affiliation.names.name}
                    {affiliation.names.suffix || ''}
                    {#if affiliation.names.alias}<em
                        >({affiliation.names.alias})</em
                      >{/if}
                  </p>
                {/if}
              {/each}
            </section>
          {/if}
        </article>
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
