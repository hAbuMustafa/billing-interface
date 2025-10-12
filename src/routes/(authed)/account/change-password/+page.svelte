<script lang="ts">
  import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
  <label for="old_password">كلمة السر القديمة</label>
  <input type="password" name="old_password" id="old_password" required />

  <hr />

  <label for="new_password">كلمة السر الجديدة</label>
  <input type="password" name="new_password" id="new_password" required />

  <label for="confirm_new_password">تأكيد كلمة السر</label>
  <input type="password" name="confirm_new_password" id="confirm_new_password" required />

  <input class="danger" type="submit" value="تغيير كلمة السر" />
</form>

<style>
  form {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: repeat(1fr, 4);
    gap: 1rem;
  }

  hr {
    grid-column: 1/-1;
    width: 100%;
    margin-block: 0;
  }

  label {
    text-align: end;
    text-wrap: nowrap;
    margin: unset !important;
  }

  input[type='submit'] {
    margin-block-start: 1rem;
    grid-column: 1/-1;
    padding: 0.25rem;
  }
</style>
