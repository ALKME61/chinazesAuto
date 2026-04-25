<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  description?: string
  icon: string
  to?: RouteLocationRaw
  active?: boolean
}>()
</script>

<template>
  <NuxtLink
    v-if="to"
    class="settings-card"
    :class="{ 'settings-card--active': active }"
    :to="to"
  >
    <div class="settings-card__content">
      <h3>{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
    </div>

    <div class="settings-card__media">
      <NuxtImg :src="icon" :alt="title" />
    </div>
  </NuxtLink>

  <button
    v-else
    type="button"
    class="settings-card"
    :class="{ 'settings-card--active': active }"
  >
    <div class="settings-card__content">
      <h3>{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
    </div>

    <div class="settings-card__media">
      <NuxtImg :src="icon" :alt="title" />
    </div>
  </button>
</template>

<style scoped lang="scss">
.settings-card {
  display: flex;
  min-height: 15.2rem;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.6rem;
  background: #fff;
  border: 1px solid transparent;
  border-radius: 1.8rem;
  box-shadow: 0 14px 34px rgba(22, 25, 29, 0.04);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 38px rgba(22, 25, 29, 0.07);
  }
}

.settings-card--active {
  border-color: rgba(24, 181, 54, 0.18);
  box-shadow: 0 18px 38px rgba(24, 181, 54, 0.08);
}

.settings-card__content {
  h3 {
    font-size: 1.45rem;
    font-weight: 500;
    color: #474747;
    line-height: 1.35;
  }

  p {
    margin-top: 0.8rem;
    font-size: 1.28rem;
    line-height: 1.45;
    color: #929292;
  }
}

.settings-card__media {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;

  img {
    width: 4.8rem;
    height: 4.8rem;
    object-fit: contain;
  }
}
</style>
