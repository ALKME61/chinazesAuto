<template>
  <nav class="profile-links">
    <NuxtLink
      v-for="link in links"
      :key="link.id"
      :to="link.to"
      class="profile-link"
    >
      <img :src="link.icon" :alt="link.name" class="profile-link__icon" />
      <span class="profile-link__text">{{ link.name }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import type { ProfileLink } from './profileLinksTypes';

defineProps<{
  links: ProfileLink[]
}>()
</script>

<style scoped lang="scss">
    .profile-link {
        width: 17vw;
        display: flex;
        align-items: center;
        gap: 1.4rem;
        background-color: #fff;
        max-width: 400px;
        border-radius: $radius-md;
        padding: 20px;
        span {
            color: #292929;
            font-size: $font-size-p;
        }
    }
    .profile-links {
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: $spacing-md;
    }
</style>