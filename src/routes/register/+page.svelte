<script lang="ts">
  import {
    arabicNamePattern,
    egyptianMobileNumberPattern,
    passwordPattern,
    usernamePattern,
  } from '$lib/stores/patterns';

  let userPassword = $state('');
  let userConfirmPassword = $state('');
</script>

<form action="/register" method="post">
  <fieldset>
    <legend>البيانات الشخصية</legend>
    <label for="first-name">الاسم الأول</label>
    <!-- svelte-ignore a11y_autofocus -->
    <input
      id="first-name"
      name="first-name"
      type="text"
      style:direction="rtl"
      required
      autofocus
      pattern={arabicNamePattern.source}
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
    />

    <label for="father-name">اسم الأب</label>
    <input
      id="father-name"
      name="father-name"
      type="text"
      style:direction="rtl"
      required
      pattern={arabicNamePattern.source}
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
    />

    <label for="grandfather-name">اسم الجد</label>
    <input
      id="grandfather-name"
      name="grandfather-name"
      type="text"
      style:direction="rtl"
      required
      pattern={arabicNamePattern.source}
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
    />

    <label for="family-name">اسم العائلة</label>
    <input
      id="family-name"
      name="family-name"
      type="text"
      style:direction="rtl"
      pattern={arabicNamePattern.source}
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
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
    <label for="email">البريد الإلكتروني</label>
    <input
      id="email"
      name="email"
      type="email"
      required
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
    width: clamp(500px, 50vw, 600px);
    padding: 2rem;

    border-radius: 0.25rem;
    border: 1px solid light-dark(#333, #ccc);

    box-shadow: black 10px 10px 10px;

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

    border-color: light-dark(#333, #ccc);
    border-radius: 0.25rem;
  }

  label {
    margin-block: 1rem 0.25rem;
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
    background-color: royalblue;
    color: light-dark(#ccc, #ccc);
    font-weight: 700;
    font-size: 1.25rem;
    grid-column: 1/-1;

    height: 3rem;
  }

  label:has(+ input[required])::after {
    content: '*';

    margin-inline-start: 0.25rem;
    color: red;
  }
</style>
