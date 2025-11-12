<script lang="ts">
  import { goto } from '$app/navigation';
  import Sheet from '$lib/components/Sheet/Sheet.svelte';
  import { getTermed } from '$lib/utils/date-format';

  let { data } = $props();
  let patientsByWard = Object.groupBy(
    data.patients,
    (p: Record<string, any>) => p.recent_ward
  );
</script>

{#each Object.keys(patientsByWard) as ward_id, i (i)}
  {#if patientsByWard[ward_id]}
    {@const currWard = data.wards.find((w) => w.id === Number(ward_id))!}
    {@const wardOccupiedBeds = patientsByWard[ward_id].length}
    {@const wardOccupationRatio = wardOccupiedBeds / currWard.capacity}
    {@const progressColor =
      wardOccupationRatio < 0.5 ? 'green' : wardOccupationRatio < 0.8 ? 'orange' : 'red'}
    <h2 id={currWard.id.toString()}>
      <span>
        {currWard.name}
      </span>
      <span>
        {getTermed(wardOccupiedBeds, 'مريض', 'مرضى')}
        <progress value={wardOccupationRatio} style="accent-color: {progressColor};"
        ></progress>
        {getTermed(currWard.capacity, 'سرير', 'أسرَّة')}
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
