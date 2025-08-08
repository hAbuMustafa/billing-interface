<script lang="ts">
  import { setContext } from 'svelte';

  import SheetHead from '$lib/components/Sheet/Sheet_head.svelte';
  import Row from '$lib/components/Sheet/Sheet_row.svelte';
  import NoData from '$lib/components/Sheet/Sheet_no_data.svelte';

  type PropsT = {
    rows: { [key: string]: string | number }[];
    dateColumns?: App.PageState['DateColumnT'][];
  };

  const { rows, dateColumns }: PropsT = $props();

  let columnNames: string[] = $state([]);
  if (rows && rows.length > 0 && typeof rows[0] === 'object') {
    columnNames = Object.keys(rows[0]);
  }

  setContext('date columns', () => dateColumns);
  setContext('column names', () => columnNames);
</script>

<table>
  {#if columnNames.length === 0}
    <tbody>
      <NoData />
    </tbody>
  {:else}
    <SheetHead />
    <tbody>
      {#if rows.length === 1}
        <NoData />
      {:else}
        {#each rows as row, i (i)}
          {#if row[columnNames[0]] !== columnNames[0]}
            <Row dataObj={row} />
          {/if}
        {/each}
      {/if}
    </tbody>
  {/if}
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;

    white-space: nowrap;
  }
</style>
