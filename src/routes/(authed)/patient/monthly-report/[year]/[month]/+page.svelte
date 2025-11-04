<script lang="ts">
  import { getDuration } from '$lib/utils/date-format';

  let { data } = $props();
</script>

{#if data.stats}
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
{/if}

<style>
  dl {
    display: grid;
    grid-template-columns: 2fr 1fr;
    max-width: 40%;
  }
</style>
