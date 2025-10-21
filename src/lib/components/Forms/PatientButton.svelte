<script lang="ts">
  import { formatDate } from '$lib/utils/date-format';

  type PropsT = {
    patient: any;
    onclick?: Function;
  };

  let { patient = $bindable(), onclick }: PropsT = $props();
</script>

<button
  onclick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    onclick?.();
  }}
  class:discharged={!!patient.discharge_date}
>
  <span>{patient.id}</span>
  <strong>{patient.name}</strong>
  <span>{patient.id_doc_num}</span>
  <span class="residency_data">
    <span>الدخول: {formatDate(patient.admission_date, 'YYYY/MM/DD')}</span>
    {#if patient.discharge_date}
      <span>الخروج: {formatDate(patient.discharge_date, 'YYYY/MM/DD')}</span>
    {/if}
  </span>
  <span>{patient.recent_ward}</span>
</button>

<style>
  button {
    display: flex;
    flex-direction: column;
    align-items: center;

    &.discharged {
      background-color: light-dark(salmon, maroon);
    }
  }

  .residency_data {
    display: flex;
    gap: 0.5rem;
  }
</style>
