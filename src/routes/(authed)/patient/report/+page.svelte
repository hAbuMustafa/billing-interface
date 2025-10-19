<script lang="ts">
  import Sheet from '$lib/components/Sheet/Sheet.svelte';

  let { data } = $props();
  let patientsByWard = Object.groupBy(
    data.patients,
    (p: Record<string, any>) => p.recent_ward
  );
</script>

{#each Object.keys(patientsByWard) as ward_id, i (i)}
  <h2>{data.wards.find((w) => w.id === Number(ward_id))?.name}</h2>
  <Sheet
    rows={patientsByWard[ward_id]!.map((p) => {
      const { recent_ward, ...rest } = p;
      return rest;
    })}
    dateColumns={{ admission_date: 'YYYY/MM/DD' }}
    renameColumns={{
      admission_date: 'تاريخ الدخول',
      id: 'رقم القيد',
      name: 'اسم المريض',
      recent_ward: 'القسم الحالي',
      diagnosis: 'التشخيص',
    }}
  />
  <!-- todo: add action column to have buttons that take you to pages or display modals (execute custom functions) -->
{/each}
