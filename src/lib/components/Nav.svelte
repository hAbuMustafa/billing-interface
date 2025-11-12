<script>
  const { user } = $props();
</script>

<nav>
  <a href="/">
    <img src="/favicon.png" alt="مستشفى 23 يوليو للأمراض الصدرية" width="80" />
  </a>
  {#if user}
    <ul>
      <li>
        <span>المرضى</span>

        <ul>
          <li><a href="/patient/admission">تسجيل حالة دخول</a></li>
          <li><a href="/patient/discharge">تسجيل خروج مريض</a></li>
          <li><a href="/patient/transfer">تحويل مريض إلى قسم</a></li>
          <hr />
          <li><a href="/patient/">استعلام عن مريض</a></li>
          <li><a href="/patient/report">تقرير المرضى بالأقسام</a></li>
          <hr />
          <li><a href="/patient/occupation-report">بيان الإشغال</a></li>
          <li>
            <a href="/patient/monthly-report"> تقرير الإشغال الشهري </a>
          </li>
        </ul>
      </li>

      <li>
        <span>الصيدلية</span>

        <ul>
          <li><a href="/pharmacy/dispense">صرف لمريض</a></li>
          <li><a href="/pharmacy/return">مرتجع مريض</a></li>
          <li><a href="/pharmacy/manual-bill">تسعير فاتورة لمريض</a></li>
          <hr />
          <li>
            <a href="/pharmacy/antibiotics-report">إحصائية المضادات الحيوية</a>
          </li>
          <li><a href="/pharmacy/daily-report">المنصرف اليومي</a></li>
        </ul>
      </li>

      <li>
        <span>المخزون</span>

        <ul>
          <li><a href="/stock/dispense">صرف لجهة</a></li>
          <li><a href="/stock/receive">استلام طلبية</a></li>
          <hr />
          <li><a href="/stock/edit-stock">تعديل أرصدة</a></li>
          <li><a href="/stock/stock-report">تقرير المخزون</a></li>
        </ul>
      </li>
    </ul>
    <ul>
      <li>
        <img
          class="gravatar"
          src={'/api/proxy-images/?url=' + user.gravatar}
          alt={`صورة حساب ${user.name}`}
          width="40px"
          height="40px"
        />

        <ul>
          <li><a href="/account">الحساب</a></li>
          <li><a href="/logout">تسجيل الخروج</a></li>
        </ul>
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

  li:is(:hover, :focus, :focus-within):not(:has(.gravatar)) {
    background-color: hsl(from var(--main-bg-color) h s 50%);
  }

  nav > ul {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    align-items: center;

    li {
      border-radius: 0.25rem;
      padding: 0.25rem 0.2rem;
    }
  }

  nav a:focus {
    outline: 2px solid;
    outline-offset: 0.5rem;
    border-radius: 0.25rem;
  }

  li:has(ul) {
    position: relative;

    &:not(:has(.gravatar))::after {
      content: '▼';
      font-size: 0.7rem;
      margin-inline-start: 0.25rem;
      position: absolute;
      inset-block: 40%;
      height: fit-content;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      z-index: 1;

      hr {
        margin-block: 0;
        width: 100%;
      }
    }

    & > ul > li {
      display: flex;
      flex-direction: column;
    }
  }

  li > ul {
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
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;

    pointer-events: none;

    li {
      text-wrap: nowrap;
    }
  }

  li:has(.gravatar) ul {
    inset-inline-start: -200%;
  }

  li:has(:hover, :focus-within, :focus) > ul,
  li > ul:has(:hover, :focus-within, :focus) {
    opacity: 1;
    pointer-events: all;
  }

  .gravatar {
    border-radius: 50%;
  }
</style>
