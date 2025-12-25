<script lang="ts">
  import type { BibliographyEntry } from '$lib/types/hayagriva';
  import { Plus, X } from '@lucide/svelte';

  let {
    value = $bindable()
  }: {
    value: BibliographyEntry['serial-number'];
  } = $props();

  const KNOWN_KEYS = [
    'serial',
    'doi',
    'isbn',
    'issn',
    'pmid',
    'pmcid',
    'arxiv'
  ] as const;

  let serial = $state('');
  let doi = $state('');
  let isbn = $state('');
  let issn = $state('');
  let pmid = $state('');
  let pmcid = $state('');
  let arxiv = $state('');
  let customSerials: { key: string; value: string }[] = $state([]);

  function toNonEmptyString(v: unknown): string {
    return typeof v === 'string' ? v : v == null ? '' : String(v);
  }

  // Populate form fields from parent value (incoming data)
  $effect(() => {
    if (typeof value === 'string' || typeof value === 'number') {
      serial = String(value ?? '');
      doi = '';
      isbn = '';
      issn = '';
      pmid = '';
      pmcid = '';
      arxiv = '';
      customSerials = [];
    } else if (value && typeof value === 'object') {
      // Use nullish coalescing to avoid "undefined" text in inputs
      serial = toNonEmptyString((value as any).serial ?? '');
      doi = toNonEmptyString((value as any).doi ?? '');
      isbn = toNonEmptyString((value as any).isbn ?? '');
      issn = toNonEmptyString((value as any).issn ?? '');
      pmid = toNonEmptyString((value as any).pmid ?? '');
      pmcid = toNonEmptyString((value as any).pmcid ?? '');
      arxiv = toNonEmptyString((value as any).arxiv ?? '');

      const nextCustom: { key: string; value: string }[] = [];
      for (const [key, val] of Object.entries(value)) {
        if (!KNOWN_KEYS.includes(key as any)) {
          nextCustom.push({ key, value: toNonEmptyString(val) });
        }
      }
      customSerials = nextCustom;
    } else {
      serial = '';
      doi = '';
      isbn = '';
      issn = '';
      pmid = '';
      pmcid = '';
      arxiv = '';
      customSerials = [];
    }
  });

  function buildOutgoing():
    | string
    | number
    | {
        [k: string]: string;
      }
    | undefined {
    const hasStandard =
      !!doi || !!isbn || !!issn || !!pmid || !!pmcid || !!arxiv;
    const validCustoms = customSerials.filter(
      ({ key, value }) => key.trim() && value.trim()
    );

    if (!serial && !hasStandard && validCustoms.length === 0) {
      return undefined;
    }

    if (serial && !hasStandard && validCustoms.length === 0) {
      // keep as string to mirror UrlInput behavior
      return serial;
    }

    const obj: Record<string, string> = {};
    if (serial) obj.serial = serial;
    if (doi) obj.doi = doi;
    if (isbn) obj.isbn = isbn;
    if (issn) obj.issn = issn;
    if (pmid) obj.pmid = pmid;
    if (pmcid) obj.pmcid = pmcid;
    if (arxiv) obj.arxiv = arxiv;

    for (const { key, value } of validCustoms) {
      obj[key] = value;
    }

    return obj;
  }

  function deepEqualSerial(a: any, b: any): boolean {
    if (a === b) return true;
    const aIsObj = a && typeof a === 'object';
    const bIsObj = b && typeof b === 'object';
    if (aIsObj !== bIsObj) return false;
    if (!aIsObj) return false; // primitives already handled above

    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) return false;
    for (let i = 0; i < aKeys.length; i++) {
      if (aKeys[i] !== bKeys[i]) return false;
      if (a[aKeys[i]] !== b[bKeys[i]]) return false;
    }
    return true;
  }

  // Reformat content for outgoing data (for the parent)
  $effect(() => {
    const next = buildOutgoing();
    if (!deepEqualSerial(value, next)) {
      value = next as any;
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
