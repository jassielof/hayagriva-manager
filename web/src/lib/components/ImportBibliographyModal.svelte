<!-- src/routes/ImportBibliographyModal.svelte -->
<script lang="ts">
  import type { HayagrivaData } from '$lib/types/hayagriva-data';
  import { parseYaml } from '$lib/hayagriva';

  // --- Props with Callbacks (Svelte 5 way) ---
  const { onClose, onSave } = $props<{
    onClose: () => void;
    onSave: (data: {
      metadata: { title: string; description?: string };
      data: HayagrivaData;
    }) => void;
  }>();

  // --- Component State with Runes ---
  let fileInput: HTMLInputElement; // For clearing the input
  let file = $state<File | null>(null);
  let fileName = $state('');
  let title = $state('');
  let description = $state('');
  let parsedData = $state<HayagrivaData | null>(null);
  let error = $state<string | null>(null);
  let isLoading = $state(false);

  // --- Logic ---

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) {
      file = selectedFile;
    }
  }

  // Reactive effect: runs whenever 'file' changes
  $effect(() => {
    if (file) {
      isLoading = true;
      error = null;
      parsedData = null;
      fileName = file.name;

      // Suggest a title from the filename
      title = file.name
        .replace(/\.(yml|yaml)$/i, '') // remove extension
        .replace(/[-_]/g, ' ') // replace separators with spaces
        .replace(/\b\w/g, (l) => l.toUpperCase()); // capitalize words

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          parsedData = parseYaml(content);
        } catch (e: any) {
          error = `Failed to parse YAML: ${e.message}`;
          // Reset on error
          file = null;
          if (fileInput) fileInput.value = '';
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
    if (!title.trim() || !parsedData) {
      error = 'Title is required and file must be parsed successfully.';
      return;
    }
    onSave({
      metadata: { title: title.trim(), description: description.trim() },
      data: parsedData
    });
  }

  function handleCancel() {
    file = null;
    if (fileInput) fileInput.value = '';
    onClose();
  }
</script>

<dialog class="modal modal-open">
  <div class="modal-box">
    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onclick={handleCancel}
      >✕</button
    >
    <h3 class="text-lg font-bold">Import Bibliography from YAML</h3>

    <div class="space-y-4 py-4">
      <label class="form-control w-full">
        <div class="label"><span class="label-text">Select a Hayagriva YAML file</span></div>
        <input
          bind:this={fileInput}
          type="file"
          accept=".yml,.yaml"
          class="file-input file-input-bordered w-full"
          onchange={handleFileSelect}
          disabled={isLoading}
        />
      </label>

      {#if isLoading}
        <div class="flex items-center gap-2">
          <span class="loading loading-spinner"></span>
          <span>Parsing {fileName}...</span>
        </div>
      {/if}

      {#if error}
        <div role="alert" class="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
          <span>{error}</span>
        </div>
      {/if}

      {#if parsedData && !error}
        <div role="alert" class="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
          <span
            >Successfully parsed '{fileName}'. Please provide a title for this new bibliography.</span
          >
        </div>

        <label class="form-control w-full">
          <div class="label"><span class="label-text">Bibliography Title</span></div>
          <input
            type="text"
            placeholder="e.g., 'My Quantum Physics Papers'"
            class="input input-bordered w-full"
            bind:value={title}
          />
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text">Description (Optional)</span></div>
          <textarea
            class="textarea textarea-bordered"
            placeholder="A short description of this collection"
            bind:value={description}
          ></textarea>
        </label>
      {/if}
    </div>

    <div class="modal-action">
      <button class="btn" onclick={handleCancel}>Cancel</button>
      <button
        class="btn btn-primary"
        onclick={handleSave}
        disabled={!parsedData || !title.trim() || isLoading}
      >
        Save Bibliography
      </button>
    </div>
  </div>
</dialog>
