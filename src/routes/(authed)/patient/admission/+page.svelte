<script lang="ts">
  import { page } from '$app/state';
</script>

<main>
  <form method="POST">
    <label for="name"> اسم المريض </label>
    <input name="name" id="name" type="text" />

    <label for="id_doc_type">نوع الهوية</label>
    <select name="id_doc_type" id="id_doc_type">
      {#each page.data.id_doc_type_list as d_type (d_type.id)}
        <option value={d_type.id}>{d_type.name}</option>
      {/each}
    </select>

    <label for="id_doc_num">رقم الهوية</label>
    <input name="id_doc_num" id="id_doc_num" type="text" />

    <label for="diagnosis">التشخيص الأولي</label>
    <input name="diagnosis" id="diagnosis" type="text" />

    <input name="gender" id="male" type="radio" value="male" />
    <label for="male">ذكر</label>
    <input name="gender" id="female" type="radio" value="female" />
    <label for="female">أنثى</label>

    <label for="birthdate">تاريخ الميلاد</label>
    <input name="birthdate" id="birthdate" type="date" />

    <input name="health_insurance" id="insured" type="radio" value={1} />
    <label for="insured">مؤمن عليه</label>
    <input name="health_insurance" id="uninsured" type="radio" value={0} />
    <label for="insured">غير مؤمن عليه</label>

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
  </form>
</main>
