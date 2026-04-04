<script setup lang="ts">
defineProps<{
  label: string
  icon: string
  to?: string
  active?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <NuxtLink
    v-if="to && !disabled"
    :to="to"
    class="admin-sidebar-link"
    :class="{ 'admin-sidebar-link--active': active }"
  >
    <AdminIcon :name="icon" :size="21" />
    <span>{{ label }}</span>
  </NuxtLink>

  <button
    v-else
    type="button"
    class="admin-sidebar-link admin-sidebar-link--disabled"
    :class="{ 'admin-sidebar-link--active': active }"
  >
    <AdminIcon :name="icon" :size="21" />
    <span>{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
.admin-sidebar-link {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  min-height: 4.8rem;
  padding: 0 1.2rem;
  background: transparent;
  border: 0;
  border-radius: 1.2rem;
  color: #424242;
  font-size: 1.5rem;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #f4fbf6;
  }

  span {
    line-height: 1.2;
  }
}

.admin-sidebar-link--active {
  color: #1d1d1d;
  background: #f0faf3;
  font-weight: 500;
}

.admin-sidebar-link--disabled {
  justify-content: flex-start;
}
</style>
