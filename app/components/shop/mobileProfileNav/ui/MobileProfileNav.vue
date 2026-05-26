<script setup lang="ts">
const route = useRoute()

const items = [
  { label: 'Профиль', icon: '/icons/profile/profileIcon.svg', to: '/profile' },
  { label: 'Гараж', icon: '/icons/profile/garageIcon.svg', to: '/profile/garage' },
  { label: 'Заказы', icon: '/icons/profile/orderIcon.svg', to: '/profile/orders' },
  { label: 'Баланс', icon: '/icons/profile/balanceIcon.svg', to: '/profile/balance' },
  { label: 'Уведомления', icon: '/icons/profile/notificationIcon.svg', to: '/profile/notifications' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <nav class="mobile-profile-nav" aria-label="Навигация по личному кабинету">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="mobile-profile-nav__item"
      :class="{ 'mobile-profile-nav__item--active': activePath === item.to }"
    >
      <NuxtImg :src="item.icon" :alt="item.label" />
    </NuxtLink>
  </nav>
</template>

<style scoped lang="scss">
.mobile-profile-nav {
  position: fixed;
  left: 50%;
  bottom: 3.6rem;
  z-index: 35;
  display: none;
  align-items: center;
  gap: 1.6rem;
  width: calc(100% - 3.2rem);
  max-width: 36rem;
  padding: 1.4rem 2rem;
  background: rgba(242, 242, 242, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  transform: translateX(-50%);
  backdrop-filter: blur(14px);
}

.mobile-profile-nav__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 50%;

  img {
    width: 2.3rem;
    height: 2.3rem;
    opacity: 0.65;
  }
}

.mobile-profile-nav__item--active {
  img {
    opacity: 1;
    filter: invert(49%) sepia(83%) saturate(741%) hue-rotate(89deg) brightness(93%) contrast(88%);
  }
}

@media (max-width: 991px) {
  .mobile-profile-nav {
    display: flex;
    justify-content: space-between;
  }
}
</style>
