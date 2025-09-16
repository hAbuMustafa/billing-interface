<script lang="ts">
  import { PUBLIC_invoice_spreadsheetId } from '$env/static/public';

  import Sheet from '$lib/components/Sheet/Sheet.svelte';
  // import { getData } from '$lib/utils/request';
</script>

<!-- {#await getData(PUBLIC_invoice_spreadsheetId, 'Names!C:M', 'اسم المريض', 'عبود')}
  <p>جاري تحميل بيانات المرضى...</p>
{:then patients}
  {#if patients.rows}
    <Sheet
      rows={patients.rows}
      dateColumns={['تاريخ الدخول', { name: 'تاريخ الخروج', format: 'YYYY/MM/DD' }]}
    />
  {:else if patients.error}
    <p>حدث مصيبة ما: <br />{patients.error}</p>
  {:else}
    <p>لا يوجد مرضى في قاعدة البيانات</p>
  {/if}
{:catch error}
  <p>حدث عطل ما: <br />{error.message}</p>
{/await} -->
