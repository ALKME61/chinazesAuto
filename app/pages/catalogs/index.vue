<script setup>
const { slugify } = useSlugify()
const route = useRoute()
const { categoryName, id } = route.query

// Например, вывести в консоль
console.log('categoryName:', categoryName)
console.log('id:', id)  

// Если параметры обязательны, можно добавить проверку
if (!categoryName || !id) {
  // показать что-то по умолчанию или редирект
}
</script>
<template>
  <div class="categoryBlock__wrapper">
    <h1>Категория с id: {{ id }} и slug: {{ categoryName }}</h1>
    <div class="categoryBlock__categories">
      <div>
        <NuxtLink to="/catalogs/original" class="categoryBlock-card">
          <NuxtImg format="webp" src="/Categories/originalCatalogue.png" alt="Оригинальный каталог" />
          <p>Оригинальный каталог</p>
        </NuxtLink>
      </div>
      <div>
        <NuxtLink to="/catalogs/TO" class="categoryBlock-card">
          <NuxtImg format="webp" src="/Categories/partsForTO.png" alt="Запчасти для ТО" />

          <p>Запчасти для ТО</p>
        </NuxtLink>
      </div>
      <div>
        <NuxtLink :to="{
          path: '/catalog',
          query: {
            categoryName: slugify('Аксессуары'),
            id: 1,
          }
        }" class="categoryBlock-card">
          <NuxtImg format="webp" src="/Categories/accessories.png" alt="Аксессуары" />

          <p>Аксессуары</p>
        </NuxtLink>
      </div>
      <div>
        <NuxtLink class="categoryBlock-card">
          <NuxtImg format="webp" src="/Categories/wheelsAndDisks.png" alt="Шины и диски" />

          <p>Шины и диски</p>
        </NuxtLink>
      </div>
      <div>
        <NuxtLink class="categoryBlock-card">
          <NuxtImg format="webp" src="/Categories/accumulators.png" alt="Аккумуляторы" />

          <p>АКБ</p>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>


<style scoped lang="scss">
.car-search {
  width: $content-width;
  margin: 0 auto;
  margin-bottom: $spacing-lg;
}

.categoryBlock__wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  background-color: $white;
  width: $content-width;
  margin: 0 auto;
  border-radius: $radius-xl;
  padding: $spacing-xl;
}

.categoryBlock__categories {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-2xl;
  grid-template-columns: repeat(3, 2fr);
  .most a {
    text-decoration: none;
    transition-duration: 0.2s;
  }

  a:hover {
    background-color: #ececec;
    transition-duration: 0.2s;

    img {
      width: 130px;
      transition-duration: 0.2s;
      top: -40px;
    }
  }
}

.categoryBlock-card {
  position: relative;
  background-color: $gray-light;
  display: flex;
  align-items: end;
  justify-content: center;
  padding-bottom: $spacing-lg;
  width: 100%;
  height: 140px;
  border-radius: $radius-lg;

  img {
    position: absolute;
    top: -30px;
    width: 120px;
    transition-duration: 0.2s;
  }

  p {
    font-size: $font-size-body;
    color: $gray-text;
  }
}

.categories {
  margin-bottom: 20%;
}
</style>