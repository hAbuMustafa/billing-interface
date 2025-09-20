<script lang="ts">
  import { usernamePattern } from '$lib/stores/patterns';
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

  <input type="submit" value="تسجيل الدخول" />
</form>

<style>
  form {
    display: grid;
    grid-template-rows: repeat(4, 1fr) 2fr;
  }

  label {
    margin-block: 1rem 0.25rem;
  }

  input {
    direction: ltr;
    border-radius: 4px;
    border: 1px solid light-dark(#333, #ccc);

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
    font-weight: 700;
    font-size: 1.25rem;
  }
</style>
