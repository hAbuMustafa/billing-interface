<script lang="ts">
  import { getContext } from 'svelte';

  const columnNames: () => string[] = getContext('column names');
  const renameColumns: Record<string, string> = getContext('rename columns');
</script>

<thead>
  <tr>
    {#each columnNames() as colName, i (i)}
      {#if renameColumns && renameColumns.hasOwnProperty(colName)}
        <th>{renameColumns[colName]}</th>
      {:else}
        <th>{colName}</th>
      {/if}
    {/each}
  </tr>
</thead>

<style>
  thead {
    position: sticky;
    inset-block-start: 0;
  }

  tr {
    background-color: hsl(from var(--main-bg-color) h s 60%);
    color: var(--main-bg-color);
    border: 1px solid var(--main-text-color);
  }

  th {
    padding: 0.5rem;
    text-align: center;
  }

  th:not(:last-of-type) {
    border-inline-end: 1px solid light-dark(var(--main-text-color), var(--main-bg-color));
  }
</style>
