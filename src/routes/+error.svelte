<script lang="ts">
  import { page } from '$app/state';
</script>

<main class="flex flex-col" style="min-height: calc(100vh - 4rem);">
  <section class="flex flex-1 items-center justify-center">
    <div class="card card-xl bg-error-content">
      <div class="card-body">
        <h2 class="card-title text-error text-xl">
          {page.error?.message}
        </h2>
      </div>
      <figure>
        <img
          class="rounded-xl"
          src="https://http.cat/{page.status}.jpg"
          alt="Error {page.error?.message}"
        />
      </figure>
    </div>
  </section>
</main>
