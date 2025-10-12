<script lang="ts">
  import { page } from '$app/state';
  import { usernamePattern } from '$lib/stores/patterns';

  const redirectTo = page.url.searchParams.get('redirectTo');
</script>

<form action="/login" method="post">
  <label for="username">اسم المستخدم</label>
  <!-- svelte-ignore a11y_autofocus -->
  <input
    id="username"
    name="username"
    type="text"
    required
    pattern={usernamePattern.source}
    autofocus
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
  />

  <label for="password">كلمة السر</label>
  <input
    id="password"
    name="password"
    type="password"
    required
    min="7"
    max="32"
    autocomplete="off"
  />

  {#if redirectTo}
    <input type="hidden" name="redirectTo" value={redirectTo} />
  {/if}

  <input type="submit" value="تسجيل الدخول" />
</form>

<style>
  form {
    display: grid;
    grid-template-rows: repeat(4, 1fr) 2fr;

    padding-block-end: 3rem;
  }

  label {
    margin-block: 1rem 0.25rem;
  }

  input {
    direction: ltr;
    border-radius: 4px;
    border: var(--main-border);

    text-align: center;
  }

  input:user-invalid {
    border-color: light-dark(maroon, salmon);
    background-color: light-dark(hsl(from salmon h s 80%), hsl(from salmon h s 20%));
  }

  input:user-valid {
    border-color: light-dark(#008080, green);
    background-color: light-dark(hsl(from green h s 80%), hsl(from green h s 20%));
  }

  input[type='submit'] {
    margin-block-start: 1rem;
    background-color: royalblue;
    color: light-dark(#ccc, #ccc);
  }
</style>
