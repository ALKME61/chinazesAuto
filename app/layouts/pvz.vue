<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'

const route = useRoute()

const mainNav = [
  { label: 'Выдача', to: '/pvz/issue' },
  { label: 'Приёмка', to: '/pvz/acceptance' },
  { label: 'Возврат', to: '/pvz/returns' },
  { label: 'Перемещение товара', to: '/pvz/shipment' },
  { label: 'История смены', to: '/pvz/history' },
]

type SidebarItem = {
  label: string
  to: string
  icon?: string
}

const sidebarItems = computed<SidebarItem[]>(() => {
  const items = route.meta.pvzSidebar as SidebarItem[] | undefined
  return items ?? []
})

const isActive = (target: string) => {
  const url = new URL(target, 'https://pvz.local')

  if (route.path !== url.pathname) {
    return false
  }

  const params = [...url.searchParams.entries()]

  if (!params.length) {
    return route.path === target || route.fullPath === target || route.path === url.pathname
  }

  return params.every(([key, value]) => route.query[key] === value)
}
</script>

<template>
  <div class="pvz-layout">
    <aside class="pvz-layout__sidebar">
      <NuxtLink to="/pvz/issue" class="pvz-layout__logo">
        <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="ЧиназесАвто" />
      </NuxtLink>

      <nav v-if="sidebarItems.length" class="pvz-layout__rail" aria-label="Навигация по разделу">
        <NuxtLink
          v-for="item in sidebarItems"
          :key="item.to"
          class="pvz-layout__rail-item"
          :class="{ 'pvz-layout__rail-item--active': false }"
          :to="item.to"
        >
          <PvzIcon :name="item.icon || 'qr'" :size="22" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="pvz-layout__operator">
        <div>
          <span>Смена</span>
          <strong>Алексей Курбатов</strong>
          <small>ПВЗ МО, ул. Пушкина 3</small>
        </div>

        <NuxtLink to="/pvz/login" class="pvz-layout__logout" aria-label="Выйти из ПВЗ">
          <PvzIcon name="logout" :size="18" />
        </NuxtLink>
      </div>
    </aside>

    <div class="pvz-layout__main">
      <header class="pvz-layout__header">
        <nav class="pvz-layout__top-nav" aria-label="Основные разделы ПВЗ">
          <NuxtLink
            v-for="item in mainNav"
            :key="item.to"
            class="pvz-layout__top-link"
            :class="{ 'pvz-layout__top-link--active': route.path === item.to }"
            :to="item.to"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </header>

      <main class="pvz-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pvz-layout {
  display: grid;
  grid-template-columns: 22rem minmax(0, 1fr);
  min-height: 100vh;
}

.pvz-layout__sidebar {
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  padding: 2.6rem 0 2rem;
  background: #fff;
  border-right: 1px solid #ececec;
}

.pvz-layout__logo {
  display: inline-flex;
  margin-left: 2.6rem;

  img {
    width: 16rem;
  }
}

.pvz-layout__rail {
  display: grid;
  gap: 0.4rem;
}

.pvz-layout__rail-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  min-height: 6rem;
  padding: 0 2.8rem;
  color: #414141;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: #f8fbf8;
  }

  span {
    font-size: 1.45rem;
  }
}

.pvz-layout__rail-item--active {
  background: #f5f5f5;
  color: #333;

  &::before {
    content: '';
    position: absolute;
    top: 0.9rem;
    bottom: 0.9rem;
    left: 0;
    width: 0.4rem;
    border-radius: 0 999px 999px 0;
    background: #18b536;
  }
}

.pvz-layout__operator {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  margin-top: auto;
  padding: 0 2rem;

  span {
    font-size: 1.2rem;
    color: #929292;
  }

  strong {
    display: block;
    margin-top: 0.4rem;
    font-size: 1.4rem;
    color: #333;
  }

  small {
    display: block;
    margin-top: 0.4rem;
    font-size: 1.2rem;
    color: #9c9c9c;
  }
}

.pvz-layout__logout {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.8rem;
  height: 3.8rem;
  background: #f7f7f7;
  border-radius: 1.2rem;
  color: #5c5c5c;
  text-decoration: none;
}

.pvz-layout__main {
  min-width: 0;
}

.pvz-layout__header {
  display: flex;
  justify-content: center;
  padding: 2.8rem 3rem 1.2rem;
}

.pvz-layout__top-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3.2rem;
}

.pvz-layout__top-link {
  position: relative;
  font-size: 1.5rem;
  font-weight: 500;
  color: #313131;
  text-decoration: none;
}

.pvz-layout__top-link--active {
  color: #18b536;
  font-weight: 700;
}

.pvz-layout__content {
  padding: 1rem 2.4rem 2.8rem;
}

@media (max-width: 1280px) {
  .pvz-layout {
    grid-template-columns: 18rem minmax(0, 1fr);
  }

  .pvz-layout__rail-item {
    padding: 0 2rem;
  }

  .pvz-layout__top-nav {
    gap: 2rem;
  }
}
</style>
