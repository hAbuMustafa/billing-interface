<script lang="ts">
  import { page } from '$app/state';
  import Nav from '$lib/components/Nav.svelte';
  import './styles.css';
  const { children } = $props();
</script>

<svelte:head>
  <title>{page.data.title ? `${page.data.title} | ` : ''}صيدلية الاقتصادي</title>
</svelte:head>

<Nav user={page.data.user} />

<div class="main-wrapper">
  <h1>
    {page.data.title ?? 'NO TITLE'}
  </h1>

  {#if page.status >= 400 && page?.form?.message}
    <!-- todo: convert to a popover dismissible dialog -->
    <div class="error" dir="auto">{page.form.message}</div>
  {/if}

  <main>
    {@render children()}
  </main>
</div>

<style>
  .main-wrapper {
    display: grid;
    grid-template-columns: 3fr 6fr 3fr;
    grid-template-rows: min-content 1fr;

    @media (max-width: 400px) {
      grid-template-columns: 1fr;
    }
  }

  h1 {
    text-align: center;
    grid-column: 1 / -1;
  }

  main {
    grid-column: 2 / 3;

    @media (max-width: 400px) {
      grid-column: 1 / -1;
    }
  }

  .error {
    margin-block: 1rem;
    padding-block: 1rem;
    text-align: center;
    border: 1px solid light-dark(maroon, salmon);
    border-radius: 8px;
    background-color: light-dark(hsl(from salmon h s 80%), hsl(from salmon h s 20%));
  }
</style>
