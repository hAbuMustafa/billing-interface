<script lang="ts">
  import Sheet from '$lib/components/Sheet/Sheet.svelte';
</script>

<Sheet
  rows={[
    { id: 1, name: 'blah blah blah', at: new Date() },
    { id: 2, error: 'dammit' },
  ]}
  dateColumns={[{ name: 'at', format: 'YYYY/M/DD' }]}
  renameColumns={{ at: 'متى', error: 'خطأ', Unlisted: 'عجبا' }}
/>
