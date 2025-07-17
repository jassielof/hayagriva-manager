<script lang="ts">
  import { parseYaml } from '$lib/hayagriva';
  import type { Bibliography } from '$lib/types/bibliography';
  import type { Hayagriva } from '$lib/types/hayagriva';

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
        file = null;
        parsedData = null;
        error = null;
        title = '';
        description = '';
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

      title = file.name
        .replace(/\.(yml|yaml)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

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
    if (!title.trim() || !parsedData) {
      error = 'Title is required and file must be parsed successfully.';
      return;
    }

    const payload = {
      metadata: { title: title.trim(), description: description.trim() },
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
      <label class="label" for="file-input">Select a Hayagriva YAML file</label>
      <input
        type="file"
        class="file-input w-full"
        id="file-input"
        accept=".yml,.yaml"
        onchange={handleFileSelect}
        disabled={isLoading}
      />

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
            >Successfully parsed '{fileName}'. Please provide a title for this
            new bibliography.</span
          >
        </div>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Bibliography Title</span>
          </div>
          <input
            type="text"
            placeholder="e.g., 'My Quantum Physics Papers'"
            class="input input-bordered w-full"
            bind:value={title}
          />
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Description (Optional)</span>
          </div>
          <textarea
            class="textarea textarea-bordered"
            placeholder="A short description of this collection"
            bind:value={description}
          ></textarea>
        </label>
      {/if}
      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <button class="btn">Cancel</button>
        </form>
        <button
          class="btn btn-primary"
          onclick={handleSave}
          disabled={!parsedData || !title.trim() || isLoading}
        >
          Save Bibliography
        </button>
      </div>
    </fieldset>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
