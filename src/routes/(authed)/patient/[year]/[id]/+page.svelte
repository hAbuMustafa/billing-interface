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
  </section>

  <section>
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
        {@const daysOfStay = getDuration(
          data.patient.admission_date,
          data.patient.discharge_date
        )}
        <dd>
          {daysOfStay < 3 ? '' : daysOfStay + ' '}{daysOfStay === 1
            ? 'يوم واحد'
            : daysOfStay === 2
              ? 'يومان'
              : daysOfStay < 11
                ? 'أيام'
                : 'يومًا'}
        </dd>
      {/if}

      {#if !data.patient.discharge_date}
        <dt>القسم:</dt>
        <dd>{data.patient.Patient_wards.at(-1)?.Ward.name}</dd>
      {/if}
    </dl>

    <h3>التشخيص</h3>
    <ol class="diagnosis_list">
      {#each data.patient.Patient_diagnoses as diagnosis, i (i)}
        <li class="diagnosis_pair">
          <span class="diagnosis_name">{diagnosis.Diagnosis.name}</span>
          <span class="diagnosis_time">
            {diagnosis.timestamp === data.patient.admission_date
              ? '(أولي)'
              : formatDate(diagnosis.timestamp, 'YYYY/MM/DD (hh:mm)')}
          </span>
        </li>
      {/each}
    </ol>

    <details dir="ltr">
      <summary dir="rtl"><h3 style="display: inline-block;">التنقلات</h3></summary>
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
  section {
    border: var(--main-border);
    border-radius: 0.5rem;
    margin-block-end: 1rem;
    padding-inline: 1rem;
  }

  details {
    padding: 1rem;
    border-radius: 0.5rem;

    summary {
      border-radius: 0.5rem;
    }

    &:is(:hover, :focus, :active):not(:open) summary {
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

  ol.diagnosis_list {
    padding: 0;
    display: flex;
    gap: 0.5rem;
    list-style: none;
    justify-content: center;

    li {
      background-color: gold;
      color: light-dark(var(--main-text-color), var(--main-bg-color));
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      text-align: center;

      .diagnosis_name {
        font-weight: bold;
      }

      .diagnosis_time {
        display: none;
      }

      &:is(:hover, :focus, :active) .diagnosis_time {
        display: inline;
      }
    }
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
