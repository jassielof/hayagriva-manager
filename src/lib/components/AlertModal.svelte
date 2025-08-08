<script lang="ts">
  const {
    show,
    title,
    message,
    onClose
  }: {
    show: boolean;
    title: string;
    message: string;
    onClose: () => void;
  } = $props();

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
</script>

<dialog bind:this={dialog} onclose={onClose} class="modal">
  <div class="modal-box">
    <h3 class="text-error text-lg font-bold">{title}</h3>
    <p class="py-4">{message}</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-primary" onclick={onClose}>OK</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
