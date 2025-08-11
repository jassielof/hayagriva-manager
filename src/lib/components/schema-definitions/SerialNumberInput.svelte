<script lang="ts">
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
    let customSerials = $state<{ key: string; value: string }[]>([]);

    // Populate form fields from parent value
    $effect(() => {
        const reset = () => {
            serial = '';
            doi = '';
            isbn = '';
            issn = '';
            pmid = '';
            pmcid = '';
            arxiv = '';
            customSerials = [];
        };

        if (typeof value === 'string' || typeof value === 'number') {
            reset();
            serial = String(value);
        } else if (value && typeof value === 'object') {
            const {
                serial: s,
                doi: d,
                isbn: i,
                issn: is_,
                pmid: p,
                pmcid: pc,
                arxiv: a,
                ...rest
            } = value;
            serial = s || '';
            doi = d || '';
            isbn = i || '';
            issn = is_ || '';
            pmid = p || '';
            pmcid = pc || '';
            arxiv = a || '';
            customSerials = Object.entries(rest).map(([key, value]) => ({
                key,
                value: String(value)
            }));
        } else {
            reset();
        }
    });

    // Update parent value from form fields
    $effect(() => {
        const hasOnlySerial =
            serial && !doi && !isbn && !issn && !pmid && !pmcid && !arxiv && customSerials.length === 0;

        if (hasOnlySerial) {
            value = serial;
            return;
        }

        const serialObject: { [key: string]: string } = {};
        if (serial) serialObject.serial = serial;
        if (doi) serialObject.doi = doi;
        if (isbn) serialObject.isbn = isbn;
        if (issn) serialObject.issn = issn;
        if (pmid) serialObject.pmid = pmid;
        if (pmcid) serialObject.pmcid = pmcid;
        if (arxiv) serialObject.arxiv = arxiv;
        for (const { key, value: v } of customSerials) {
            if (key && v) {
                serialObject[key] = v;
            }
        }

        if (Object.keys(serialObject).length > 0) {
            value = serialObject;
        } else {
            value = undefined;
        }
    });

    function addCustomSerial() {
        customSerials = [...customSerials, { key: '', value: '' }];
    }

    function removeCustomSerial(index: number) {
        customSerials = customSerials.filter((_, i) => i !== index);
    }
</script>

<fieldset class="fieldset bg-base-100/50 border-base-300 rounded-box border p-4">
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

    <div class="divider">Custom Serials</div>

    <div class="space-y-2">
        {#each customSerials as _, i (i)}
            <div class="flex items-end gap-2">
                <div class="flex-1">
                    <label for="custom-serial-key-{i}" class="label pb-1">Key</label>
                    <input
                        id="custom-serial-key-{i}"
                        type="text"
                        placeholder="e.g. zbl"
                        class="input input-sm w-full"
                        bind:value={customSerials[i].key}
                    />
                </div>
                <div class="flex-1">
                    <label for="custom-serial-value-{i}" class="label pb-1">Value</label>
                    <input
                        id="custom-serial-value-{i}"
                        type="text"
                        placeholder="e.g. 0634.60011"
                        class="input input-sm w-full"
                        bind:value={customSerials[i].value}
                    />
                </div>
                <button
                    type="button"
                    class="btn btn-error btn-sm btn-square"
                    onclick={() => removeCustomSerial(i)}
                >
                    <X class="h-4 w-4" />
                </button>
            </div>
        {/each}
    </div>

    <button type="button" class="btn btn-outline btn-sm mt-4 w-full" onclick={addCustomSerial}>
        <Plus class="h-4 w-4" /> Add Custom Serial
    </button>
</fieldset>
