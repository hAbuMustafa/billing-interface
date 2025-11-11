<script lang="ts">
  import Picker from '$lib/components/Forms/Picker.svelte';
  import { arabicTriadicNamesPattern, nationalIdPattern } from '$lib/stores/patterns';

  const { data } = $props();

  let patientName = $state(data.person.name ?? '');
  let idDocType = $state(data.person.id_doc_type ? Number(data.person.id_doc_type) : 1);
  let idDocNum = $state(data.person.id_doc_num ?? '');
  let isNationalId = $derived(idDocType === 1 && nationalIdPattern.test(idDocNum));
  let gender = $derived.by(() => {
    if (isNationalId) {
      return Number(idDocNum.slice(12, 13)) % 2 ? 1 : 0;
    }
    return data.person.gender ? Number(data.person.gender) : null;
  });
  let birthdate = $derived.by(() => {
    if (isNationalId) {
      const modifier = idDocNum[0];
      const year = (modifier === '2' ? '19' : '20') + idDocNum.slice(1, 3);
      const month = idDocNum.slice(3, 5);
      const day = idDocNum.slice(5, 7);

      return [year, month, day].join('-');
    }
    return data.person.birthdate;
  });
</script>

<form method="POST" class="flex-form">
  <div class="input-pair">
    <label for="name"> اسم المريض </label>
    <input
      type="text"
      name="name"
      id="name"
      bind:value={patientName}
      pattern={arabicTriadicNamesPattern.source}
      autocomplete="off"
      required
    />
  </div>

  <Picker
    label="نوع الهوية"
    name="id_doc_type"
    options={data.id_doc_type_list}
    bind:value={idDocType}
  />

  <div class="input-pair">
    <label for="id_doc_num">رقم الهوية</label>
    <input
      name="id_doc_num"
      id="id_doc_num"
      type="text"
      bind:value={idDocNum}
      pattern={idDocType === 1 ? nationalIdPattern.source : null}
      required={idDocType !== 6}
      disabled={idDocType === 6}
    />
  </div>

  <Picker
    name="gender"
    label="النوع"
    options={[
      { id: 1, name: 'ذكر' },
      { id: 0, name: 'أنثى' },
    ]}
    bind:value={gender}
  />

  <div class="input-pair">
    <label for="birthdate">تاريخ الميلاد</label>
    <input name="birthdate" id="birthdate" type="date" bind:value={birthdate} required />
  </div>

  <input type="submit" value="تعديل" />
</form>
