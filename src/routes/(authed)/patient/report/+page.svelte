<script lang="ts">
  import { goto } from '$app/navigation';
  import Sheet from '$lib/components/Sheet/Sheet.svelte';
  import { getTermed } from '$lib/utils/date-format.js';

  let { data } = $props();
  let patientsByWard = Object.groupBy(
    data.patients,
    (p: Record<string, any>) => p.recent_ward
  );
</script>

{#each Object.keys(patientsByWard) as ward_id, i (i)}
  {#if patientsByWard[ward_id]}
    <h2>
      <span>
        {data.wards.find((w) => w.id === Number(ward_id))?.name}
      </span>
      <span>
        ({getTermed(patientsByWard[ward_id].length, 'مريض', 'مرضى')})
      </span>
    </h2>
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
        discharge: 'خروج',
        transfer: 'تحويل',
      }}
      actionColumns={{
        transfer: {
          actionName: 'تحويل',
          onclick: function (p: any) {
            goto(`/patient/transfer?patientId=${p.id}`);
          },
          style: {
            color: 'var(--main-bg-color)',
            backgroundColor: 'orange',
          },
        },
        discharge: {
          actionName: 'خروج',
          onclick: function (p: any) {
            goto(`/patient/discharge?patientId=${p.id}`);
          },
          style: {
            backgroundColor: 'light-dark(salmon, maroon)',
          },
        },
      }}
      detailsColumn={{
        id: (p: any) => `/patient/${p.id}`,
      }}
    />
  {/if}
{/each}

<style>
  h2 {
    display: flex;
    justify-content: space-around;
  }
</style>
