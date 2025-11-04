<script lang="ts">
  let months = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];
  let month = $state(new Date().getMonth() + 1);
  let year = $state(new Date().getFullYear());
</script>

<form method="POST">
  <div class="input-pair">
    <label for="month">الشهر</label>
    <select name="month" id="month" bind:value={month}>
      {#each months as m, i (i)}
        <option value={i + 1}>{`${i + 1}`.padStart(2, '0')} - {m}</option>
      {/each}
    </select>
  </div>

  <div class="input-pair">
    <label for="year">السنة</label>
    <input type="number" name="year" id="year" min="2024" bind:value={year} />
  </div>

  <input type="submit" value="عرض" />
</form>

<style>
  form {
    display: grid;
    grid-template-columns: repeat(2, 2fr) 1fr;
    align-items: center;
    gap: 1rem;

    @media (max-width: 400px) {
      grid-template-columns: 1fr;

      .input-pair {
        display: grid;
        grid-template-columns: 2rem 1fr;
      }
    }
  }

  input[type='number'] {
    max-width: 3.5em;
  }
</style>
