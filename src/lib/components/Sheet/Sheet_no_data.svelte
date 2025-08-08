<script lang="ts">
  import { getContext } from 'svelte';

  const columnNames: () => string[] = getContext('column names');
</script>

<tr class="no-data">
  <td colspan={columnNames().length ?? 1}>لا توجد بيانات</td>
</tr>

<style>
  tr.no-data {
    color: light-dark(red, hotpink);
    font-weight: bold;
  }
</style>
