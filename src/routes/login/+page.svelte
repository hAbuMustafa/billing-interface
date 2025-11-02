<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { usernamePattern } from '$lib/stores/patterns';

  const redirectTo = page.url.searchParams.get('redirectTo');
</script>

<form method="post" class="flex-form" use:enhance>
  <div class="input-pair">
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
  </div>

  <div class="input-pair">
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
  </div>

  {#if redirectTo}
    <input type="hidden" name="redirectTo" value={redirectTo} />
  {/if}

  <input type="submit" value="تسجيل الدخول" />
</form>
