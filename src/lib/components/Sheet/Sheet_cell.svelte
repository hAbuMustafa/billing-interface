<script lang="ts">
  import { formatDate } from '$lib/utils/date-format';
  import { getContext } from 'svelte';

  type PropsT = {
    dataTuple: [string, string | number];
  };

  const { dataTuple }: PropsT = $props();
  const dateColumns: () => App.PageState['DateColumnT'][] = getContext('date columns');
</script>

<td
  >{#if dateColumns && dateColumns().some((c) => dataTuple[0] === (typeof c === 'string' ? c : c.name))}
    {#if dataTuple[1]}
      {formatDate(
        dataTuple[1] as number,
        dateColumns().find(
          (c): c is { name: string; format: string } =>
            typeof c !== 'string' && c.name === dataTuple[0]
        )?.format
      )}
    {/if}
  {:else}
    {dataTuple[1]}
  {/if}</td
>

<style>
  td {
    border: 1px solid var(--main-text-color);
    padding: 0.5rem;
    text-align: center;
  }
</style>
