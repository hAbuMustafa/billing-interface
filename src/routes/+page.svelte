<script lang="ts">
  import { page } from '$app/state';
  import Sheet from '$lib/components/Sheet/Sheet.svelte';
</script>

<Sheet
  rows={page.data.patients}
  dateColumns={[
    'admission_date',
    { name: 'dismissal_date', format: 'YYYY/MM/DD' },
    'birthdate',
  ]}
/>
