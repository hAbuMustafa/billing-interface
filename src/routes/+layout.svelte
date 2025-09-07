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

{#if page.data.title}
  <h1>
    {page.data.title}
  </h1>
{/if}

{#if page.status >= 400 && page?.form?.message}
  <div class="error">{page.form.message}</div>
{/if}

<main>
  {@render children()}
</main>

<style>
  h1 {
    text-align: center;
  }

  main {
    display: flex;
    justify-content: center;
  }

  .error {
    margin-block-start: 1rem;
    padding-block: 1rem;
    text-align: center;
    border: 1px solid light-dark(maroon, salmon);
    border-radius: 8px;
    background-color: light-dark(hsl(from salmon h s 80%), hsl(from salmon h s 20%));
  }
</style>
