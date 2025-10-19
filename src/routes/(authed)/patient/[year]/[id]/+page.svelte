<script lang="ts">
  let { data } = $props();
</script>

<div class="ltr">
  {#each Object.keys(data.patient[0]) as chunkId, i (i)}
    <h2>{chunkId}</h2>
    {#each data.patient.map((p: any) => p[chunkId]) as row, j (j)}
      {JSON.stringify(row, null, 8)} <br />
    {/each}
    <hr />
  {/each}
</div>

<style>
  .ltr {
    direction: ltr;
  }
</style>
