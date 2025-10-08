<script lang="ts">
  import { page } from '$app/state';
  import { arabicTriadicNamesPattern, nationalIdPattern } from '$lib/stores/patterns';
  import { formatDate } from '$lib/utils/date-format';
  import { scale } from 'svelte/transition';
  import ISelect from '$lib/components/Forms/iSelect.svelte';
  import PersonButton from '$lib/components/Forms/PersonButton.svelte';
  import type { People } from '$lib/server/db/schema';

  type FetchedPersonT = typeof People.$inferSelect;

  const { form } = $props();

  let medicalNumber = $state(form?.medicalNumber ?? '');
  let patientName = $state(form?.patientName ?? '');
  let idDocType = $state(form?.idDocType ? Number(form.idDocType) : 1);
  let idDocNum = $state(form?.idDocNum ?? '');
  let isNationalId = $derived(idDocType === 1 && nationalIdPattern.test(idDocNum));
  let gender = $derived.by(() => {
    if (isNationalId) {
      return Number(idDocNum.slice(12, 13)) % 2 ? 1 : 0;
    }
    return form?.gender ? Number(form.gender) : null;
  });
  let birthdate = $derived.by(() => {
    if (isNationalId) {
      const modifier = idDocNum[0];
      const year = (modifier === '2' ? '19' : '20') + idDocNum.slice(1, 3);
      const month = idDocNum.slice(3, 5);
      const day = idDocNum.slice(5, 7);

      return [year, month, day].join('-');
    }
    return form?.birthdate;
  });
  let healthInsurance = $state(form?.heathInsurance ? Number(form.heathInsurance) : 0);

  let returnedDiagnosesOnFormError = form?.diagnosis ? form.diagnosis : null;
  let diagnoses = $state<string[]>(returnedDiagnosesOnFormError ?? []);
  let diagnosisText = $state('');

  let admissionWard = $state(form?.admissionWard ? Number(form.admissionWard) : null);

  let admissionDate = $state(
    form?.admissionDate ?? formatDate(new Date(), 'YYYY-MM-DDTHH:mm')
  );

  let hasSelectedPerson = $state(!!form?.personId || false);
  let selectedPersonId = $state(0);

  function selectPerson(person: FetchedPersonT) {
    hasSelectedPerson = true;

    patientName = person.name;

    selectedPersonId = person.id;

    idDocType = person.id_doc_type ?? 1;

    idDocNum = person.id_doc_num ?? '';

    if (person.gender) {
      gender = Number(person.gender);
    }
  }
</script>

