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
>
  <span>{patient.id}</span>
  <strong>{patient.name}</strong>
  <span>{patient.id_doc_num}</span>
  <span>
    تاريخ الدخول: {formatDate(patient.admission_date, 'YYYY/MM/DD')}
  </span>
  <span>{patient.recent_ward}</span>
</button>

<style>
  button {
    display: flex;
    flex-direction: column;
  }
</style>
