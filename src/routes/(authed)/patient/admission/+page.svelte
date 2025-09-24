<script lang="ts">
  import { page } from '$app/state';
  import { formatDate } from '$lib/utils/date-format';

  let idDocType = 5;
  let gender = 1;
  let healthInsurance = 1;
</script>

<main>
  <form method="POST">
    <label for="name"> اسم المريض </label>
    <input name="name" id="name" type="text" />

    <fieldset>
      <legend>نوع الهوية</legend>
      {#each page.data.id_doc_type_list as d_type, i (d_type.id)}
        <input
          name="id_doc_type"
          id="id_doc_type_{i}"
          type="radio"
          value={d_type.id}
          bind:group={idDocType}
        />
        <label for="id_doc_type_{i}">{d_type.name}</label>
      {/each}
    </fieldset>

    <label for="id_doc_num">رقم الهوية</label>
    <input name="id_doc_num" id="id_doc_num" type="text" placeholder="22222222222222" />

    <label for="diagnosis">التشخيص الأولي</label>
    <input name="diagnosis" id="diagnosis" type="text" />

    <fieldset>
      <legend>النوع</legend>
      <input name="gender" id="male" type="radio" value={1} bind:group={gender} />
      <label for="male">ذكر</label>
      <input name="gender" id="female" type="radio" value={0} bind:group={gender} />
      <label for="female">أنثى</label>
    </fieldset>

    <label for="birthdate">تاريخ الميلاد</label>
    <input name="birthdate" id="birthdate" type="date" />

    <fieldset>
      <legend>التأمين الصحي</legend>
      <input
        name="health_insurance"
        id="insured"
        type="radio"
        value={1}
        bind:group={healthInsurance}
      />
      <label for="insured">مؤمن عليه</label>
      <input
        name="health_insurance"
        id="uninsured"
        type="radio"
        value={0}
        bind:group={healthInsurance}
      />
      <label for="insured">غير مؤمن عليه</label>
    </fieldset>

    <label for="admission_ward">قسم الدخول</label>
    <select name="admission_ward" id="admission_ward">
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
    />
  </form>
</main>

<style>
  form {
    display: flex;
    flex-direction: column;

    fieldset {
      margin-block-start: 1rem;
    }

    input:is([type='text'], [type*='date']) {
      font-size: 1.5rem;
    }

    input[type='radio'] {
      margin-inline-end: 1rem;
    }
  }
</style>
