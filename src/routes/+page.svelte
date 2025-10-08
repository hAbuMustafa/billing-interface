<script lang="ts">
  import Sheet from '$lib/components/Sheet/Sheet.svelte';
</script>

<Sheet
  rows={[
    { id: 1, name: 'blah blah blah', at: new Date('2025-07-02') },
    { id: 2, error: 'dammit', time: new Date() },
  ]}
  dateColumns={{ at: 'YYYY/MM/DD', time: undefined }}
  renameColumns={{ at: 'متى', error: 'خطأ', Unlisted: 'عجبا' }}
/>
