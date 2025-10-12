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

{#if page.data.user?.password_reset_required}
  <div class="form-message warning">
    يلزم تغيير كلمة السر إذا كان هذا أول استخدام لك للمنصة
  </div>
{/if}

{#if page?.form?.message}
  <!-- todo: convert to a popover dismissible dialog -->
  <div class="form-message {page.form.success ? 'success' : 'error'}" dir="auto">
    {page.form.message}
  </div>
{/if}

<div class="main-wrapper">
  <h1>
    {page.data.title ?? 'NO TITLE'}
  </h1>

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
    display: grid;
    grid-template-columns: 1fr;
    place-content: center;
    padding-inline: 15%;

    @media (max-width: 700px) {
      grid-column: 1 / -1;
    }
  }

  .form-message {
    margin-block: 1rem;
    padding-block: 1rem;
    text-align: center;
    border-radius: 8px;
  }

  .form-message.error {
    border: 1px solid light-dark(maroon, salmon);
    background-color: light-dark(hsl(from salmon h s 80%), hsl(from salmon h s 20%));
  }

  .form-message.success {
    border: 1px solid light-dark(green, lightgreen);
    background-color: light-dark(
      hsl(from lightgreen h s 80%),
      hsl(from lightgreen h s 20%)
    );
  }

  .form-message.warning {
    border: 1px solid light-dark(gold, yellow);
    background-color: light-dark(hsl(from yellow h s 80%), hsl(from yellow h s 20%));
  }
</style>
