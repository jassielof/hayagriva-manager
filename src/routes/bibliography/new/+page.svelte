<script lang="ts">
  import { goto } from '$app/navigation';
  import { BibliographyService } from '$lib/services/bibliography.service';
  import { hayagrivaService } from '$lib/services/hayagriva.service';
  import type { Bibliography } from '$lib/types/bibliography';
  import type { Hayagriva } from '$lib/types/hayagriva';

  let newBibliography: Bibliography = $state({
    data: {},
    metadata: {
      id: '',
      title: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  let files: FileList | undefined = $state(undefined);
  let isLoading = $state(false);
  let errorMessage = $state('');

  $effect(() => {
    if (files && files.length > 0) {
      isLoading = true;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          newBibliography.data = hayagrivaService.import(
            reader.result as string
          ) as Hayagriva;
          errorMessage = '';
        } catch (error) {
          errorMessage = 'Failed to parse YAML';
          files = undefined;
          console.error('Error parsing YAML:', error);
        } finally {
          isLoading = false;
        }
      };
      reader.onerror = () => {
        errorMessage = 'Failed to read the file.';
        files = undefined;
        isLoading = false;
      };
      reader.readAsText(files[0]);
    }
  });

  async function handleSubmit() {
    try {
      await BibliographyService.add(newBibliography);
      goto('/');
    } catch (error: any) {
      if (error.name === 'ConstraintError') {
        errorMessage = 'Bibliography with this ID already exists.';
      } else {
        errorMessage = 'Failed to save bibliography. Please try again.';
      }
      console.error('Error saving bibliography:', error);
    }
  }
</script>

<div class="grid min-h-full place-items-center px-4 py-8">
  <div class="w-full max-w-md">
    <form class="w-full" onsubmit={handleSubmit}>
      <fieldset
        class="fieldset w-full rounded-box border border-base-300 bg-base-200 p-4"
      >
        <legend class="fieldset-legend text-2xl">New Bibliography</legend>

        <label for="hayagriva-file" class="label">
          <span class="label-text">Import from a Hayagriva YAML file</span>
        </label>

        <input
          type="file"
          class="file-input w-full"
          onchange={() => {
            if (!files || files.length === 0) return;

            newBibliography.metadata.id = files[0].name.replace(
              /\.(yml|yaml)$/i,
              ''
            ) as string;
            newBibliography.metadata.title = newBibliography.metadata.id
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());
          }}
          id="hayagriva-file"
          accept="application/yaml"
          bind:files
          disabled={isLoading}
        />

        {#if isLoading && files}
          <div class="mt-4 flex items-center gap-2">
            <span class="loading loading-md loading-spinner"></span>
            <span>Parsing {files[0].name}...</span>
          </div>
        {/if}

        <div class="divider"></div>

        <label for="bibliography-id" class="label">ID</label>
        <input
          id="bibliography-id"
          type="text"
          title="Enter a unique ID for the bibliography"
          placeholder="my-research-papers"
          class="validator input w-full font-mono"
          bind:value={newBibliography.metadata.id}
          onblur={() => {
            newBibliography.metadata.id = newBibliography.metadata.id.trim();
            if (newBibliography.metadata.id === 'new') {
              alert(
                `"${newBibliography.metadata.id}" is a reserved ID. Please choose another one.`
              );
              return;
            }
          }}
          required
        />
        <p class="validator-hint hidden">Invalid ID</p>

        <label for="bibliography-title" class="label">Title</label>
        <input
          id="bibliography-title"
          type="text"
          placeholder="My Research Papers"
          title="Enter a title for the bibliography"
          class="validator input w-full"
          bind:value={newBibliography.metadata.title}
          onblur={() =>
            (newBibliography.metadata.title =
              newBibliography.metadata.title.trim())}
          required
        />

        <label for="bibliography-description" class="label">
          Description
        </label>
        <textarea
          id="bibliography-description"
          class="textarea w-full"
          placeholder="Research papers on various topics"
          bind:value={newBibliography.metadata.description}
          onblur={() =>
            (newBibliography.metadata.description =
              newBibliography.metadata.description?.trim())}
        ></textarea>

        <div class="divider"></div>

        <button class="btn btn-primary">Save</button>
        <a class="btn btn-error" href="/">Cancel</a>
      </fieldset>
    </form>
  </div>
</div>
