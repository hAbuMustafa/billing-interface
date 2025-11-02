<script lang="ts">
  import { enhance } from '$app/forms';
  import {
    arabicTriadicNamesPattern,
    egyptianMobileNumberPattern,
    nationalIdPattern,
    passwordPattern,
    usernamePattern,
  } from '$lib/stores/patterns';

  let { form } = $props();

  let userPassword = $state('');
  let userConfirmPassword = $state('');
</script>

<form method="post" use:enhance>
  <fieldset class="flex-form">
    <legend>البيانات الشخصية</legend>

    <div class="input-pair">
      <label for="name">الاسم كاملا</label>
      <!-- svelte-ignore a11y_autofocus -->
      <input
        id="name"
        name="name"
        type="text"
        style:direction="rtl"
        required
        autofocus
        pattern={arabicTriadicNamesPattern.source}
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        value={form?.name ?? ''}
      />
    </div>

    <div class="input-pair">
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
    </div>
  </fieldset>

  <fieldset class="flex-form">
    <legend>بيانات المستخدم</legend>

    <div class="input-pair">
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
    </div>

    <div class="input-pair">
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
    </div>

    <div class="input-pair">
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
    </div>

    <div class="input-pair">
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
    </div>

    <div class="input-pair">
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
    </div>
  </fieldset>

  <input type="submit" value="أنشئ الحساب" />
</form>

<style>
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 6fr 1fr;
    gap: 1rem;
    width: 100%;

    @media (max-width: 900px) {
      display: flex;
      flex-direction: column;
    }
  }

  input[type='submit'] {
    grid-column: 1/-1;
  }
</style>
