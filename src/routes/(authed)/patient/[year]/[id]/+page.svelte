<script lang="ts">
  import { formatDate } from '$lib/utils/date-format.js';

  let { data } = $props();
</script>

{#if data.patient}
  <section>
    <h2>البيانات الشخصية</h2>
    <dl class="personal_data">
      <dt>رقم القيد:</dt>
      <dd>{data.patient.id}</dd>

      <dt>{data.patient.Person.Patient_id_doc_type.name}:</dt>
      <dd>{data.patient.Person.id_doc_num}</dd>

      <dt>تاريخ الدخول:</dt>
      <dd>{formatDate(data.patient.admission_date, 'YYYY/MM/DD (hh:mm)')}</dd>

      {#if data.patient.admission_notes}
        <dt>ملاحظات الدخول:</dt>
        <dd>{data.patient.admission_notes}</dd>
      {/if}

      {#if data.patient.discharge_date}
        <dt>تاريخ الخروج:</dt>
        <dd>{formatDate(data.patient.discharge_date, 'YYYY/MM/DD (hh:mm)')}</dd>

        <dt>سبب الخروج:</dt>
        <dd>{data.patient.Patient_discharge_reason.name}</dd>
      {/if}

      <dt>التأمين الصحي:</dt>
      <dd>{data.patient.health_insurance ? '' : 'غير '} مؤمن عليه</dd>
    </dl>

    {#if data.patient.Person.Patients}
      <h3>الإقامات الأخرى</h3>
      <dl class="other_admissions_data">
        {#each data.patient.Person.Patients as patientAdmission, i (patientAdmission.id)}
          <dt><a href="/patient/{patientAdmission.id}">{patientAdmission.id}</a></dt>
          <dd>من: {formatDate(patientAdmission.admission_date, 'YYYY/MM/DD (hh:mm)')}</dd>
          {#if patientAdmission.discharge_date}
            <dd>
              إلى: {formatDate(patientAdmission.discharge_date, 'YYYY/MM/DD (hh:mm)')}
            </dd>
            <dd>{patientAdmission.Patient_discharge_reason.name}</dd>
          {/if}
        {/each}
      </dl>
    {/if}
  </section>
{/if}

<style>
  dl {
    display: grid;
  }

  dl.personal_data {
    grid-template-columns: 1fr 80%;
  }

  dl.other_admissions_data {
    grid-template-columns: 1fr 2fr 2fr 2fr;
  }

  dt {
    font-weight: 700;
  }

  dt,
  dd {
    place-content: center;
  }
</style>
