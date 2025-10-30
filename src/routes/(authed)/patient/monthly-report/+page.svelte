<script lang="ts">
  let month = $state(new Date().getMonth() + 1);
  let year = $state(new Date().getFullYear());
</script>

<form method="POST">
  <label for="month">الشهر</label>
  <input type="number" name="month" id="month" min="1" max="12" bind:value={month} />

  <label for="year">السنة</label>
  <input type="number" name="year" id="year" min="2024" bind:value={year} />

  <input type="submit" value="عرض" />
</form>

<style>
  /* todo: style this form */
</style>
