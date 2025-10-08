<script lang="ts">
  import { formatDate, getAge } from '$lib/utils/date-format';

  type PropsT = {
    person: any;
    onclick?: Function;
  };

  let { person = $bindable(), onclick }: PropsT = $props();
</script>

<button
  onclick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    onclick?.();
  }}
>
  <strong>{person.name}</strong>
  <span>{person.id_doc_num}</span>
  {#if person.birthdate}
    <span>
      {formatDate(person.birthdate, 'YYYY/MM/DD')} ({getAge(person.birthdate)} سنة)
    </span>
  {/if}
</button>

<style>
  button {
    display: flex;
    flex-direction: column;
  }
</style>
