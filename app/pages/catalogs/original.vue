<script setup lang="ts">
import CarSearch from '~/components/shop/carSearch/ui/CarSearch.vue';
definePageMeta({ layout: 'default' })
</script>

<template>
  <main class="catalog-section shop-page">
    <div class="catalog-section__breadcrumbs">Главная страница > Оригинальный каталог</div>
    <CarSearch />
  </main>
</template>

<style scoped lang="scss">
.shop-page {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.catalog-section {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.catalog-section__breadcrumbs {
  color: #ababab;
  font-size: 1.45rem;
}

@media (max-width: 767px) {
  .shop-page {
    width: calc(100% - 1.6rem);
  }

  .catalog-section {
    gap: 0.8rem;
  }

  .catalog-section__breadcrumbs {
    font-size: 1.2rem;
  }
}
</style>
