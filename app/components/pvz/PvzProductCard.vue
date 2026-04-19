<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'

withDefaults(
  defineProps<{
    cell: string
    code: string
    title: string
    subtitle: string
    quantity: string
    image?: string
    dimmed?: boolean
    badge?: string
    badgeTone?: 'danger' | 'success' | 'warning'
  }>(),
  {
    image: '/productExample.png',
    dimmed: false,
    badge: '',
    badgeTone: 'danger',
  },
)
</script>

<template>
  <article class="pvz-product-card" :class="{ 'pvz-product-card--dimmed': dimmed }">
    <span v-if="badge" class="pvz-product-card__badge" :class="`pvz-product-card__badge--${badgeTone}`">{{ badge
      }}</span>

    <div class="pvz-product-card__image">
      <NuxtImg :src="image" :alt="title" />
      <strong>{{ cell }}</strong>
    </div>

    <div class="pvz-product-card__body">
      <div class="pvz-product-card__code">
        <span>{{ code }}</span>
        <button type="button" aria-label="Скопировать код">
          <PvzIcon name="copy" :size="18" />
        </button>
        <span>{{ quantity }}</span>
      </div>

      <p>{{ title }}</p>
      <small>{{ subtitle }}</small>
    </div>
  </article>
</template>

<style scoped lang="scss">
.pvz-product-card {
  position: relative;
  display: grid;
  gap: 1.6rem;
}

.pvz-product-card--dimmed {
  opacity: 0.42;
}

.pvz-product-card__badge {
  position: absolute;
  z-index: 2;
  top: 1rem;
  left: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0 1rem;
  border-radius: 999px;
  font-size: 1.25rem;
  color: #fff;
}

.pvz-product-card__badge--danger {
  background: #ff4343;
}

.pvz-product-card__badge--success {
  background: #18b536;
}

.pvz-product-card__badge--warning {
  background: #ff9d22;
}

.pvz-product-card__image {
  position: relative;
  display: grid;
  align-items: end;
  min-height: 28rem;
  padding: 1.8rem;
  background: #f9f9f9;
  border-radius: 2rem;
  overflow: hidden;

  img {
    width: 100%;
    max-width: 24rem;
    margin: 0 auto;
    object-fit: contain;
  }

  strong {
    position: absolute;
    left: 1.6rem;
    bottom: 1.2rem;
    font-size: 2rem;
    font-weight: 600;
    color: #2f2f2f;
  }
}

.pvz-product-card__body {
  display: grid;
  gap: 0.8rem;

  p {
    font-size: 1.45rem;
    line-height: 1.45;
    color: #414141;
  }

  small {
    font-size: 1.28rem;
    line-height: 1.45;
    color: #818181;
  }
}

.pvz-product-card__code {
  display: flex;
  align-items: center;
  gap: 0.8rem;

  span {
    font-size: 1.45rem;
    font-weight: 600;
    color: #3b3b3b;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    padding: 0;
    background: transparent;
    border: 0;
    color: #656565;
    cursor: pointer;
  }
}
</style>
