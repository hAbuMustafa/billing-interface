<script lang="ts">
  import { page } from '$app/state';
  import ISelect from '$lib/components/Forms/iSelect.svelte';
  import PatientButton from '$lib/components/Forms/PatientButton.svelte';
  import { formatDate } from '$lib/utils/date-format';

  type PatientT = {
    id: string;
    name: string;
    id_doc_num: string;
    admission_date: Date;
    recent_ward: number;
  };

  let patientName = $state('');
  let selectedPatientId = $state('');
  let selectedDischargeReason = $state(0);
  let dischargeDate = $state(formatDate(new Date(), 'YYYY-MM-DDTHH:mm'));

  let hasSelectedPatient = $derived(!!selectedPatientId);
</script>

<form method="post">
  <label for="name"> اسم المريض </label>
  <ISelect
    endpoint="/api/patients/"
    type="text"
    id="name"
    bind:value={patientName}
    bind:done={hasSelectedPatient}
    readonly={hasSelectedPatient ?? false}
    onclear={() => {
      selectedPatientId = '';
    }}
    autocomplete="off"
    required={Boolean(!selectedPatientId) ?? null}
    autofocus
  >
    {#snippet optionSnippet(patient: PatientT)}
      <PatientButton
        {patient}
        onclick={() => {
          patientName = patient.name;
          selectedPatientId = patient.id;
        }}
      />
    {/snippet}
  </ISelect>
  <input type="hidden" name="patient_id" bind:value={selectedPatientId} required />

  <label for="discharge_date">وقت الخروج</label>
  <input
    type="datetime-local"
    name="discharge_date"
    id="discharge_date"
    bind:value={dischargeDate}
    required
  />

  <fieldset>
    <legend>سبب الخروج</legend>
    {#each page.data.discharge_reasons as reason, i (i)}
      <input
        type="radio"
        name="discharge_reason"
        id="discharge_reason_{i}"
        value={reason.id}
        bind:group={selectedDischargeReason}
        required
      />
      <label for="discharge_reason_{i}">{reason.name}</label>
    {/each}
  </fieldset>

  <label for="discharge_notes">ملاحظات</label>
  <textarea
    name="discharge_notes"
    id="discharge_notes"
    required={[3, 9].some((id) => selectedDischargeReason === id)}
  ></textarea>

  <input type="submit" value="تسجيل" />
</form>

<style>
  form {
    display: flex;
    flex-direction: column;

    input[type='submit'] {
      margin-block-start: 2rem;
      padding-block: 0.5rem;
    }
  }

  fieldset {
    margin-block-start: 1rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    gap: 1rem;
  }
</style>
