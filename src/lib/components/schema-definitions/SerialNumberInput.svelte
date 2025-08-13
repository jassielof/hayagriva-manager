<script lang="ts">
  // FIXME: LOOP error
  import type { BibliographyEntry, SerialNumber } from '$lib/types/hayagriva';
  import { Plus, X } from '@lucide/svelte';

  let {
    value = $bindable()
  }: {
    value: BibliographyEntry['serial-number'];
  } = $props();

  let serial = $state('');
  let doi = $state('');
  let isbn = $state('');
  let issn = $state('');
  let pmid = $state('');
  let pmcid = $state('');
  let arxiv = $state('');
  let customSerials: { key: string; value: string }[] = $state([]);

  // Populate form fields from parent value (incoming data)
  $effect(() => {
    $inspect('value: ', value);
    $inspect('type of value: ', typeof value);
    if (typeof value === 'string') {
      serial = String(value);
    } else if (value && typeof value === 'object') {
      serial = String(value.serial);
      doi = String(value.doi);
      isbn = String(value.isbn);
      issn = String(value.issn);
      pmid = String(value.pmid);
      pmcid = String(value.pmcid);
      arxiv = String(value.arxiv);

      customSerials = [];
      for (const [key, val] of Object.entries(value)) {
        if (
          !['serial', 'doi', 'isbn', 'issn', 'pmid', 'pmcid', 'arxiv'].includes(
            key
          )
        ) {
          customSerials.push({ key, value: String(val) });
        }
      }
    }
  });

  // reformat content for outgoing data (for the parent)
  $effect(() => {
    const hasStandardFields = doi || isbn || issn || pmid || pmcid || arxiv;
    const hasCustomSerials = customSerials.length > 0;

    if (!serial && !hasStandardFields && !hasCustomSerials) {
      value = undefined;
    } else if (serial && !hasStandardFields && !hasCustomSerials) {
      value = serial;
    } else {
      // Filter out empty custom serials
      const validCustomSerials = customSerials.filter(
        ({ key, value }) => key.trim() && value.trim()
      );

      const newValue: any = {};

      if (serial) newValue.serial = serial;
      if (doi) newValue.doi = doi;
      if (isbn) newValue.isbn = isbn;
      if (issn) newValue.issn = issn;
      if (pmid) newValue.pmid = pmid;
      if (pmcid) newValue.pmcid = pmcid;
      if (arxiv) newValue.arxiv = arxiv;

      // Add valid custom serials
      for (const { key, value: customValue } of validCustomSerials) {
        newValue[key] = customValue;
      }

      value = newValue;
    }
  });
</script>

<fieldset
  class="fieldset bg-base-100/50 border-base-300 rounded-box border p-4"
>
  <legend class="fieldset-legend">Serial Number</legend>

  <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
    <div>
      <label for="serial-number-serial" class="label pb-1">Serial</label>
      <input
        id="serial-number-serial"
        type="text"
        placeholder="SN12345"
        class="input input-sm w-full"
        bind:value={serial}
      />
    </div>
    <div>
      <label for="serial-number-doi" class="label pb-1">DOI</label>
      <input
        id="serial-number-doi"
        type="text"
        placeholder="10.1103/PhysRevB.102.165126"
        class="input input-sm w-full"
        bind:value={doi}
      />
    </div>
    <div>
      <label for="serial-number-isbn" class="label pb-1">ISBN</label>
      <input
        id="serial-number-isbn"
        type="text"
        placeholder="978-3-16-148410-0"
        class="input input-sm w-full"
        bind:value={isbn}
      />
    </div>
    <div>
      <label for="serial-number-issn" class="label pb-1">ISSN</label>
      <input
        id="serial-number-issn"
        type="text"
        placeholder="2049-3630"
        class="input input-sm w-full"
        bind:value={issn}
      />
    </div>
    <div>
      <label for="serial-number-pmid" class="label pb-1">PMID</label>
      <input
        id="serial-number-pmid"
        type="text"
        placeholder="17284678"
        class="input input-sm w-full"
        bind:value={pmid}
      />
    </div>
    <div>
      <label for="serial-number-pmcid" class="label pb-1">PMCID</label>
      <input
        id="serial-number-pmcid"
        type="text"
        placeholder="PMC1790863"
        class="input input-sm w-full"
        bind:value={pmcid}
      />
    </div>
    <div class="md:col-span-2">
      <label for="serial-number-arxiv" class="label pb-1">ArXiv</label>
      <input
        id="serial-number-arxiv"
        type="text"
        placeholder="2003.13722"
        class="input input-sm w-full"
        bind:value={arxiv}
      />
    </div>
  </div>

  <div class="divider">Custom serials</div>

  {#each customSerials as _, i (i)}
    <div class="flex items-end gap-2">
      <div class="flex-1">
        <label for="custom-serial-key-{i}" class="label pb-1">Key</label>
        <input
          id="custom-serial-key-{i}"
          type="text"
          placeholder="zbl"
          class="input input-sm w-full"
          bind:value={customSerials[i].key}
        />
      </div>
      <div class="flex-1">
        <label for="custom-serial-value-{i}" class="label pb-1">Value</label>
        <input
          id="custom-serial-value-{i}"
          type="text"
          placeholder="0634.60011"
          class="input input-sm w-full"
          bind:value={customSerials[i].value}
        />
      </div>
      <button
        type="button"
        class="btn btn-error btn-sm btn-square"
        onclick={() => {
          customSerials.splice(i, 1);
        }}
      >
        <X class="size-4" />
      </button>
    </div>
  {/each}

  <button
    type="button"
    class="btn btn-outline btn-sm w-full"
    onclick={() => {
      customSerials.push({ key: '', value: '' });
    }}
  >
    <Plus class="size-4" /> Add custom serial
  </button>
</fieldset>
