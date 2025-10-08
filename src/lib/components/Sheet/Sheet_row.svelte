<script lang="ts">
  import Cell from '$lib/components/Sheet/Sheet_cell.svelte';
  import { getContext } from 'svelte';

  type PropsT = {
    dataObj: Record<string, string | number | Date>;
  };

  const { dataObj }: PropsT = $props();

  const colNames: () => string[] = $derived(getContext('column names'));
</script>

<tr>
  {#each colNames() as column, j (j)}
    {#if dataObj.hasOwnProperty(column) && dataObj[column] !== ''}
      <Cell dataTuple={[column, dataObj[column]]} />
    {:else}
      <Cell dataTuple={[column, '']} />
    {/if}
  {/each}
</tr>

<style>
  tr {
    border: 1px solid var(--main-text-color);
  }
</style>
