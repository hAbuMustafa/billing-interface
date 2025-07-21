<script lang="ts">
  import { page } from "$app/state";
  import Nav from "$lib/components/Nav.svelte";
  import "./styles.css";
  const { children } = $props();
</script>

<svelte:head>
  <title>{page.data.title ? `${page.data.title} | ` : ""}صيدلية الإقتصادي</title
  >
</svelte:head>

<Nav />

<main>
  {@render children()}
</main>

<style>
  main {
    place-items: center;
  }
</style>
