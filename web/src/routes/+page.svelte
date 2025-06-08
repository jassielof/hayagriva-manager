<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { parseFile, exportYaml, exportJson, exportToml } from '$lib/hayagriva';

	let entries: Record<string, any> = {};
	let fileName = 'hayagriva.yml';
	let idPattern = 'TitleDateAuthorEdition';

	onMount(() => {
		const saved = localStorage.getItem('hayagriva-yaml');
		if (saved) {
			try {
				entries = JSON.parse(saved);
			} catch (e) {
				console.error('Failed to parse local data:', e);
			}
		}
	});

	async function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		fileName = file.name;
		try {
			entries = await parseFile(file);
			localStorage.setItem('hayagriva-yaml', JSON.stringify(entries));
		} catch (e) {
			alert('Invalid file');
		}
	}

	function createNew() {
		entries = {};
		fileName = 'hayagriva.yml';
		localStorage.setItem('hayagriva-yaml', JSON.stringify(entries));
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
	}

	function generateIdFromPattern(): string {
		// Very basic: just join the pattern fields with underscores
		return idPattern.split(/[^a-zA-Z0-9]+/).join('');
	}

	function deleteEntry(id: string) {
		if (!confirm(`Delete entry "${id}"?`)) return;
		const { [id]: _, ...rest } = entries;
		entries = rest;
	}
</script>

<div class="navbar bg-base-100 shadow-sm">
	<a class="btn btn-ghost text-xl" href="/">Hayagriva Manager</a>
</div>

<h1>Hayagriva YAML Manager</h1>

<div class="mb-4 flex flex-wrap gap-2">
	<input
		type="file"
		accept=".yml,.yaml,.json,.toml"
		on:change={handleFileUpload}
		class="file-input"
	/>
	<button class="btn" on:click={createNew}>Create New</button>
	<button class="btn" on:click={saveToLocal}>Save to Local Storage</button>
	<button class="btn" on:click={() => doExport('yaml')}>Export YAML</button>
	<button class="btn" on:click={() => doExport('json')}>Export JSON</button>
	<button class="btn" on:click={() => doExport('toml')}>Export TOML</button>
	<input
		class="input input-bordered"
		bind:value={idPattern}
		placeholder="ID Pattern (e.g. TitleDateAuthorEdition)"
	/>
	<button class="btn" on:click={addEntry}>Add Entry</button>
</div>

{#if Object.keys(entries).length === 0}
	<p>No entries loaded.</p>
{:else}
	<table class="table w-full">
		<thead>
			<tr>
				<th>ID</th>
				<th>Type</th>
				<th>Title</th>
				<th>Author</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each Object.entries(entries) as [id, entry]}
				<tr>
					<td>{id}</td>
					<td>
						<input bind:value={entry.type} on:change={() => (entries = { ...entries })} />
					</td>
					<td>
						<input bind:value={entry.title} on:change={() => (entries = { ...entries })} />
					</td>
					<td>
						<input bind:value={entry.author} on:change={() => (entries = { ...entries })} />
					</td>
					<td>
						<button class="btn btn-error btn-xs" on:click={() => deleteEntry(id)}>Delete</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
