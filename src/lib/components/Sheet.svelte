<script lang="ts">
  const { rows } = $props();

  let columnNames: string[] = $state([]);
  if (rows && rows.length > 0 && typeof rows[0] === 'object') {
    columnNames = Object.keys(rows[0]);
  }
</script>

<table>
  {#if columnNames.length === 0}
    <tbody>
      {@render NoData()}
    </tbody>
  {:else}
    <thead>
      <tr>
        {#each columnNames as colName, i (i)}
          <th>{colName}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if rows.length === 1}
        {@render NoData()}
      {:else}
        {#each rows as row, i (i)}
          {#if row[columnNames[0]] !== columnNames[0]}
            <tr>
              {#each Object.entries(row) as rowTuple, j (j)}
                <td>{rowTuple[1]}</td>
              {/each}
            </tr>
          {/if}
        {/each}
      {/if}
    </tbody>
  {/if}
</table>

{#snippet NoData()}
  <tr class="no-data">
    <td colspan={columnNames.length}>لا توجد بيانات</td>
  </tr>
{/snippet}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  tr,
  td {
    border: 1px solid var(--main-text-color);
  }

  th,
  td {
    padding: 0.5rem;
    text-align: center;
  }

  th:not(:last-of-type) {
    border-inline-end: 1px solid light-dark(var(--main-text-color), var(--main-bg-color));
  }

  thead > tr {
    background-color: hsl(from var(--main-bg-color) h s 60%);
    color: var(--main-bg-color);
  }

  thead {
    position: sticky;
    inset-block-start: -1px;
  }

  tr.no-data {
    color: light-dark(red, hotpink);
    font-weight: bold;
  }
</style>
