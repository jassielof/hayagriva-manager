<script lang="ts">
  import { resolve } from '$app/paths';
  import './layout.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="manifest" href={resolve('/site.webmanifest')} />
</svelte:head>

<header class="navbar bg-base-100 shadow-sm">
  <a href={resolve('/')} class="btn text-xl btn-ghost">Hayagriva Manager</a>
</header>

{@render children()}
