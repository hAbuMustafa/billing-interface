<script>
  let { status, error } = $props();
</script>

<div class="error-page-wrapper" dir="auto" style="text-align: center; font-size:4rem;">
  <h1>{status}</h1>
  <p>{error?.message}</p>
</div>
