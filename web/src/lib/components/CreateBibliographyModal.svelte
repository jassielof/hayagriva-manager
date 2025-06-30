<script lang="ts">
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';

  const { show, bibliography, onSave, onClose } = $props<{
    show: boolean;
    bibliography: BibliographyMetadata | null;
    onSave: (metadata: Partial<BibliographyMetadata>) => void;
    onClose: () => void;
  }>();

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
    const metadata: Partial<BibliographyMetadata> = { title: title.trim(), description: description.trim() };
    onSave(metadata);
  }
</script>

<!-- Bind the dialog element and listen for its native 'close' event -->
<dialog bind:this={dialog} onclose={onClose} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">{bibliography ? 'Edit' : 'Create'} Bibliography</h3>
    <div class="py-4">
      <label class="form-control w-full">
        <div class="label"><span class="label-text">Title</span></div>
        <input
          type="text"
          placeholder="e.g., 'My Research Papers'"
          class="input input-bordered w-full"
          bind:value={title}
          required
        />
      </label>
      <label class="form-control mt-4 w-full">
        <div class="label"><span class="label-text">Description</span></div>
        <textarea
          class="textarea textarea-bordered"
          placeholder="A short description"
          bind:value={description}
        ></textarea>
      </label>
    </div>
    <div class="modal-action">
      <!-- This form with method="dialog" allows the button to close the modal automatically -->
      <form method="dialog" class="flex gap-2">
        <button class="btn">Cancel</button>
        <!-- The save button is outside the closing form -->
      </form>
      <button class="btn btn-primary" onclick={save} disabled={!title.trim()}>Save</button>
    </div>
  </div>
  <!-- Add a backdrop that also closes the modal -->
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