<form method="POST">
  <label for="medical_number">الرقم الطبي</label>
  <!-- svelte-ignore a11y_autofocus -->
  <input
    type="number"
    name="medical_number"
    id="medical_number"
    placeholder={page.data.nextMedicalNumber}
    autofocus
    bind:value={medicalNumber}
    required
  />

  <label for="name" class={hasSelectedPerson ? 'locked' : ''}> اسم المريض </label>
  <ISelect
    endpoint="/api/people/"
    name="name"
    type="text"
    id="name"
    bind:done={hasSelectedPerson}
    bind:value={patientName}
    pattern={arabicTriadicNamesPattern.source}
    readonly={hasSelectedPerson}
    onclear={() => {
      selectedPersonId = 0;
    }}
    autocomplete="off"
    required
  >
    {#snippet optionSnippet(person: FetchedPersonT)}
      <PersonButton {person} onclick={() => selectPerson(person)} />
    {/snippet}
  </ISelect>

  <!-- todo: extract a common picker component -->
  <fieldset class={hasSelectedPerson ? 'locked' : ''}>
    <legend>نوع الهوية</legend>
    <!-- TODO: make these navigable by 'tab' -->
    {#each page.data.id_doc_type_list as d_type, i (d_type.id)}
      <input
        id="id_doc_type_{i}"
        type="radio"
        value={d_type.id}
        bind:group={idDocType}
        disabled={hasSelectedPerson}
        required
      />
      <label for="id_doc_type_{i}">{d_type.name}</label>
    {/each}
    <input type="hidden" name="id_doc_type" bind:value={idDocType} />
  </fieldset>

  <label for="id_doc_num" class={hasSelectedPerson ? 'locked' : ''}>رقم الهوية</label>
  <input
    name="id_doc_num"
    id="id_doc_num"
    type="text"
    placeholder="22222222222222"
    bind:value={idDocNum}
    pattern={idDocType === 1 ? nationalIdPattern.source : null}
    readonly={hasSelectedPerson}
    required
  />

  <fieldset class={hasSelectedPerson ? 'locked' : ''}>
    <legend>النوع</legend>
    <input
      id="male"
      type="radio"
      value={1}
      bind:group={gender}
      disabled={hasSelectedPerson}
      required
    />
    <label for="male">ذكر</label>
    <input
      id="female"
      type="radio"
      value={0}
      bind:group={gender}
      disabled={hasSelectedPerson}
      required
    />
    <label for="female">أنثى</label>
    <input type="hidden" name="gender" bind:value={gender} />
  </fieldset>

  <label for="birthdate" class={hasSelectedPerson ? 'locked' : ''}>تاريخ الميلاد</label>
  <input
    name="birthdate"
    id="birthdate"
    type="date"
    bind:value={birthdate}
    readonly={hasSelectedPerson}
    required
  />

  <hr style="width: 100%; margin-block-start: 2rem;" />

  <input type="hidden" name="person_id" bind:value={selectedPersonId} />

  <fieldset class="diagnosis_box">
    <legend>التشخيص الأولي</legend>
    <input
      id="diagnosis"
      type="text"
      bind:value={diagnosisText}
      onkeydown={(e) => {
        if (e.key === 'Enter' && diagnosisText.length > 2) {
          e.preventDefault();
          e.stopPropagation();

          diagnoses.push(diagnosisText.trim());
          diagnosisText = '';
        }
      }}
      required={diagnoses.length === 0 ? true : null}
      list="diagnosis_suggestions"
    />

    <datalist id="diagnosis_suggestions">
      {#each page.data.diagnoses_list as d, i (i)}
        <option value={d}></option>
      {/each}
    </datalist>

    {#if diagnoses.length}
      <div class="diagnoses_list" transition:scale>
        {#each diagnoses as diagnosis, i (diagnosis)}
          <input
            type="checkbox"
            name="diagnosis"
            id="diagnosis_{i}"
            value={diagnosis}
            checked
            required
            onchange={() => {
              diagnoses = diagnoses.filter((item) => item !== diagnosis);
            }}
          />
          <label for="diagnosis_{i}" transition:scale>{diagnosis}</label>
        {/each}
      </div>
    {/if}
  </fieldset>

  <fieldset>
    <legend>قسم الدخول</legend>
    {#each page.data.floors_list as floor (floor.number)}
      <fieldset class={floor.title}>
        {#each page.data.wards_list.filter((w: { id: number; floor: number; name: string }) => w.floor === floor.number) as ward (ward.id)}
          <input
            type="radio"
            id="admission_ward_{ward.id}"
            name="admission_ward"
            value={ward.id}
            bind:group={admissionWard}
            required
          />
          <label for="admission_ward_{ward.id}">{ward.name}</label>
        {/each}
      </fieldset>
    {/each}
  </fieldset>

  <fieldset>
    <legend>التأمين الصحي</legend>
    <input id="insured" type="radio" value={1} bind:group={healthInsurance} required />
    <label for="insured">مؤمن عليه</label>

    <input id="uninsured" type="radio" value={0} bind:group={healthInsurance} required />
    <label for="uninsured">غير مؤمن عليه</label>

    <input type="hidden" name="health_insurance" bind:value={healthInsurance} />
  </fieldset>

  <label for="admission_date">وقت وتاريخ الدخول</label>
  <input
    type="datetime-local"
    name="admission_date"
    id="admission_date"
    bind:value={admissionDate}
    required
  />

  <input type="submit" value="تسجيل" />
</form>

<style>
  form {
    display: flex;
    flex-direction: column;

    fieldset {
      margin-block-start: 1rem;

      &:has(> [type='radio'] + label) {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;

        justify-content: center;
      }

      &.diagnosis_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        & > .diagnoses_list {
          display: flex;
          gap: 1rem;

          & :checked + label {
            background-color: orange;
            color: var(--main-bg-color);

            &:hover,
            &:focus {
              background-color: salmon;
              text-decoration: line-through;
            }
          }
        }
      }

      & > fieldset {
        margin-block-start: unset;

        border: none;
        border-radius: unset;

        &:first-of-type {
          padding-block-start: unset;
        }

        &:not(:last-of-type) {
          border-block-end: 1px solid;
        }
      }
    }

    input[type='radio']:not(:first-of-type) {
      margin-inline-start: 1.5rem;
    }

    input[type='submit'] {
      margin-block-start: 2rem;
      padding-block: 0.5rem;
    }
  }
</style>
