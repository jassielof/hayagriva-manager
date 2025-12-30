<script lang="ts">
  import { page } from '$app/state';
  import './layout.css';
  import { pwaInfo } from 'virtual:pwa-info';

  const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
  import { onMount } from 'svelte';

  let { children } = $props();
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<header class="navbar bg-base-100 shadow-sm">
  <a href="/" class="btn text-xl btn-ghost">Hayagriva Manager</a>
</header>

{@render children()}
