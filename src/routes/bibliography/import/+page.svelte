<script lang="ts">
  import { goto } from '$app/navigation';
  import BibliographyMetadataForm from '$lib/components/BibliographyMetadataForm.svelte';
  import { db } from '$lib/db';
  import { parseYaml } from '$lib/hayagriva';
  import type { Hayagriva } from '$lib/types/hayagriva';
  import { CircleX } from '@lucide/svelte';

  let fileInput: HTMLInputElement | null = null;
  let file: File | null = $state(null);
  let isLoading = $state(false);
  let error: string | null = $state(null);

  let parsedData: Hayagriva | null = $state(null);

  let id = $state('');
  let title = $state('');
  let description = $state('');
  let errorMessage = $state('');

  $effect(() => {
    if (file) {
      isLoading = true;
      error = null;

      const autoTitle = file.name
        .replace(/\.(yml|yaml)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      id = file.name;
      title = autoTitle;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          parsedData = parseYaml(content);
        } catch (e: any) {
          error = 'Failed to parse YAML';
          file = null;
          if (fileInput) (fileInput as HTMLInputElement).value = '';
        } finally {
          isLoading = false;
        }
      };
      reader.onerror = () => {
        error = 'Failed to read the file.';
        isLoading = false;
      };
      reader.readAsText(file);
    }
  });

  async function handleSubmit() {
    let safeData;
    try {
      safeData = JSON.parse(JSON.stringify(parsedData));
    } catch (error) {
      console.error('Error serializing parsed data:', error);
      return;
    }

    await db
      .saveBibliography({
        metadata: {
          id: id.trim(),
          title: title.trim(),
          description: description.trim() || '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        data: safeData
      })
      .then(() => {
        goto('/');
      })
      .catch((error) => {
        if (error.name == 'ConstraintError') {
          errorMessage = 'Bibliography with this ID already exists.';
          return;
        } else {
          errorMessage = 'Failed to save bibliography. Please try again.';
        }

        console.error('Error saving bibliography:', error);
      });
  }

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) {
      file = selectedFile;
    }
  }
</script>

<form class="mx-auto w-full max-w-md p-6" onsubmit={handleSubmit}>
  <fieldset
    class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4"
  >
    <legend class="fieldset-legend"> Import Bibliography </legend>

    {#if errorMessage}
      <div class="alert alert-error" role="alert">
        <span>{errorMessage}</span>
      </div>
    {/if}

    <label for="hayagriva-file" class="label"
      >Select a Hayagriva YAML file</label
    >
    <input
      type="file"
      class="file-input w-full"
      id="file-input"
      accept=".yml,.yaml"
      bind:this={fileInput}
      onchange={handleFileSelect}
      disabled={isLoading}
    />

    {#if isLoading}
      <div class="mt-4 flex items-center gap-2">
        <span class="loading loading-spinner loading-sm"></span>
        <span>Parsing {file?.name}...</span>
      </div>
    {/if}

    {#if error}
      <div role="alert" class="alert alert-error mt-4">
        <CircleX class="h-6 w-6 shrink-0 stroke-current" />
        <span>{error}</span>
      </div>
    {/if}

    {#if parsedData && !error}
      <BibliographyMetadataForm bind:id bind:title bind:description />
    {/if}

    <button class="btn btn-primary mt-4">Save</button>
    <button
      class="btn"
      type="button"
      onclick={() => {
        goto('/');
      }}>Cancel</button
    >
  </fieldset>
</form>
