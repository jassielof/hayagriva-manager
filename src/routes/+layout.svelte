<script lang="ts">
  import { page } from '$app/state';
  import './layout.css';
  import { pwaInfo } from 'virtual:pwa-info';

  const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');
  const breadcrumbs = $derived(() => {
    const path = page.url.pathname;

    if (path === '/') {
      return [{ label: 'Bibliographies', href: '/' }];
    }

    const segments = path.split('/').filter(Boolean);
    const crumbs = [{ label: 'Bibliographies', href: '/' }];

    if (segments[0] === 'bibliography') {
      if (segments[1] === 'new' || segments[1] === 'import') {
        crumbs.push({
          label: `${segments[1].charAt(0).toUpperCase() + segments[1].slice(1)} Bibliography`,
          href: path
        });
      } else if (segments[1]) {
        crumbs.push({ label: `Bibliography: ${segments[1]}`, href: path });
      }
    }

    return crumbs;
  });

  let { children } = $props();
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<header class="navbar bg-base-100 shadow-sm">
  <!-- <a href="/" class="btn text-xl btn-ghost">Hayagriva Manager</a> -->
  <div class="breadcrumbs pl-4 text-sm">
    <ul>
      {#each breadcrumbs() as crumb, i}
        <li>
          {#if i === breadcrumbs().length - 1}
            {crumb.label}
          {:else}
            <a href={crumb.href}>{crumb.label}</a>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</header>

{@render children()}
