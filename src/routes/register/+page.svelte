<script lang="ts">
  import {
    arabicTetradicNamesPattern,
    egyptianMobileNumberPattern,
    passwordPattern,
    usernamePattern,
  } from '$lib/stores/patterns';

  let userPassword = $state('');
  let userConfirmPassword = $state('');
</script>

<form action="/register" method="post">
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

  <label for="name">اسم الموظف</label>
  <input
    id="name"
    name="name"
    type="text"
    style:direction="rtl"
    required
    pattern={arabicTetradicNamesPattern.source}
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
  />

  <label for="mobile">رقم الموبايل</label>
  <input
    id="mobile"
    name="mobile"
    type="text"
    required
    pattern={egyptianMobileNumberPattern.source}
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
  />

  <hr />

  <label for="password">كلمة السر</label>
  <input
    id="password"
    name="password"
    type="password"
    required
    bind:value={userPassword}
    pattern={passwordPattern.source}
    autocomplete="off"
  />

  <label for="confirm-password">تأكيد كلمة السر</label>
  <input
    id="confirm-password"
    name="confirm-password"
    type="password"
    required
    bind:value={userConfirmPassword}
    autocomplete="off"
    class:unequal={userPassword &&
      userConfirmPassword &&
      userPassword !== userConfirmPassword}
    class:equal={userPassword &&
      userConfirmPassword &&
      userPassword === userConfirmPassword}
  />

  <input type="submit" value="أنشئ الحساب" />
</form>

<style>
  form {
    width: clamp(300px, 50vw, 400px);

    display: grid;
    grid-template-rows: repeat(11, 1fr) 2fr;
  }

  label {
    margin-block: 1rem 0.25rem;
  }

  input {
    direction: ltr;
    position: relative;
    border-radius: 4px;
    border: 1px solid light-dark(#333, #ccc);

    text-align: center;
  }

  input:user-invalid,
  input.unequal {
    border-color: light-dark(maroon, salmon);
    background-color: light-dark(hsl(from salmon h s 80%), hsl(from salmon h s 20%));
  }

  input:user-valid,
  input.equal {
    border-color: light-dark(#008080, green);
    background-color: light-dark(hsl(from green h s 80%), hsl(from green h s 20%));
  }

  hr {
    height: 1px;
    width: 100%;
    align-self: end;
  }

  input[type='submit'] {
    margin-block-start: 1rem;
    background-color: royalblue;
    color: light-dark(#ccc, #ccc);
    font-weight: 700;
    font-size: 1.25rem;
  }
</style>
