<script lang="ts">
  import { page } from '$app/state';
  import { arabicTetradicNamesPattern, nationalIdPattern } from '$lib/stores/patterns';
  import { formatDate } from '$lib/utils/date-format';
  import { scale } from 'svelte/transition';
  import ISelect from '$lib/components/Forms/iSelect.svelte';
  import PersonButton from '$lib/components/Forms/PersonButton.svelte';
  import type { People } from '$lib/server/db/schema';

  type FetchedPersonT = typeof People.$inferSelect;

  let patientName = $state('');
  let idDocType = $state(1);
  let idDocNum = $state('');
  let isNationalId = $derived(idDocType === 1 && nationalIdPattern.test(idDocNum));
  let gender = $derived.by(() => {
    if (isNationalId) {
      return Number(idDocNum.slice(12, 13)) % 2 ? 1 : 0;
    }
  });
  let birthdate = $derived.by(() => {
    if (isNationalId) {
      const modifier = idDocNum[0];
      const year = (modifier === '2' ? '19' : '20') + idDocNum.slice(1, 3);
      const month = idDocNum.slice(3, 5);
      const day = idDocNum.slice(5, 7);

      return [year, month, day].join('-');
    }
  });
  let healthInsurance = $state(0);

  let diagnoses = $state<string[]>([]);
  let diagnosisText = $state('');

  let hasSelectedPerson = $state(false);

  function selectPerson(person: FetchedPersonT) {
    hasSelectedPerson = true;

    patientName = person.name;

    idDocType = person.id_doc_type ?? 1;

    idDocNum = person.id_doc_num ?? '';

    if (person.gender) {
      gender = Number(person.gender);
    }

    if (person.health_insurance) {
      healthInsurance = Number(person.health_insurance);
    }
  }
</script>

<form method="POST">
  <label for="medical_number">الرقم الطبي</label>
  <input
    type="number"
    name="medical_number"
    id="medical_number"
    placeholder={page.data.nextMedicalNumber}
    required
  />

  <label for="name"> اسم المريض </label>
  <ISelect
    endpoint="/api/people/"
    name="name"
    id="name"
    bind:done={hasSelectedPerson}
    bind:value={patientName}
    pattern={arabicTetradicNamesPattern.source}
    disabled={hasSelectedPerson}
    style="font-size:1.5rem;"
    required
  >
    {#snippet optionSnippet(person: FetchedPersonT)}
      <PersonButton {person} onclick={() => selectPerson(person)} />
    {/snippet}
  </ISelect>

  <fieldset disabled={hasSelectedPerson}>
    <legend>نوع الهوية</legend>
    {#each page.data.id_doc_type_list as d_type, i (d_type.id)}
      <input
        name="id_doc_type"
        id="id_doc_type_{i}"
        type="radio"
        value={d_type.id}
        bind:group={idDocType}
        required
      />
      <label for="id_doc_type_{i}">{d_type.name}</label>
    {/each}
  </fieldset>

  <label for="id_doc_num">رقم الهوية</label>
  <input
    name="id_doc_num"
    id="id_doc_num"
    type="text"
    placeholder="22222222222222"
    bind:value={idDocNum}
    pattern={nationalIdPattern.source}
    disabled={hasSelectedPerson}
    required
  />

  <fieldset disabled={hasSelectedPerson}>
    <legend>النوع</legend>
    <input name="gender" id="male" type="radio" value={1} bind:group={gender} required />
    <label for="male">ذكر</label>
    <input
      name="gender"
      id="female"
      type="radio"
      value={0}
      bind:group={gender}
      required
    />
    <label for="female">أنثى</label>
  </fieldset>

  <label for="birthdate">تاريخ الميلاد</label>
  <input
    name="birthdate"
    id="birthdate"
    type="date"
    bind:value={birthdate}
    disabled={hasSelectedPerson}
    required
  />

  <fieldset disabled={hasSelectedPerson}>
    <legend>التأمين الصحي</legend>
    <input
      name="health_insurance"
      id="insured"
      type="radio"
      value={1}
      bind:group={healthInsurance}
      required
    />
    <label for="insured">مؤمن عليه</label>

    <input
      name="health_insurance"
      id="uninsured"
      type="radio"
      value={0}
      bind:group={healthInsurance}
      required
    />
    <label for="uninsured">غير مؤمن عليه</label>
  </fieldset>

  <hr style="width: 100%; margin-block-start: 2rem;" />

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
            required
          />
          <label for="admission_ward_{ward.id}">{ward.name}</label>
        {/each}
      </fieldset>
    {/each}
  </fieldset>

  <label for="admission_date">وقت وتاريخ الدخول</label>
  <input
    type="datetime-local"
    name="admission_date"
    id="admission_date"
    defaultValue={formatDate(new Date(), 'YYYY-MM-DDTHH:mm')}
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

    input:is([type='text'], [type*='date'], [type='number']) {
      font-size: 1.5rem;
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
