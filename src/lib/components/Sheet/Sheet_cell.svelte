<script lang="ts">
  import { formatDate } from '$lib/utils/date-format';
  import { getContext } from 'svelte';

  type PropsT = {
    dataTuple: [string, string | number | Date];
    row: Record<string, string | number | Date>;
  };

  const { dataTuple, row }: PropsT = $props();
  const [colName, colValue] = $derived(dataTuple);

  const dateColumns: Record<string, string | undefined> = getContext('date columns');
  const actionColumns: Record<string, Function> = getContext('action columns');
</script>

<td>
  {#if dateColumns && dateColumns.hasOwnProperty(colName) && colValue && (typeof colValue === 'number' || colValue instanceof Date)}
    {formatDate(colValue as number | Date, dateColumns[colName])}
  {:else if actionColumns && actionColumns.hasOwnProperty(colName)}
    <input
      type="button"
      onclick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        actionColumns[colName](row);
      }}
      value={colName}
    />
  {:else}
    {colValue}
  {/if}
</td>

<style>
  td {
    border: var(--main-border);
    padding: 0.5rem;
    text-align: center;
    text-wrap: wrap;
  }

  input[type='button'] {
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }
</style>
