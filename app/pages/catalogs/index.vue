<script setup lang="ts">
definePageMeta({ layout: 'default' })

const categories = [
  { title: 'Оригинальный каталог', image: '/Categories/originalCatalogue.png', to: '/catalogs/original' },
  { title: 'Запчасти для ТО', image: '/Categories/partsForTO.png', to: '/catalogs/TO' },
  { title: 'Аксессуары', image: '/Categories/accessories.png', to: '/catalogs' },
  { title: 'Шины и диски', image: '/Categories/wheelsAndDisks.png', to: '/catalogs' },
  { title: 'АКБ', image: '/Categories/accumulators.png', to: '/catalog?categoryName=akb' },
  { title: 'Автохимия', image: '/Categories/autochemistry.png', to: '/catalogs' },
  { title: 'Масла и техжидкости', image: '/Categories/oil.png', to: '/catalogs' },
  { title: 'Инструменты', image: '/Categories/tools.png', to: '/catalogs' },
]
</script>

<template>
  <main class="catalog-home shop-page">
    <section class="catalog-home__section">
      <div class="catalog-home__breadcrumbs">Главная страница > Каталоги</div>
      <h1>Каталоги</h1>
      <div class="catalog-home__grid">
        <NuxtLink v-for="category in categories" :key="category.title" :to="category.to" class="catalog-home__card">
          <NuxtImg :src="category.image" :alt="category.title" />
          <span>{{ category.title }}</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.shop-page {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.catalog-home__section {
  padding: 3.2rem;
  background: #fff;
  border-radius: 2.8rem;
}

.catalog-home__breadcrumbs {
  margin-bottom: 2rem;
  color: #ababab;
  font-size: 1.45rem;
}

.catalog-home__section h1 {
  margin-bottom: 2.4rem;
  color: #292929;
  font-size: 4rem;
  font-weight: 800;
}

.catalog-home__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
}

.catalog-home__card {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 20rem;
  padding: 1.8rem;
  background: #fafafa;
  border-radius: 2rem;
  color: #464646;
  text-align: center;

  img {
    position: absolute;
    top: 1.8rem;
    width: 10.5rem;
  }

  span {
    max-width: 12rem;
    font-size: 1.8rem;
    line-height: 1.3;
  }
}

@media (max-width: 991px) {
  .catalog-home__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .shop-page {
    width: calc(100% - 1.6rem);
  }

  .catalog-home__section {
    padding: 1.6rem;
    border-radius: 2rem;
  }

  .catalog-home__breadcrumbs {
    margin-bottom: 1.4rem;
    padding: 0 0.2rem;
    font-size: 1.2rem;
  }

  .catalog-home__section h1 {
    margin-bottom: 1.8rem;
    font-size: 1.8rem;
  }

  .catalog-home__grid {
    gap: 1.2rem;
  }

  .catalog-home__card {
    min-height: 13rem;
    border-radius: 1.6rem;

    img {
      top: 1rem;
      width: 6.8rem;
    }

    span {
      max-width: 10rem;
      font-size: 1.35rem;
    }
  }
}
</style>
