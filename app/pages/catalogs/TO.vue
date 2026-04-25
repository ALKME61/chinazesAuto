<script setup lang="ts">
import CarSearch from '~/components/shop/carSearch/ui/CarSearch.vue';

definePageMeta({ layout: 'default' })

const categories = [
  { title: 'Автомобильные фильтры', image: '/Categories/filters.png' },
  { title: 'Тормозные колодки', image: '/Categories/brakePads.png' },
  { title: 'Жидкости в автомобиль', image: '/Categories/carOil.png' },
  { title: 'Свечи зажигания', image: '/Categories/ignitionSparks.png' },
  { title: 'Щётки стеклоочистителя', image: '/Categories/wiperBlades.png' },
  { title: 'Прочее', image: '/Categories/other.png' },
]
</script>

<template>
  <main class="catalog-section shop-page">
    <div class="catalog-section__breadcrumbs">Главная страница > Каталог для ТО</div>

    <CarSearch />

    <section class="catalog-section__categories">
      <div v-for="category in categories" :key="category.title" class="catalog-section__category-card">
        <NuxtImg :src="category.image" :alt="category.title" />
        {{ category.title }}
      </div>
    </section>
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

.catalog-section__categories {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
  padding: 3rem;
  background: #fff;
  border-radius: 2.8rem;
}

.catalog-section__category-card {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 18rem;
  padding: 1.8rem;
  background: #fafafa;
  border-radius: 2rem;
  color: #5b5b5b;
  font-size: 2rem;
  text-align: center;
  transition-duration: 0.3s;

  img {
    position: absolute;
    top: -3rem;
    width: 13.5rem;
    transition-duration: 0.3s;
  }
}

.catalog-section__category-card:hover {
  background: #eeeeee;
  transition-duration: 0.3s;
  cursor: pointer;
  img {
    position: absolute;
    top: -4rem;
    width: 14.5rem;
    transition-duration: 0.3s;
  }
}

@media (max-width: 991px) {
  .catalog-section__categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
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

  .catalog-section__categories {
    gap: 1.2rem;
    padding: 1.6rem;
    border-radius: 2rem;
  }

  .catalog-section__category-card {
    min-height: 10.8rem;
    border-radius: 1.4rem;
    font-size: 1.35rem;

    img {
      top: 1.2rem;
      width: 6rem;
    }
  }
}
</style>
