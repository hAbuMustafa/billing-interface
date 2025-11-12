<script lang="ts">
  import { page } from '$app/state';
  import { getDuration } from '$lib/utils/date-format';

  let { data } = $props();

  const { nextMonth, prevMonth, nextYear, prevYear } = $derived.by(() => {
    const currentMonth = Number(page.params.month);
    const currentYear = Number(page.params.year);

    return {
      nextMonth: currentMonth < 12 ? currentMonth + 1 : 1,
      prevMonth: currentMonth > 1 ? currentMonth - 1 : 12,
      nextYear: currentMonth < 12 ? currentYear : currentYear + 1,
      prevYear: currentMonth > 1 ? currentYear : currentYear - 1,
    };
  });
</script>

<nav aria-label="Month Navigation">
  <a class="button" href="/patient/monthly-report/{prevYear}/{prevMonth}"
    >&Lt; {prevMonth}/{prevYear}</a
  >
  <a class="button" href="/patient/monthly-report/{nextYear}/{nextMonth}"
    >{nextMonth}/{nextYear} &Gt;</a
  >
</nav>

{#if data.stats}
  {@const icuAdmissions = data.stats.transfers.filter(
    (t: any) => t.ward === 1 || t.ward === 2
  )}
  {@const icuDischarges = data.stats.discharges.filter(
    (d: any) => d.recent_ward === 1 || d.recent_ward === 2
  )}
  {@const transfersByPatient = Object.groupBy(
    data.stats.transfers,
    (t: any) => t.patient_id
  )}

  <h2>إحصائيات الدخول</h2>
  <dl>
    <dt>عدد حالات الدخول (ذكور):</dt>
    <dd>{data.stats.admissions.filter((p: any) => p.Person.gender).length}</dd>

    <dt>عدد حالات الدخول (إناث):</dt>
    <dd>{data.stats.admissions.filter((p: any) => !p.Person.gender).length}</dd>
  </dl>

  <dl>
    <dt>عدد حالات الدخول المنتفعين بالتأمين الصحي:</dt>
    <dd>{data.stats.admissions.filter((p: any) => p.health_insurance).length}</dd>

    <dt>غير المصريين:</dt>
    <dd>{data.stats.admissions.filter((p: any) => p.Person.id_doc_type !== 1).length}</dd>
  </dl>

  <dl>
    <dt><strong>إجمالي حالات الدخول:</strong></dt>
    <dd>{data.stats.admissions.length}</dd>
  </dl>

  <h2>إحصائيات الخروج</h2>
  <dl>
    <dt>عدد حالات الخروج (ذكور):</dt>
    <dd>{data.stats.discharges.filter((p: any) => p.Person.gender).length}</dd>

    <dt>عدد حالات الخروج (إناث):</dt>
    <dd>{data.stats.discharges.filter((p: any) => !p.Person.gender).length}</dd>
  </dl>

  <dl>
    <dt>إجمالي مدة الإقامة لحالات الخروج:</dt>
    <dd>
      {data.stats.discharges.reduce(
        (total: number, currentPatient: any) =>
          total +
          getDuration(currentPatient.admission_date, currentPatient.discharge_date),
        0
      )}
    </dd>
  </dl>

  <dl>
    <dt><strong>إجمالي حالات الخروج:</strong></dt>
    <dd>{data.stats.discharges.length}</dd>
  </dl>

  <h2>إحصائيات الرعاية المركزة</h2>
  <dl>
    <dt>إجمالي حالات دخول الرعاية المركزة:</dt>
    <dd>{icuAdmissions.length}</dd>
    <dt>إجمالي حالات الدخول عن طريق الاستقبال:</dt>
    <dd>
      {icuAdmissions.filter(
        (t: any) =>
          t.notes?.includes('admission') && t.Patient.referred_from?.includes('reception')
      ).length}
    </dd>
    <dt>إجمالي حالات الدخول عن طريق الأقسام الداخلية:</dt>
    <dd>{icuAdmissions.filter((t: any) => !t.notes?.includes('admission')).length}</dd>
    <dt>إجمالي حالات الدخول عن طريق تنسيق المديرية:</dt>
    <dd>
      {icuAdmissions.filter(
        (t: any) =>
          t.notes?.includes('admission') &&
          t.Patient.referred_from &&
          !t.Patient.referred_from.includes('reception')
      ).length}
    </dd>
  </dl>

  <dl>
    {#each Object.keys(Object.groupBy(icuDischarges, (pat: any) => pat.Patient_discharge_reason.name)) as dischargeReason, i (i)}
      <dt>حالات الخروج {dischargeReason}:</dt>
      <dd>
        {icuDischarges.filter(
          (d: any) => d.Patient_discharge_reason.name === dischargeReason
        ).length}
      </dd>
    {/each}
    <dt>حالات التحويل من الرعاية للأقسام الداخلية:</dt>
    <dd>
      {Object.keys(transfersByPatient).reduce((acc, currPatientId) => {
        if (
          transfersByPatient[currPatientId]?.some(
            (transObject: any, indx: number) =>
              (transObject.ward === 1 || transObject.ward === 2) &&
              indx < transfersByPatient[currPatientId]!.length - 1
          )
        ) {
          return acc + 1;
        }
        return acc;
      }, 0)}
    </dd>
  </dl>
{/if}

<style>
  nav {
    display: flex;
    justify-content: space-between;
  }

  dl {
    display: grid;
    grid-template-columns: 2fr 1fr;
    max-width: 40%;
  }
</style>
