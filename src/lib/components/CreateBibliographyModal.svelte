<script lang="ts">
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';

  let {
    show,
    bibliography,
    onSave,
    onClose
  }: {
    show: boolean;
    bibliography: BibliographyMetadata | null;
    onSave: (metadata: Partial<BibliographyMetadata>) => void;
    onClose: () => void;
  } = $props();

  let title = $state('');
  let description = $state('');
  let dialog: HTMLDialogElement;

  // Use an effect to react to prop changes
  $effect(() => {
    if (bibliography) {
      // Pre-fill form for editing
      title = bibliography.title;
      description = bibliography.description || '';
    } else {
      // Reset form for creating
      title = '';
      description = '';
    }
  });

  // Use an effect to control the dialog's visibility
  $effect(() => {
    if (dialog) {
      if (show) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  });

  function save() {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    // We only pass back the fields that were edited
    const metadata: Partial<BibliographyMetadata> = {
      title: title.trim(),
      description: description.trim()
    };
    onSave(metadata);
  }
</script>

<dialog bind:this={dialog} onclose={onClose} class="modal">
  <div class="modal-box">
    <fieldset
      class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4"
    >
      <legend class="fieldset-legend">
        {bibliography ? 'Edit' : 'Create'} Bibliography
      </legend>
      <label class="label" for="title"> Title </label>
      <input
        id="title"
        type="text"
        placeholder="e.g., 'My Research Papers'"
        class="input validator w-full"
        bind:value={title}
        required
      />
      <label class="label" for="description"> Description </label>
      <textarea
        id="description"
        class="textarea w-full"
        placeholder="A short description"
        bind:value={description}
      ></textarea>
      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <button class="btn">Cancel</button>
        </form>
        <button class="btn btn-primary" onclick={save} disabled={!title.trim()}>
          Save
        </button>
      </div>
    </fieldset>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
