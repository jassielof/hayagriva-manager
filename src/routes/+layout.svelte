<script lang="ts">
  import '../app.css';
  import { pwaInfo } from 'virtual:pwa-info';

  const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

  let { children } = $props();
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<header class="navbar bg-base-100 shadow-sm">
  <a href="/" class="btn btn-ghost text-xl">Hayagriva Manager</a>
</header>

{@render children()}
