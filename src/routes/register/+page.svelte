<script lang="ts">
  import {
    arabicTetradicNamesPattern,
    egyptianMobileNumberPattern,
    nationalIdPattern,
    passwordPattern,
    usernamePattern,
  } from '$lib/stores/patterns';

  let { form } = $props();

  let userPassword = $state('');
  let userConfirmPassword = $state('');
</script>

<form action="/register" method="post">
  <fieldset>
    <legend>البيانات الشخصية</legend>
    <label for="name">الاسم كاملا</label>
    <!-- svelte-ignore a11y_autofocus -->
    <input
      id="name"
      name="name"
      type="text"
      style:direction="rtl"
      required
      autofocus
      pattern={arabicTetradicNamesPattern.source}
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      value={form?.name ?? ''}
    />

    <label for="national-id">الرقم القومي</label>
    <input
      id="national-id"
      name="national-id"
      type="text"
      required
      pattern={nationalIdPattern.source}
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      value={form?.national_id ?? ''}
    />
  </fieldset>

  <fieldset>
    <legend>بيانات المستخدم</legend>
    <label for="username">اسم المستخدم</label>
    <input
      id="username"
      name="username"
      type="text"
      required
      pattern={usernamePattern.source}
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      value={form?.username ?? ''}
    />
    <label for="phone-number">رقم الموبايل</label>
    <input
      id="phone-number"
      name="phone-number"
      type="text"
      required
      pattern={egyptianMobileNumberPattern.source}
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      value={form?.phone_number ?? ''}
    />
    <label for="email">البريد الإلكتروني</label>
    <input
      id="email"
      name="email"
      type="email"
      required
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      value={form?.email ?? ''}
    />
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
  </fieldset>

  <input type="submit" value="أنشئ الحساب" />
</form>

<style>
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 6fr 1fr;
    gap: 1rem;

    @media (max-width: 400px) {
      width: 95vw;
      display: flex;
      flex-direction: column;
      padding: 0px;
    }
  }

  fieldset {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-block: 1rem 0.25rem;

    &:first-of-type {
      margin-block-start: 0;
    }
  }

  input {
    direction: ltr;
    position: relative;
    border-radius: 4px;
    border: 1px solid light-dark(#333, #ccc);
    height: 2rem;

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

  input[type='submit'] {
    font-weight: 700;
    font-size: 1.25rem;
    grid-column: 1/-1;

    height: 100%;
  }

  label:has(+ input[required])::after {
    content: '*';

    margin-inline-start: 0.25rem;
    color: red;
  }
</style>
