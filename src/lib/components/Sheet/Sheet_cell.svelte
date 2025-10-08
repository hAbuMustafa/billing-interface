<script lang="ts">
  import { formatDate } from '$lib/utils/date-format';
  import { getContext } from 'svelte';

  type PropsT = {
    dataTuple: [string, string | number | Date];
  };

  const { dataTuple }: PropsT = $props();
  const [colName, colValue] = $derived(dataTuple);

  const dateColumns: Record<string, string | undefined> = getContext('date columns');
</script>

<td>
  {#if dateColumns && dateColumns.hasOwnProperty(colName) && colValue && (typeof colValue === 'number' || colValue instanceof Date)}
    {formatDate(colValue as number | Date, dateColumns[colName])}
  {:else}
    {colValue}
  {/if}
</td>

<style>
  td {
    border: 1px solid var(--main-text-color);
    padding: 0.5rem;
    text-align: center;
  }
</style>
