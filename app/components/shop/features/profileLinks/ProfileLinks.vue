<script setup lang="ts">
import type { ProfileLink } from './profileLinksTypes'

const route = useRoute()

defineProps<{
  links: ProfileLink[]
}>()
</script>

<template>
  <nav class="profile-links">
    <NuxtLink
      v-for="link in links"
      :key="link.id"
      :to="link.to"
      class="profile-link"
      :class="{ 'profile-link--active': route.path === link.to }"
    >
      <img :src="link.icon" :alt="link.name" class="profile-link__icon">
      <span class="profile-link__text">{{ link.name }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped lang="scss">
.profile-links {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
  max-width: 37rem;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  width: 100%;
  min-height: 7.6rem;
  padding: 1.8rem 2rem;
  background: #fff;
  border-radius: 1.8rem;
  box-shadow: 0 14px 34px rgba(28, 30, 32, 0.04);
  color: #2c2c2c;
}

.profile-link--active {
  box-shadow: inset 0 0 0 2px rgba(16, 174, 59, 0.15);
}

.profile-link__icon {
  width: 2.4rem;
  height: 2.4rem;
}

.profile-link__text {
  font-size: 1.75rem;
  font-weight: 500;
}

@media (max-width: 991px) {
  .profile-links {
    display: none;
  }
}
</style>