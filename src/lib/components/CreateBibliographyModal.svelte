<script lang="ts">
  import type { BibliographyMetadata } from '$lib/types/bibliography-metadata';
  import BibliographyMetadataForm from './BibliographyMetadataForm.svelte';

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
  let metadataForm = $state<BibliographyMetadataForm>();

  // Use an effect to control the dialog's visibility
  $effect(() => {
    if (dialog) {
      if (show) {
        dialog.showModal();
      } else {
        // Reset form when closing
        title = '';
        description = '';
        dialog.close();
      }
    }
  });

  function save() {
    if (!metadataForm?.isValid()) {
      return;
    }

    const metadata = metadataForm.getFormData();
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

      <BibliographyMetadataForm
        bind:this={metadataForm}
        bind:title
        bind:description
        {bibliography}
      />

      <div class="modal-action">
        <form method="dialog" class="flex gap-2">
          <button class="btn">Cancel</button>
        </form>
        <button class="btn btn-primary" onclick={save}>Save</button>
      </div>
    </fieldset>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
