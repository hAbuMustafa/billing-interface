<script lang="ts">
  import { page } from '$app/state';
  import { arabicTetradicNamesPattern, nationalIdPattern } from '$lib/stores/patterns';
  import { formatDate } from '$lib/utils/date-format';

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
</script>

<form method="POST">
  <label for="name"> اسم المريض </label>
  <input
    name="name"
    id="name"
    type="text"
    pattern={arabicTetradicNamesPattern.source}
    required
  />

  <fieldset>
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
    required
  />

  <label for="diagnosis">التشخيص الأولي</label>
  <input name="diagnosis" id="diagnosis" type="text" />
  <!-- todo: make this input a form with no bubbling on submit, and create a list of  input:check with name="diagnosis" as the output of this form -->

  <fieldset>
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
  <input name="birthdate" id="birthdate" type="date" bind:value={birthdate} required />

  <fieldset>
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
    <label for="insured">غير مؤمن عليه</label>
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

    input:is([type='text'], [type*='date']) {
      font-size: 1.5rem;
    }

    input[type='radio']:not(:first-of-type) {
      margin-inline-start: 1.5rem;
    }

    input:is([type='submit']) {
      margin-block-start: 2rem;
      padding-block: 0.5rem;
    }

    input[type='radio'] {
      display: none;

      & + label {
        background-color: lightslategray;
        color: var(--main-bg-color);
        padding: 0.25rem 0.5rem;
        text-align: center;
        text-wrap: nowrap;

        border-radius: 0.25rem;
      }

      &:checked + label {
        background-color: royalblue;
        font-weight: 700;
        color: unset;
      }
    }
  }
</style>
