<script lang="ts">
  import type { People } from '$lib/server/db/schema';
  import { formatDate, getAge } from '$lib/utils/date-format';

  type PropsT = {
    person: typeof People.$inferSelect;
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
