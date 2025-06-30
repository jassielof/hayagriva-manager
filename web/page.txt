<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { parseFile, exportYaml } from '$lib/hayagriva'; // Removed exportJson, exportToml

  let entries = {};
  let fileName = 'hayagriva.yml';
  let idPattern = 'TitleDateAuthorEdition';
  let selectedId = null;
  let entryTypes = [];

  onMount(async () => {
    const saved = localStorage.getItem('hayagriva-yaml');
    if (saved) {
      try {
        entries = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local data:', e);
      }
    }
    // Fetch entry types from schema
    try {
      const res = await fetch(
        'https://jassielof.github.io/json-schemas/docs/hayagriva.schema.json'
      );
      const schema = await res.json();
      const examples = schema?.definitions?.entryType?.examples;
      if (Array.isArray(examples)) {
        entryTypes = examples.map((e) => e.toLowerCase());
      } else {
        throw new Error('No entryType examples found');
      }
    } catch (e) {
      console.warn('Could not fetch schema, using fallback entry types.');
      entryTypes = [
        'article',
        'book',
        'web',
        'conference',
        'report',
        'thesis',
        'misc',
        'reference',
        'periodical',
        'proceedings'
      ];
    }
  });

  async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    fileName = file.name;
    try {
      entries = await parseFile(file);
      localStorage.setItem('hayagriva-yaml', JSON.stringify(entries));
      selectedId = null;
    } catch (e) {
      alert('Invalid file');
    }
  }

  function createNew() {
    entries = {};
    fileName = 'hayagriva.yml';
    localStorage.setItem('hayagriva-yaml', JSON.stringify(entries));
    selectedId = null;
  }

  function saveToLocal() {
    localStorage.setItem('hayagriva-yaml', JSON.stringify(entries));
    alert('Saved to local storage!');
  }

  function doExport(type) {
    if (type !== 'yaml') return; // Only allow YAML export
    let blob = exportYaml(entries);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.\w+$/, `.yaml`);
    a.click();
    URL.revokeObjectURL(url);
  }

  function addEntry() {
    let id = prompt('New entry ID?', generateIdFromPattern());
    if (!id) return;
    if (entries[id]) {
      alert('ID already exists!');
      return;
    }
    entries = { ...entries, [id]: { type: '', title: '', author: '' } };
    selectedId = id;
  }

  function generateIdFromPattern() {
    return idPattern.split(/[^a-zA-Z0-9]+/).join('');
  }

  function deleteEntry(id) {
    if (!confirm(`Delete entry "${id}"?`)) return;
    const { [id]: _, ...rest } = entries;
    entries = rest;
    if (selectedId === id) selectedId = null;
  }

  function updateSelectedEntry(field, value) {
    if (!selectedId) return;
    entries = {
      ...entries,
      [selectedId]: { ...entries[selectedId], [field]: value }
    };
  }
</script>

<div
  class="navbar bg-base-100 flex flex-col gap-2 px-4 shadow-sm md:flex-row md:items-center md:justify-between"
>
  <a class="btn btn-ghost text-xl" href="/">Hayagriva Manager</a>
  <div class="flex flex-1 flex-wrap items-center gap-2">
    <input
      type="file"
      accept=".yml,.yaml,.json,.toml"
      on:change={handleFileUpload}
      class="file-input file-input-bordered"
    />
    <button class="btn btn-primary" on:click={createNew}>New</button>
    <button class="btn btn-secondary" on:click={saveToLocal}>Save</button>
    <button class="btn" on:click={() => doExport('yaml')}>YAML</button>
    <!-- Removed JSON and TOML export buttons -->
    <input class="input input-bordered w-48" bind:value={idPattern} placeholder="ID Pattern" />
    <button class="btn btn-accent" on:click={addEntry}>Add Entry</button>
  </div>
</div>

