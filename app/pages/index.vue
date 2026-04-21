<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({
  meta: [
    { name: 'theme-color', content: '#ffffff' },
  ]
})
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
  <main class="home-page shop-page">
    <h1 class="home-header">Запчасти <span>ЧиназесАвто</span></h1>
    <section class="home-hero card-section">

      <div class="home-categories">
        <NuxtLink v-for="category in categories" :key="category.title" :to="category.to" class="home-categories__card">
          <NuxtImg :src="category.image" :alt="category.title" />
          <span>{{ category.title }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="home-guide card-section">
      <div class="home-guide__copy">
        <h2>Как сделать свой первый заказ?</h2>
        <p>
          Видеоинструкция для новых клиентов: расскажем, как создать аккаунт, выбрать нужный товар и оформить
          первый заказ.
        </p>
      </div>

      <div class="home-guide__actions">
        <button type="button" class="home-guide__button">
          <NuxtImg src="/icons/playIcon.svg" alt="" />
          <span>Посмотреть инструкцию</span>
        </button>

        <div class="home-guide__meta">
          <span>
            <NuxtImg src="/icons/timeDurationIcon.svg" alt="" />
            4:32 минуты
          </span>
          <span>
            <NuxtImg src="/icons/eyeIcon.svg" alt="" />
            4232 просмотра
          </span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.shop-page {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.card-section {
  padding: 3.2rem;
  background: #fff;
  border-radius: 2.8rem;
  box-shadow: 0 20px 50px rgba(28, 30, 32, 0.05);
}

.home-page {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.home-header {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #2c2c2c;
  font-size: clamp(3rem, 2.7vw, 4.8rem);
  font-weight: 800;

  span {
    color: $green;
  }
}

.home-categories {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
}

.home-categories__card:hover {
  background: #eeeeee;

  img {
    top: -4rem;
    width: min(14rem, 70%);
    transition-duration: 0.3s;
  }

  transition-duration: 0.3s;
}

.home-categories__card {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 16rem;
  padding: 1.8rem;
  background: #fafafa;
  border-radius: 2rem;
  color: #434343;
  text-align: center;
  transition-duration: 0.3s;

  img {
    position: absolute;
    top: -3rem;
    width: min(12.5rem, 70%);
    transition-duration: 0.3s;
  }

  span {
    font-size: 1.9rem;
    line-height: 1.25;
  }
}

.home-guide {
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
  width: min(72rem, 100%);
  color: #fff;
  background: $linear-green;
}

.home-guide__copy {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  h2 {
    font-size: clamp(2.8rem, 2.4vw, 3.8rem);
    font-weight: 800;
  }

  p {
    max-width: 52rem;
    font-size: 1.8rem;
    line-height: 1.5;
  }
}

.home-guide__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
}

.home-guide__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 6rem;
  padding: 0 2.8rem;
  border: 0;
  border-radius: 1.6rem;
  background: #fff;
  color: $green;
  font-size: 1.8rem;
  font-weight: 600;

  img {
    width: 2.6rem;
  }
}

.home-guide__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.55rem;

    img {
      width: 2rem;
    }
  }
}

@media (max-width: 991px) {
  .home-categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .shop-page {
    width: calc(100% - 1.6rem);
  }

  .card-section {
    padding: 1.6rem;
    border-radius: 2rem;
  }

  .home-page {
    gap: 0.8rem;
  }

  .home-hero {
    background: #fff;
  }

  .home-hero h1 {
    margin-bottom: 2rem;
    text-align: left;
    font-size: 2.4rem;
  }

  .home-categories {
    gap: 1.2rem;
  }

  .home-categories__card {
    min-height: 12rem;
    border-radius: 1.6rem;
    background: #fafafa;

    img {
      top: -1.4rem;
      width: 10rem;
    }

    span {
      font-size: 1.35rem;
    }
  }

  .home-guide {
    width: 100%;
    padding: 2.4rem 1.6rem;
    gap: 2rem;
  }

  .home-guide__copy {
    h2 {
      font-size: 1.7rem;
    }

    p {
      font-size: 1.4rem;
    }
  }

  .home-guide__button {
    width: 100%;
    min-height: 5.4rem;
    border-radius: 1.4rem;
    font-size: 1.55rem;
  }

  .home-guide__meta {
    justify-content: space-between;
    width: 100%;

    span {
      font-size: 1.2rem;
    }
  }
}
</style>
