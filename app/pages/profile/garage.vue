<script setup lang="ts">
const garageCars = [
  { id: 1, title: 'BMW IV (E39) 540i', vin: 'WAUXSBBJ69LO0432', active: true },
  { id: 2, title: 'BMW IV (E39) 540i', vin: 'WAUXSBBJ69LO0432', active: false },
]

const quickCategories = [
  { title: 'Оригинальный каталог', image: '/Categories/originalCatalogue.png', to: '/catalogs/original' },
  { title: 'Запчасти для ТО', image: '/Categories/partsForTO.png', to: '/catalogs/TO' },
  { title: 'Аксессуары', image: '/Categories/accessories.png', to: '/catalogs' },
  { title: 'Шины и диски', image: '/Categories/wheelsAndDisks.png', to: '/catalogs' },
  { title: 'АКБ', image: '/Categories/accumulators.png', to: '/catalog?categoryName=akb' },
  { title: 'Масла и техжидкости', image: '/Categories/oil.png', to: '/catalogs' },
]
</script>

<template>
  <section class="garage-page">
    <article class="garage-page__garage-card">
      <div v-for="car in garageCars" :key="car.id" class="garage-page__car-card">
        <div class="garage-page__car-copy">
          <h2>{{ car.title }}</h2>
          <strong>{{ car.vin }}</strong>
          <span>VIN</span>
          <em v-if="car.active">Выбрано</em>
        </div>

        <NuxtImg src="/AutoExample.png" :alt="car.title" />
      </div>

      <button type="button" class="garage-page__add-car">
        <NuxtImg src="/icons/plus.svg" alt="" />
        <span>Добавить авто</span>
      </button>
    </article>

    <section class="garage-page__categories">
      <NuxtLink v-for="category in quickCategories" :key="category.title" :to="category.to" class="garage-page__category-card">
        <NuxtImg :src="category.image" :alt="category.title" />
        <span>{{ category.title }}</span>
      </NuxtLink>
    </section>
  </section>
</template>

<style scoped lang="scss">
.garage-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.garage-page__garage-card,
.garage-page__categories {
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.garage-page__garage-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.8rem;
}

.garage-page__car-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  padding: 1.8rem;
  background: #fafafa;
  border-radius: 2rem;
  overflow: visible;
  transition: background-color 0.2s ease;

  img {
    width: min(15rem, 44%);
    margin-top: -2.2rem;
    object-fit: contain;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: #f2f2f2;

    img {
      transform: scale(1.04);
    }
  }
}

.garage-page__car-copy {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  h2 {
    color: #2d2d2d;
    font-size: 1.8rem;
    font-weight: 700;
  }

  strong {
    color: #2d2d2d;
    font-size: 1.6rem;
    font-weight: 500;
  }

  span {
    color: #a0a0a0;
    font-size: 1.3rem;
  }

  em {
    display: inline-flex;
    width: fit-content;
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    background: #d8f8e0;
    color: $green;
    font-style: normal;
    font-size: 1.35rem;
  }
}

.garage-page__add-car {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: 0;
  border-radius: 2rem;
  background: transparent;
  color: #7b7b7b;
  font-size: 1.7rem;

  img {
    width: 2.4rem;
  }
}

.garage-page__categories {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.8rem;
}

.garage-page__category-card {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 18rem;
  padding: 1.6rem;
  background: #fafafa;
  border-radius: 2rem;
  color: #535353;
  text-align: center;
  transition: background-color 0.2s ease;

  img {
    position: absolute;
    top: 1.4rem;
    width: 9rem;
    transition: transform 0.2s ease;
  }

  span {
    max-width: 11rem;
    font-size: 1.55rem;
    line-height: 1.3;
  }

  &:hover {
    background: #f2f2f2;

    img {
      transform: scale(1.04);
    }
  }
}

@media (max-width: 991px) {
  .garage-page__garage-card {
    grid-template-columns: 1fr;
  }

  .garage-page__categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .garage-page {
    gap: 0.8rem;
  }

  .garage-page__garage-card,
  .garage-page__categories {
    padding: 1.6rem;
    background: #fff;
    border-radius: 2rem;
    box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
  }

  .garage-page__garage-card {
    gap: 1rem;
  }

  .garage-page__car-card {
    padding: 1.2rem 1.4rem;
    border-radius: 1.8rem;

    img {
      width: min(12rem, 42%);
      margin-top: 0;
    }
  }

  .garage-page__car-copy h2 {
    font-size: 1.5rem;
  }

  .garage-page__car-copy strong {
    font-size: 1.4rem;
  }

  .garage-page__category-card {
    min-height: 13.4rem;
    border-radius: 1.6rem;

    img {
      width: 6.8rem;
    }

    span {
      font-size: 1.25rem;
    }
  }

  .garage-page__add-car {
    min-height: 12rem;
    background: #fafafa;
    border-radius: 1.8rem;
    box-shadow: none;
  }
}
</style>