<div class="mx-auto mt-4 flex max-w-7xl gap-4">
  <div class="flex-1">
    <div class="card bg-base-100 shadow-md">
      <div class="card-body p-4">
        <h2 class="card-title mb-2">Entries</h2>
        {#if Object.keys(entries).length === 0}
          <p class="text-center text-gray-500">No entries loaded.</p>
        {:else}
          <table class="table-zebra table w-full">
            <thead>
              <tr>
                <th class="w-1/3">Title</th>
                <th class="w-1/4">Author</th>
                <th class="w-1/6">Type</th>
                <th class="w-1/6">Year</th>
                <th class="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {#each Object.entries(entries) as [id, entry]}
                <tr
                  class={selectedId === id
                    ? 'bg-primary text-primary-content'
                    : 'hover:bg-base-200 cursor-pointer'}
                  on:click={() => (selectedId = id)}
                >
                  <td class="max-w-xs truncate font-semibold">
                    {#if entry.title}
                      {entry.title}
                    {:else}
                      <span class="italic text-gray-400">No title</span>
                    {/if}
                  </td>
                  <td class="max-w-xs truncate"
                    >{Array.isArray(entry.author) ? entry.author.join('; ') : entry.author}</td
                  >
                  <td>{entry.type}</td>
                  <td
                    >{entry.date
                      ? typeof entry.date === 'string'
                        ? entry.date.slice(0, 4)
                        : entry.date
                      : ''}</td
                  >
                  <td>
                    <button
                      class="btn btn-error btn-xs"
                      on:click|stopPropagation={() => deleteEntry(id)}>✕</button
                    >
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  </div>

  <!-- Sidebar: Entry Details -->
  <div class="w-full md:w-96">
    {#if selectedId !== null && entries[selectedId]}
      <div class="card bg-base-100 sticky top-4 shadow-md">
        <div class="card-body">
          <h2 class="card-title mb-2">Entry Details</h2>
          <form class="flex flex-col gap-2">
            <label class="form-control w-full">
              <span class="label-text">Title</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].title}
                on:input={(e) => updateSelectedEntry('title', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Author</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].author}
                on:input={(e) => updateSelectedEntry('author', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Type</span>
              <select
                class="select select-bordered"
                bind:value={entries[selectedId].type}
                on:change={(e) => updateSelectedEntry('type', e.target.value)}
              >
                <option value="">Select type</option>
                {#each entryTypes as type}
                  <option value={type}>{type}</option>
                {/each}
              </select>
            </label>
            <label class="form-control w-full">
              <span class="label-text">Date</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].date}
                on:input={(e) => updateSelectedEntry('date', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Edition</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].edition}
                on:input={(e) => updateSelectedEntry('edition', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Publisher</span>
              {#if typeof entries[selectedId].publisher === 'object' && entries[selectedId].publisher !== null}
                <div class="mb-2 flex gap-2">
                  <button
                    type="button"
                    class="btn btn-xs btn-outline"
                    on:click={() => {
                      const currentId = selectedId;
                      if (currentId !== null) {
                        updateSelectedEntry('publisher', '');
                      }
                    }}>Use as string</button
                  >
                </div>
                <input
                  class="input input-bordered mb-2"
                  placeholder="Name"
                  value={entries[selectedId].publisher.name}
                  on:input={(e) => {
                    const val = e.target.value;
                    const currentId = selectedId;
                    if (currentId !== null) {
                      const currentPublisher = entries[currentId].publisher;
                      updateSelectedEntry('publisher', {
                        ...currentPublisher,
                        name: val
                      });
                    }
                  }}
                />
                <input
                  class="input input-bordered"
                  placeholder="Location (optional)"
                  value={entries[selectedId].publisher.location}
                  on:input={(e) => {
                    const val = e.target.value;
                    const currentId = selectedId;
                    if (currentId !== null) {
                      const currentPublisher = entries[currentId].publisher;
                      updateSelectedEntry('publisher', {
                        ...currentPublisher,
                        location: val
                      });
                    }
                  }}
                />
              {:else}
                <div class="mb-2 flex gap-2">
                  <button
                    type="button"
                    class="btn btn-xs btn-outline"
                    on:click={() => {
                      const currentId = selectedId;
                      if (currentId !== null) {
                        updateSelectedEntry('publisher', {
                          name: entries[currentId].publisher || ''
                        });
                      }
                    }}
                    >Use
                  </button>
                </div>
                <input
                  class="input input-bordered"
                  placeholder="Publisher"
                  value={entries[selectedId].publisher}
                  on:input={(e) => {
                    const currentId = selectedId;
                    if (currentId !== null) {
                      updateSelectedEntry('publisher', e.target.value);
                    }
                  }}
                />
              {/if}
            </label>
            <label class="form-control w-full">
              <span class="label-text">Language</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].language}
                on:input={(e) => updateSelectedEntry('language', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">URL</span>
              {#if typeof entries[selectedId].url === 'object' && entries[selectedId].url !== null}
                <div class="mb-2 flex gap-2">
                  <button
                    type="button"
                    class="btn btn-xs btn-outline"
                    on:click={() => {
                      const currentId = selectedId;
                      if (currentId !== null) {
                        updateSelectedEntry('url', '');
                      }
                    }}>Use as string</button
                  >
                </div>
                <input
                  class="input input-bordered mb-2"
                  placeholder="URL"
                  value={entries[selectedId].url.value}
                  on:input={(e) => {
                    const val = e.target.value;
                    const currentId = selectedId;
                    if (currentId !== null) {
                      const currentUrl = entries[currentId].url;
                      updateSelectedEntry('url', { ...currentUrl, value: val });
                    }
                  }}
                />
                <input
                  class="input input-bordered"
                  placeholder="Access Date (YYYY-MM-DD)"
                  value={entries[selectedId].url.date}
                  on:input={(e) => {
                    const val = e.target.value;
                    const currentId = selectedId;
                    if (currentId !== null) {
                      const currentUrl = entries[currentId].url;
                      updateSelectedEntry('url', { ...currentUrl, date: val });
                    }
                  }}
                />
              {:else}
                <div class="mb-2 flex gap-2">
                  <button
                    type="button"
                    class="btn btn-xs btn-outline"
                    on:click={() => {
                      const currentId = selectedId;
                      if (currentId !== null) {
                        updateSelectedEntry('url', {
                          value: entries[currentId].url || '',
                          date: ''
                        });
                      }
                    }}
                    >Use
                  </button>
                </div>
                <input
                  class="input input-bordered"
                  placeholder="URL"
                  value={entries[selectedId].url}
                  on:input={(e) => {
                    const currentId = selectedId;
                    if (currentId !== null) {
                      updateSelectedEntry('url', e.target.value);
                    }
                  }}
                />
              {/if}
            </label>
            <label class="form-control w-full">
              <span class="label-text">Serial Number</span>
              {#if typeof entries[selectedId]['serial-number'] === 'object' && entries[selectedId]['serial-number'] !== null}
                <div class="mb-2 flex gap-2">
                  <button
                    type="button"
                    class="btn btn-xs btn-outline"
                    on:click={() => {
                      const currentId = selectedId;
                      if (currentId !== null) {
                        updateSelectedEntry('serial-number', '');
                      }
                    }}>Use as string/number</button
                  >
                </div>
                {#each ['doi', 'isbn', 'issn', 'pmid', 'pmcid', 'arxiv', 'serial'] as key}
                  <input
                    class="input input-bordered mb-1"
                    placeholder={key.toUpperCase()}
                    value={entries[selectedId]['serial-number'][key]}
                    on:input={(e) => {
                      const val = e.target.value;
                      const currentId = selectedId;
                      if (currentId !== null) {
                        const currentSerialNumber = entries[currentId]['serial-number'];
                        updateSelectedEntry('serial-number', {
                          ...currentSerialNumber,
                          [key]: val
                        });
                      }
                    }}
                  />
                {/each}
              {:else}
                <div class="mb-2 flex gap-2">
                  <button
                    type="button"
                    class="btn btn-xs btn-outline"
                    on:click={() => {
                      const currentId = selectedId;
                      if (currentId !== null) {
                        updateSelectedEntry('serial-number', {
                          doi: '',
                          isbn: '',
                          issn: '',
                          pmid: '',
                          pmcid: '',
                          arxiv: '',
                          serial: ''
                        });
                      }
                    }}
                    >Use
                  </button>
                </div>
                <input
                  class="input input-bordered"
                  placeholder="Serial Number"
                  value={entries[selectedId]['serial-number']}
                  on:input={(e) => {
                    const currentId = selectedId;
                    if (currentId !== null) {
                      updateSelectedEntry('serial-number', e.target.value);
                    }
                  }}
                />
              {/if}
            </label>
            <label class="form-control w-full">
              <span class="label-text">Volume</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].volume}
                on:input={(e) => updateSelectedEntry('volume', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Issue</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].issue}
                on:input={(e) => updateSelectedEntry('issue', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Page Range</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId]['page-range']}
                on:input={(e) => updateSelectedEntry('page-range', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Page Total</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId]['page-total']}
                on:input={(e) => updateSelectedEntry('page-total', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Abstract</span>
              <textarea
                class="textarea textarea-bordered"
                bind:value={entries[selectedId].abstract}
                on:input={(e) => updateSelectedEntry('abstract', e.target.value)}
              ></textarea>
            </label>
            <label class="form-control w-full">
              <span class="label-text">Genre</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].genre}
                on:input={(e) => updateSelectedEntry('genre', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Organization</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].organization}
                on:input={(e) => updateSelectedEntry('organization', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Location</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].location}
                on:input={(e) => updateSelectedEntry('location', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Archive</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].archive}
                on:input={(e) => updateSelectedEntry('archive', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Archive Location</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId]['archive-location']}
                on:input={(e) => updateSelectedEntry('archive-location', e.target.value)}
              />
            </label>
            <label class="form-control w-full">
              <span class="label-text">Note</span>
              <input
                class="input input-bordered"
                bind:value={entries[selectedId].note}
                on:input={(e) => updateSelectedEntry('note', e.target.value)}
              />
            </label>
            {#if entries[selectedId].parent}
              <div class="collapse-arrow bg-base-200 collapse">
                <input type="checkbox" />
                <div class="collapse-title font-medium">Parent Entry</div>
                <div class="collapse-content">
                  {#if Array.isArray(entries[selectedId].parent)}
                    {#each entries[selectedId].parent as parentEntry, idx}
                      <div class="border-base-300 mb-2 border-b pb-2">
                        <span class="font-semibold">Parent #{idx + 1}</span>
                        {#each Object.entries(parentEntry) as [pkey, pval]}
                          <div class="mb-1">
                            <span class="font-semibold">{pkey}:</span>
                            <span class="ml-2"
                              >{typeof pval === 'object' ? JSON.stringify(pval) : pval}</span
                            >
                          </div>
                        {/each}
                      </div>
                    {/each}
                  {:else}
                    {#each Object.entries(entries[selectedId].parent) as [pkey, pval]}
                      <div class="mb-1">
                        <span class="font-semibold">{pkey}:</span>
                        <span class="ml-2"
                          >{typeof pval === 'object' ? JSON.stringify(pval) : pval}</span
                        >
                      </div>
                    {/each}
                  {/if}
                </div>
              </div>
            {/if}
          </form>
        </div>
      </div>
    {:else}
      <div class="card bg-base-100 p-4 text-center text-gray-500 shadow-md">
        <p>Select an entry to view details.</p>
      </div>
    {/if}
  </div>
</div>
