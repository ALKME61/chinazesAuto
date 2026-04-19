<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    caption?: string
    icon?: string
    compact?: boolean
  }>(),
  {
    subtitle: '',
    caption: '',
    icon: 'qr',
    compact: false,
  },
)
</script>

<template>
  <section class="pvz-scan-hero" :class="{ 'pvz-scan-hero--compact': compact }">
    <div class="pvz-scan-hero__visual">
      <div class="pvz-scan-hero__ring">
        <PvzIcon :name="icon" :size="48" />
      </div>
    </div>

    <div class="pvz-scan-hero__body">
      <h2>{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
      <slot />
      <span v-if="caption" class="pvz-scan-hero__caption">{{ caption }}</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pvz-scan-hero {
  display: grid;
  justify-items: center;
  gap: 2rem;
  min-height: 36rem;
  padding: 3.2rem 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 18px 40px rgba(20, 24, 26, 0.04);
  text-align: center;
}

.pvz-scan-hero--compact {
  min-height: 28rem;
}

.pvz-scan-hero__visual {
  display: grid;
  place-items: center;
  width: 17rem;
  height: 17rem;
  border-radius: 3.2rem;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.96), rgba(247, 249, 248, 0.92) 60%, rgba(235, 241, 237, 0.9) 100%);
  border: 1px solid #edf2ee;
}

.pvz-scan-hero__ring {
  display: grid;
  place-items: center;
  width: 9.2rem;
  height: 9.2rem;
  border-radius: 50%;
  background: rgba(24, 181, 54, 0.1);
  color: #18b536;
  box-shadow: inset 0 0 0 1px rgba(24, 181, 54, 0.08);
}

.pvz-scan-hero__body {
  display: grid;
  gap: 0.9rem;
  max-width: 32rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }

  p {
    font-size: 1.45rem;
    line-height: 1.5;
    color: #747474;
  }
}

.pvz-scan-hero__caption {
  font-size: 1.25rem;
  line-height: 1.45;
  color: #9a9a9a;
}
</style>
