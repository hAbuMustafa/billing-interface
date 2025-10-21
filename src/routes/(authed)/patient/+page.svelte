<script lang="ts">
  import { goto } from '$app/navigation';
  import ISelect from '$lib/components/Forms/iSelect.svelte';
  import PatientButton from '$lib/components/Forms/PatientButton.svelte';

  type PatientT = {
    id: string;
    name: string;
    id_doc_num: string;
    admission_date: Date;
    recent_ward: number;
  };
</script>

<ISelect
  endpoint="/api/patients/"
  type="text"
  id="name"
  name="patient_name"
  autocomplete="off"
  autofocus
>
  {#snippet optionSnippet(patient: PatientT)}
    <PatientButton
      {patient}
      onclick={() => {
        goto(`/patient/${patient.id}`);
      }}
    />
    <!-- todo: color on discharged -->
  {/snippet}
</ISelect>
