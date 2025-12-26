<script lang="ts">
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import { BibliographyService } from '$lib/services/bibliography.service';
  import { hayagrivaService } from '$lib/services/hayagriva.service';
  import type { Bibliography } from '$lib/types/bibliography';
  import type { Hayagriva } from '$lib/types/hayagriva';

  let files: FileList | undefined = $state(undefined);
  let isLoading = $state(false);

  let newBibliography: Bibliography = $state({
    metadata: {
      id: '',
      title: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    data: {}
  });

  let errorMessage: string | undefined = $state();

  $effect(() => {
    if (files && files.length > 0) {
      isLoading = true;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          newBibliography.data = hayagrivaService.import(
            reader.result as string
          ) as Hayagriva;
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
      if (error.name == 'ConstraintError') {
        errorMessage = 'Bibliography with this ID already exists.';
      } else {
        errorMessage = 'Failed to save bibliography. Please try again.';
      }

      console.error('Error saving bibliography:', error);
    }
  }
</script>

<form class="mx-auto max-w-md p-6" onsubmit={handleSubmit}>
  <fieldset
    class="fieldset w-full rounded-box border border-base-300 bg-base-200 p-4"
  >
    <legend class="fieldset-legend"> Import Bibliography </legend>

    {#if errorMessage}
      <div class="alert alert-error" role="alert">
        <span>{errorMessage}</span>
      </div>
    {/if}

    <label for="hayagriva-file" class="label">
      Select a Hayagriva YAML file
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
      required
      accept=".yaml, .yml, application/yaml"
      bind:files
      disabled={isLoading}
    />

    {#if isLoading && files}
      <div class="mt-4 flex items-center gap-2">
        <span class="loading loading-md loading-spinner"></span>
        <span>Parsing {files[0].name}...</span>
      </div>
    {/if}

    {#if Object.keys(newBibliography.data).length > 0 && !errorMessage}
      <BibliographyMetadataForm
        bind:bibliographyMetadata={newBibliography.metadata}
      />
    {/if}

    <button class="btn mt-4 btn-primary">Save</button>
    <a class="btn" href="/">Cancel</a>
  </fieldset>
</form>
