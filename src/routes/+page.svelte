<script lang="ts">
  import { page } from '$app/state';
  import Sheet from '$lib/components/Sheet/Sheet.svelte';
</script>

<Sheet rows={page.data.table} />
