<script lang="ts">
  import {
    Timeline,
    TimelineItem,
    TimelineContent,
    TimelineOppositeContent,
    TimelineConnector,
    TimelineSeparator,
    TimelineDot,
  } from 'svelte-vertical-timeline';
  import { formatDate, getAge, getDuration } from '$lib/utils/date-format.js';

  let { data } = $props();
</script>

{#if data.patient}
  <section>
    <details>
      <summary>البيانات الشخصية</summary>
      <dl class="personal_data">
        <dt>رقم القيد:</dt>
        <dd>{data.patient.id}</dd>

        <dt>{data.patient.Person.Patient_id_doc_type?.name}:</dt>
        <dd>{data.patient.Person.id_doc_num}</dd>

        {#if data.patient.Person.birthdate}
          <dt>تاريخ الميلاد:</dt>
          <dd>
            {formatDate(data.patient.Person.birthdate, 'YYYY/MM/DD')} ({getAge(
              data.patient.Person.birthdate
            )} سنة)
          </dd>
        {/if}

        <dt>النوع:</dt>
        <dd>{data.patient.Person.gender ? 'ذكر' : 'أنثى'}</dd>

        <dt>التأمين الصحي:</dt>
        <dd>{data.patient.health_insurance ? '' : 'غير '} مؤمن عليه</dd>
      </dl>
    </details>

    <h2>بيانات الإقامة</h2>
    <dl class="stay-data">
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
        <dd>{data.patient.Patient_discharge_reason?.name}</dd>

        <dt>مدة الإقامة:</dt>
        <dd>
          {getDuration(data.patient.admission_date, data.patient.discharge_date)} يوما
        </dd>
      {/if}

      {#if !data.patient.discharge_date}
        <dt>القسم:</dt>
        <dd>{data.patient.Patient_wards.at(-1)?.Ward.name}</dd>
      {/if}
    </dl>

    <details dir="ltr">
      <summary dir="rtl">التنقلات</summary>
      <Timeline position="alternate">
        {#each data.patient.Patient_wards as transfer, i (i)}
          <TimelineItem>
            <TimelineOppositeContent slot="opposite-content">
              <small class="transfer_time">
                {formatDate(transfer.timestamp, 'YYYY/MM/DD (hh:mm)')}
              </small>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot style={'background-color: #7CD5E2;'} />
              {#if !data.patient.discharge_date && data.patient.Patient_wards.length - 1 === i}
                <TimelineConnector
                  style="background: linear-gradient(#fff, 30%, transparent 99% 1%);"
                />
              {:else}
                <TimelineConnector />
              {/if}
            </TimelineSeparator>
            <TimelineContent>
              <span class="transfer_ward_name">{transfer.Ward.name}</span>
            </TimelineContent>
          </TimelineItem>
        {/each}

        {#if data.patient.discharge_date}
          <TimelineItem>
            <TimelineOppositeContent slot="opposite-content">
              <small class="transfer_time">
                {formatDate(data.patient.discharge_date, 'YYYY/MM/DD (hh:mm)')}
              </small>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot style={'background-color: red;'} />
            </TimelineSeparator>
            <TimelineContent>
              <span class="transfer_ward_name">خروج</span>
            </TimelineContent>
          </TimelineItem>
        {/if}
      </Timeline>
    </details>

    <h2>التشخيص</h2>
    {#each data.patient.Patient_diagnoses as diagnosis, i (i)}
      <dl class="diagnosis_data">
        <dt>{diagnosis.Diagnosis.name}</dt>
        <dd>
          {diagnosis.timestamp === data.patient.admission_date
            ? '(أولي)'
            : formatDate(diagnosis.timestamp, 'YYYY/MM/DD (hh:mm)')}
        </dd>
      </dl>
    {/each}
  </section>
  <section>
    {#if data.patient.Person.Patients}
      <h2>الإقامات الأخرى</h2>
      <dl class="other_admissions_data">
        {#each data.patient.Person.Patients as patientAdmission, i (patientAdmission.id)}
          <dt>
            <a href="/patient/{patientAdmission.id}" class="button"
              >{patientAdmission.id}</a
            >
          </dt>
          <dd>من: {formatDate(patientAdmission.admission_date, 'YYYY/MM/DD (hh:mm)')}</dd>
          {#if patientAdmission.discharge_date}
            <dd>
              إلى: {formatDate(patientAdmission.discharge_date, 'YYYY/MM/DD (hh:mm)')}
            </dd>
            <dd>{patientAdmission.Patient_discharge_reason?.name}</dd>
          {/if}
        {/each}
      </dl>
    {/if}
  </section>
{/if}

<style>
  details {
    padding: 1rem;
    border-radius: 0.5rem;

    &:is(:hover, :focus, :active) {
      background-color: hsl(from var(--main-bg-color) h s 40%);
    }
  }

  dl {
    display: grid;
  }

  dl.personal_data,
  dl.stay-data {
    grid-template-columns: 1fr 80%;
  }

  dl.diagnosis_data {
    grid-template-columns: 1fr 2fr;
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

  small.transfer_time {
    color: gray;
  }

  span.transfer_ward_name {
    font-weight: bolder;
    font-size: 1.25rem;
  }
</style>
