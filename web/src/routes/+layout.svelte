<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<header class="navbar bg-base-100 shadow-sm">
  <a href="/" class="btn btn-ghost text-xl">Hayagriva Manager</a>
</header>

{@render children()}
