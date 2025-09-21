<script lang="ts">
  import Cell from '$lib/components/Sheet/Sheet_cell.svelte';

  type PropsT = {
    dataObj: { [key: string]: string | number | Date };
  };

  const { dataObj }: PropsT = $props();
</script>

<tr>
  {#each Object.entries(dataObj) as dataTuple, j (j)}
    <Cell {dataTuple} />
  {/each}
</tr>

<style>
  tr {
    border: 1px solid var(--main-text-color);
  }
</style>
