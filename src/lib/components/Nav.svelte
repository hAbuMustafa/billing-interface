<script>
  import { getGravatarHash } from '$lib/utils/gravatar';

  const { user } = $props();
</script>

<nav>
  <a href="/">
    <img
      src="/favicon.png"
      alt="مستشفى 23 يوليو للأمراض الصدرية: نظام إصدار فواتير المرضى"
      width="80"
    />
  </a>
  {#if user}
    <ul>
      <li><a href="/patient-search">تسعير فاتورة</a></li>
    </ul>
    <ul>
      <li><a href="/account">الحساب</a></li>
      <li><a href="/logout">تسجيل الخروج</a></li>
      <li>
        <img
          class="gravatar"
          src={`https://0.gravatar.com/avatar/${getGravatarHash(user.email ?? 'default')}`}
          alt={`صورة حساب ${user.name}`}
          width="40px"
          height="40px"
        />
      </li>
    </ul>
  {:else}
    <ul>
      <li><a href="/register">إنشاء حساب</a></li>
      <li><a href="/login">تسجيل الدخول</a></li>
    </ul>
  {/if}
</nav>

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: light-dark(
      hsl(from var(--main-bg-color) h s 80%),
      hsl(from var(--main-bg-color) h s 20%)
    );
  }

  nav,
  a {
    color: light-dark(
      hsl(from var(--main-text-color) h s 20%),
      hsl(from var(--main-text-color) h s 80%)
    );
    font-size: 1.1rem;
    text-decoration: none;
  }

  a:hover {
    text-decoration: overline underline;
  }

  nav > ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    align-items: center;
  }

  .gravatar {
    border-radius: 50%;
  }
</style>
