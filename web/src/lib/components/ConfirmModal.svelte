<script lang="ts">
  const { show, title, message, onConfirm, onCancel } = $props<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }>();

  let dialog: HTMLDialogElement;

  $effect(() => {
    if (dialog) {
      if (show) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  });

  function handleConfirm() {
    onConfirm();
    onCancel(); // Close modal after confirmation
  }
</script>

<dialog bind:this={dialog} onclose={onCancel} class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">{title}</h3>
    <p class="py-4">{message}</p>
    <div class="modal-action">
      <button class="btn" onclick={onCancel}>Cancel</button>
      <button class="btn btn-error" onclick={handleConfirm}>Confirm</button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button onclick={onCancel}>close</button>
  </form>
</dialog>
