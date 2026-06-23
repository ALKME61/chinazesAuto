<script setup lang="ts">
const route = useRoute()

const navItems = [
  { label: 'Дашборд', icon: 'orders', to: '/admin' },
  { label: 'Клиенты', icon: 'clients', to: '/admin/clients' },
  { label: 'Финансы', icon: 'orders', to: '/admin/finance' },
  { label: 'Обращения', icon: 'message', to: '/admin/support' },
  { label: 'Уведомления', icon: 'bell', to: '/admin/notifications' },
  { label: 'Склад', icon: 'warehouse', to: '/admin/warehouse' },
  { label: 'ПВЗ', icon: 'store', to: '/admin/pvz' },
  { label: 'Наценки', icon: 'orders', to: '/admin/pricing' },
  { label: 'Настройки', icon: 'settings', to: '/admin/settings' },
]
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <NuxtLink to="/admin" class="admin-sidebar__logo" title="Панель администратора">
        <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип Чиназес-Авто" />
      </NuxtLink>

      <nav class="admin-sidebar__nav" aria-label="Навигация по админке">
        <AdminSidebarLink
          v-for="item in navItems"
          :key="item.to"
          :label="item.label"
          :icon="item.icon"
          :to="item.to"
          :active="item.to === '/admin' ? route.path === '/admin' : route.path.startsWith(item.to)"
        />
      </nav>
    </aside>

    <div class="admin-main">
      <header class="admin-header">
        <div class="admin-header__date">
          <AdminIcon name="calendar" :size="24" />
          <span>29 Февраля, 2026</span>
        </div>

        <div class="admin-header__controls">
          <label class="admin-search">
            <AdminIcon name="search" :size="19" />
            <input type="text" placeholder="Поиск">
          </label>

          <button type="button" class="admin-header__notification" aria-label="Уведомления">
            <AdminIcon name="bell" :size="22" />
            <span />
          </button>

          <div class="admin-header__divider" />

          <button type="button" class="admin-header__profile">
            <span>Иванов Иван Иванович</span>
            <AdminIcon name="chevron-down" :size="18" />
          </button>
        </div>
      </header>

      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  display: grid;
  grid-template-columns: 25.8rem minmax(0, 1fr);
  min-height: 100vh;
}

.admin-sidebar {
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding: 2.4rem 1.8rem 2.4rem;
  background: #fff;
  border-right: 1px solid #efefef;
}

.admin-sidebar__logo {
  display: inline-flex;
  width: fit-content;

  img {
    width: 22.8rem;
  }
}

.admin-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.admin-main {
  min-width: 0;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  min-height: 9.6rem;
  padding: 2.8rem 3.6rem 2.2rem 3rem;
  background: #fff;
  border-bottom: 1px solid #efefef;
}

.admin-header__date {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  color: #515151;
  font-size: 1.5rem;
}

.admin-header__controls {
  display: flex;
  align-items: center;
  gap: 1.8rem;
}

.admin-search {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 33rem;
  height: 4.2rem;
  padding: 0 1.4rem;
  border: 1px solid #d9d9d9;
  border-radius: 999px;
  color: #1d1d1d;

  input {
    width: 100%;
    background: transparent;
    border: 0;
    font-size: 1.45rem;
    color: #444;

    &::placeholder {
      color: #8f8f8f;
    }
  }
}

.admin-header__notification {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  background: transparent;
  border: 0;
  color: #454545;
  cursor: pointer;

  span {
    position: absolute;
    top: 0.55rem;
    right: 0.45rem;
    width: 0.7rem;
    height: 0.7rem;
    background: #ff4747;
    border: 2px solid #fff;
    border-radius: 50%;
  }
}

.admin-header__divider {
  width: 1px;
  height: 4.2rem;
  background: #e7e7e7;
}

.admin-header__profile {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: transparent;
  border: 0;
  color: #4d4d4d;
  font-size: 1.45rem;
  cursor: pointer;
}

.admin-content {
  padding: 2.4rem 2.6rem;
}
</style>
