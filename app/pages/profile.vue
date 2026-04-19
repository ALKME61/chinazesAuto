<script setup lang="ts">
import ProfileLinks from '~/components/profileLinks/ProfileLinks.vue'
import { profileLinks } from '~/components/profileLinks/profileLinksTypes'

const route = useRoute()

definePageMeta({
  layout: 'default',
})

const titleMap: Record<string, string> = {
  '/profile': 'Профиль',
  '/profile/garage': 'Гараж',
  '/profile/orders': 'Заказы',
  '/profile/balance': 'Баланс',
  '/profile/discount': 'Скидки',
  '/profile/notifications': 'Уведомления',
}

const currentTitle = computed(() => titleMap[route.path] ?? 'Профиль')
</script>

<template>
  <section class="profile-shell">
    <header class="profile-shell__header">
      <h1>{{ currentTitle }}</h1>
    </header>

    <div class="profile-shell__layout">
      <ProfileLinks :links="profileLinks" />
      <NuxtPage />
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile-shell {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.profile-shell__header {
  margin-bottom: 2rem;

  h1 {
    color: #2f2f2f;
    font-size: 4rem;
    font-weight: 800;
  }
}

.profile-shell__layout {
  display: grid;
  grid-template-columns: minmax(28rem, 36rem) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
}

@media (max-width: 991px) {
  .profile-shell {
    width: calc(100% - 1.6rem);
  }

  .profile-shell__header {
    display: none;
  }

  .profile-shell__layout {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
