<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { parseFile, exportYaml, exportJson, exportToml } from '$lib/hayagriva';

	let entries: Record<string, any> = {};
	let fileName = 'hayagriva.yml';
	let idPattern = 'TitleDateAuthorEdition';
	let selectedId: string | null = null;
	let entryTypes: string[] = [];

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
				entryTypes = examples.map((e: string) => e.toLowerCase());
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

	async function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
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

	function doExport(type: 'yaml' | 'json' | 'toml') {
		let blob;
		if (type === 'yaml') blob = exportYaml(entries);
		if (type === 'json') blob = exportJson(entries);
		if (type === 'toml') blob = exportToml(entries);
		if (!blob) return;
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName.replace(/\.\w+$/, `.${type}`);
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

	function generateIdFromPattern(): string {
		return idPattern.split(/[^a-zA-Z0-9]+/).join('');
	}

	function deleteEntry(id: string) {
		if (!confirm(`Delete entry "${id}"?`)) return;
		const { [id]: _, ...rest } = entries;
		entries = rest;
		if (selectedId === id) selectedId = null;
	}

	function updateSelectedEntry(field: string, value: any) {
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
		<button class="btn" on:click={() => doExport('json')}>JSON</button>
		<button class="btn" on:click={() => doExport('toml')}>TOML</button>
		<input class="input input-bordered w-48" bind:value={idPattern} placeholder="ID Pattern" />
		<button class="btn btn-accent" on:click={addEntry}>Add Entry</button>
	</div>
</div>

<div class="mx-auto mt-4 flex max-w-7xl gap-4">
	<!-- Entries List -->
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
		{#if selectedId && entries[selectedId]}
			<div class="card bg-base-100 sticky top-4 shadow-md">
				<div class="card-body">
					<h2 class="card-title mb-2">Entry Details</h2>
					<form class="flex flex-col gap-2">
						<label class="form-control w-full">
							<span class="label-text">Title</span>
							<input
								class="input input-bordered"
								bind:value={entries[selectedId].title}
								on:input={(e) => {
									const target = e.target as HTMLInputElement | null;
									if (target) updateSelectedEntry('title', target.value);
								}}
							/>
						</label>
						<label class="form-control w-full">
							<span class="label-text">Author</span>
							<input
								class="input input-bordered"
								bind:value={entries[selectedId].author}
								on:input={(e) => {
									const target = e.target as HTMLInputElement | null;
									if (target) updateSelectedEntry('author', target.value);
								}}
							/>
						</label>
						<label class="form-control w-full">
							<span class="label-text">Type</span>
							<select
								class="select select-bordered"
								bind:value={entries[selectedId].type}
								on:change={(e) => {
									const target = e.target as HTMLSelectElement | null;
									if (target) updateSelectedEntry('type', target.value);
								}}
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
								on:input={(e) => {
									const target = e.target as HTMLInputElement | null;
									if (target) updateSelectedEntry('date', target.value);
								}}
							/>
						</label>
						<!-- Add more fields as needed -->
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
