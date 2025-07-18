<script lang="ts">
  import { parseYaml } from '$lib/hayagriva';
  import type { Bibliography } from '$lib/types/bibliography';
  import type { Hayagriva } from '$lib/types/hayagriva';
  import { Check, CircleX } from '@lucide/svelte';
  import BibliographyMetadataForm from './BibliographyMetadataForm.svelte';

  const {
    show,
    onClose,
    onSave
  }: {
    show: boolean;
    onClose: () => void;
    onSave: (data: Bibliography) => void;
  } = $props();

  let dialog: HTMLDialogElement;
  let fileInput: HTMLInputElement | null = null;
  let metadataForm = $state<BibliographyMetadataForm>();
  let file = $state<File | null>(null);
  let fileName = $state('');
  let title = $state('');
  let description = $state('');
  let parsedData = $state<Hayagriva | null>(null);
  let error = $state<string | null>(null);
  let isLoading = $state(false);

  $effect(() => {
    if (dialog) {
      if (show) {
        dialog.showModal();
      } else {
        // Reset all state when closing
        file = null;
        parsedData = null;
        error = null;
        title = '';
        description = '';
        fileName = '';
        if (fileInput) (fileInput as HTMLInputElement).value = '';
        dialog.close();
      }
    }
  });

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) {
      file = selectedFile;
    }
  }

  $effect(() => {
    if (file) {
      isLoading = true;
      error = null;
      parsedData = null;
      fileName = file.name;

      // Auto-generate title from filename
      const autoTitle = file.name
        .replace(/\.(yml|yaml)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      title = autoTitle;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          parsedData = parseYaml(content);
        } catch (e: any) {
          error = `Failed to parse YAML: ${e.message}`;
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

  function handleSave() {
    if (!metadataForm?.isValid() || !parsedData) {
      error = 'Title is required and file must be parsed successfully.';
      return;
    }

    const metadata = metadataForm.getFormData();
    const payload: Bibliography = {
      metadata: {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        title: metadata.title!,
        description: metadata.description || ''
      },
      data: parsedData
    };

    console.log(
      'ImportBibliographyModal: handleSave called with payload:',
      payload
    );
    console.log('Parsed data keys:', Object.keys(parsedData));
    console.log(
      'Parsed data sample:',
      JSON.stringify(parsedData, null, 2).substring(0, 500)
    );

    onSave(payload);
  }
</script>

<dialog bind:this={dialog} onclose={onClose} class="modal">
  <div class="modal-box">
    <fieldset
      class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4"
    >
      <legend class="fieldset-legend">Import Bibliography from YAML</legend>

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
          <span>Parsing {fileName}...</span>
        </div>
      {/if}

      {#if error}
        <div role="alert" class="alert alert-error mt-4">
          <CircleX class="h-6 w-6 shrink-0 stroke-current" />
          <span>{error}</span>
        </div>
      {/if}

      {#if parsedData && !error}
        <div role="alert" class="alert alert-success mt-4">
          <Check class="h-6 w-6 shrink-0 stroke-current" />
          <span>
            Successfully parsed '{fileName}'. Please provide a title for this
            new bibliography.
          </span>
        </div>

        <div class="mt-4">
          <BibliographyMetadataForm
            bind:this={metadataForm}
            bind:title
            bind:description
            showValidation={true}
          />
        </div>
      {/if}

      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <button class="btn">Cancel</button>
        </form>
        <button class="btn btn-primary" onclick={handleSave}>
          Save Bibliography
        </button>
      </div>
    </fieldset>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
