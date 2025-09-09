<script>
  import { page } from '$app/state';
</script>

<div class="error-page-wrapper" dir="auto" style="text-align: center; font-size:4rem;">
  <h1>{page.status}</h1>
  <p>{page.error?.message}</p>
</div>
