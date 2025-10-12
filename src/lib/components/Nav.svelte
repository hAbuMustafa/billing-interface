<script>
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
      <li>
        <input type="checkbox" id="patients-nav-list" />
        <label for="patients-nav-list">المرضى</label>

        <ul>
          <li><a href="/patient/admission">تسجيل حالة دخول</a></li>
          <li><a href="/patient/discharge">تسجيل خروج مريض</a></li>
          <li><a href="/patient/transfer">تحويل مريض إلى قسم</a></li>
        </ul>
      </li>
      <li><a href="/patient-search">تسعير فاتورة</a></li>
    </ul>
    <ul>
      <li><a href="/account">الحساب</a></li>
      <li><a href="/logout">تسجيل الخروج</a></li>
      <li>
        <img
          class="gravatar"
          src={'/api/proxy-images/?url=' + user.gravatar}
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

  li:is(:hover, :focus) {
    background-color: hsl(from var(--main-bg-color) h s 50%);
  }

  nav > ul {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    align-items: center;
  }

  nav a:focus {
    outline: 2px solid;
    outline-offset: 0.5rem;
    border-radius: 0.25rem;
  }

  li:has(ul) {
    position: relative;

    & > input {
      display: none;
    }

    &::after {
      content: '▼';
      font-size: 0.7rem;
      margin-inline-start: 0.25rem;
      position: absolute;
      inset-block: 40%;
      height: fit-content;
    }

    ul {
      display: grid;
      grid-template-columns: 1fr;
      row-gap: 1rem;
      z-index: 1;
    }

    & > ul > li {
      display: flex;
      flex-direction: column;
    }
  }

  li > ul {
    visibility: hidden;

    list-style: none;
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 0;
    transform: translateY(-10px);

    padding: 1rem;

    background-color: var(--main-bg-color);
    border: var(--main-border);
    border-radius: 0.25rem;
    opacity: 0;
    box-shadow: black 10px 10px 25px;

    transition-property: position, opacity;
    transition-duration: 0.3s;
    transition-timing-function: ease;

    li {
      text-wrap: nowrap;
    }
  }

  li:has(:hover, :focus-within, :focus) > ul,
  li > ul:hover {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  .gravatar {
    border-radius: 50%;
  }
</style>
