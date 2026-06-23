<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    value: string | number
    icon?: string
    accent?: boolean
  }>(),
  {
    icon: '',
    accent: false,
  },
)
</script>

<template>
  <section class="admin-metric-card" :class="{ 'admin-metric-card--accent': accent }">
    <div class="admin-metric-card__head">
      <div>
        <p class="admin-metric-card__title">{{ title }}</p>
        <strong class="admin-metric-card__value">{{ value }}</strong>
      </div>

      <div v-if="icon" class="admin-metric-card__icon">
        <AdminIcon :name="icon" :size="22" />
      </div>
    </div>

    <div v-if="$slots.default" class="admin-metric-card__meta">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.admin-metric-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 11rem;
  padding: 1.6rem;
  background: #fff;
  border-radius: 1.8rem;
  color: #494949;
}

.admin-metric-card--accent {
  background: $linear-green;
  color: #fff;

  .admin-metric-card__title,
  .admin-metric-card__meta {
    color: #fff;
  }

  .admin-metric-card__icon {
    color: rgba(255, 255, 255, 0.9);
  }
}

.admin-metric-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.admin-metric-card__title {
  margin-bottom: 1rem;
  font-size: 1.4rem;
  color: #505050;
}

.admin-metric-card__value {
  font-size: 3.4rem;
  font-weight: 600;
  line-height: 1;
}

.admin-metric-card__icon {
  color: #474747;
  flex-shrink: 0;
}

.admin-metric-card__meta {
  margin-top: 1rem;
  font-size: 1.35rem;
  color: #979797;
  line-height: 1.35;
}
</style>
