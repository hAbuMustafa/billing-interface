<script lang="ts">
  import { page } from '$app/state';
  import { arabicTetradicNamesPattern, nationalIdPattern } from '$lib/stores/patterns';
  import { formatDate, getAge } from '$lib/utils/date-format';

  let idDocType = $state(1);
  let idDocNum = $state('');
  let isNationalId = $derived(idDocType === 1 && idDocNum.length === 14);
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

  let personNameText = $state('');
  let personNameQuery = $state('');

  let fetchedPeople = $derived(getPeopleByName(personNameQuery) || []);

  async function getPeopleByName(
    personName: string
  ): Promise<{ id: number; name: string; national_id: string; birthdate?: number }[]> {
    if (personName.trim() === '') return [];

    const response = await fetch(`/api/people/?q=${personName}`);

    return await response.json();
  }
</script>

{#if page.url.searchParams.has('pId') && page.data.person}
  <form method="POST" action="?/admitPatient">
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
      <input
        name="gender"
        id="male"
        type="radio"
        value={1}
        bind:group={gender}
        required
      />
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

    <label for="admission_ward">قسم الدخول</label>
    <select name="admission_ward" id="admission_ward" required>
      {#each [{ number: 1, title: 'الرعاية المركزة' }, { number: 2, title: 'الدور الثاني' }, { number: 3, title: 'الدور الثالث' }, { number: 4, title: 'الدور الرابع' }] as floor (floor.number)}
        <optgroup label={floor.title}>
          {#each page.data.wards_list.filter((w: { id: number; floor: number; name: string }) => w.floor === floor.number) as ward (ward.id)}
            <option value={ward.id}>{ward.name}</option>
          {/each}
        </optgroup>
      {/each}
    </select>

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
{:else}
  <form
    onsubmit={(e) => {
      e.preventDefault();
      personNameQuery = personNameText;
    }}
  >
    <label for="person_name_query">اسم المريض</label>
    <input
      type="search"
      name="person_name_query"
      id="person_name_query"
      autocomplete="off"
      bind:value={personNameText}
    />

    <input type="submit" value="بحث" />

    {#await fetchedPeople}
      <p>جار البحث...</p>
    {:then foundPeople}
      <div class="person-results">
        {#each foundPeople as person, i (person.id)}
          <button class="person-card">
            <strong>{person.name}</strong><br />
            <span class="faded">{person.national_id}</span>
            {#if person.birthdate}
              <span class="birthdate">
                {formatDate(new Date(person.birthdate), 'YYYY/MM/DD')}
                ({getAge(person.birthdate)} سنة)
              </span>
            {/if}
          </button>
        {/each}
      </div>
    {/await}
  </form>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;

    fieldset {
      margin-block-start: 1rem;
    }

    input:is([type='text'], [type*='date'], [type='search']),
    select {
      font-size: 1.5rem;
    }

    input[type='radio'] {
      margin-inline-end: 1rem;
    }

    input[type='submit'] {
      margin-block-start: 2rem;
      padding-block: 0.5rem;
    }
  }

  .person-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-block-start: 1rem;

    .person-card {
      display: flex;
      flex-direction: column;
      width: 50%;

      .faded {
        opacity: 0.7;
      }
    }
  }
</style>
