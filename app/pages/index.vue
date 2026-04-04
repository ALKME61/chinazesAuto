<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { slugify } = useSlugify()

useSeoMeta({
  title: 'Главная страница Чиназес-авто',
  ogTitle: 'Главная страница Чиназес-авто',
  description: 'Запчасти на любые автомобили от Чиназес-авто, закажите заказ в удобный вам пункт выдачи!',
  ogDescription: 'Запчасти на любые автомобили от Чиназес-авто, закажите заказ в удобный вам пункт выдачи!',
  ogImage: '/ChinazesAutoLogo.svg',
})
</script>
<template>
  <main>
    <div class="mainHeader_wrapper">
      <h1>Запчасти <span style="color: #10AE3B">ЧиназесАвто</span></h1>
    </div>
    <div class="categoryBlock__wrapper">
      <h1>Каталоги</h1>
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
          path: '/catalogs',
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
          <NuxtLink :to="{
          path: '/catalogs',
          query: {
            categoryName: slugify('Шины и диски'),
            id: 2,
          }
        }" class="categoryBlock-card">
            <NuxtImg format="webp" src="/Categories/wheelsAndDisks.png" alt="Шины и диски" />

            <p>Шины и диски</p>
          </NuxtLink>
        </div>
        <div>
          <NuxtLink :to="{
          path: '/catalogs',
          query: {
            categoryName: slugify('АКБ'),
            id: 3,
          }
        }" class="categoryBlock-card">
            <NuxtImg format="webp" src="/Categories/accumulators.png" alt="Аккумуляторы" />

            <p>АКБ</p>
          </NuxtLink>
        </div>
        <div>
          <NuxtLink :to="{
          path: '/catalogs',
          query: {
            categoryName: slugify('Автохимия'),
            id: 4,
          }
        }" class="categoryBlock-card">
            <NuxtImg format="webp" src="/Categories/autochemistry.png" alt="Автохимия" />

            <p>Автохимия</p>
          </NuxtLink>
        </div>
        <div>
          <NuxtLink :to="{
          path: '/catalogs',
          query: {
            categoryName: slugify('Масла и техжидкости', '-'),
            id: 5,
          }
        }" class="categoryBlock-card">
            <NuxtImg format="webp" src="/Categories/oil.png" alt="Масла и техжидкости" />

            <p>Масла и техжидкости</p>
          </NuxtLink>
        </div>
        <div>
          <NuxtLink :to="{
          path: '/catalogs',
          query: {
            categoryName: slugify('Инструменты', '-'),
            id: 6,
          }
        }" class="categoryBlock-card">
            <NuxtImg format="webp" src="/Categories/tools.png" alt="Инструменты" />

            <p>Инструменты</p>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="informationForNewUsers">
      <h2 class="informationForNewUsers-header">Информация для новых клиентов</h2>
      <div class="howToOrder">
        <div class="howToOrder__text">
          <h3 class="howToOrder__text-header">Как сделать свой первый заказ?</h3>
          <p class="howToOrder__text-content">
            Видеоинструкция для новых клиентов, расскажем о том, как <b>создать аккаунт</b>, выбрать нужный товар и
            оформить свой <b>первый заказ</b>
          </p>
        </div>
        <div class="howToOrder__run">
          <button class="howToOrder__run-button">
            <NuxtImg src="/icons/playIcon.svg" alt="Иконка play" />
            Просмотреть инструкцию
          </button>
          <div class="howToOrder__run__info">
            <span class="howToOrder__run__info-duration">
              <NuxtImg src="/icons/timeDurationIcon.svg" alt="Иконка time duration для длительности просмотра" /> 4:32
              минуты
            </span>
            <span class="howToOrder__run__info-views">
              <NuxtImg src="/icons/eyeIcon.svg" alt="Иконка глаза просмотры" /> 1234 просмотра
            </span>
          </div>
        </div>

      </div>
    </div>
  </main>

</template>


<style scoped lang="scss">
.informationForNewUsers {
  display: flex;
  flex-direction: column;
  max-width: $content-width;
  margin: 0 auto;
  padding: $spacing-xl 0;
}

.informationForNewUsers-header {
  align-self: center;
  font-size: $font-size-h2;
  margin-bottom: $spacing-2xl;
}

.howToOrder {
  position: relative;
  background: $linear-green;
  width: 50%;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  color: #fff;

  .howToOrder__text-header {
    font-size: $font-size-h3;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-lg;
  }

  .howToOrder__text-content {
    font-size: $font-size-p;
    margin-bottom: $spacing-3xl;
    width: 100%;
    max-width: 550px;
  }

  .howToOrder__run {
    display: flex;
    gap: 0;
    align-items: center;

    .howToOrder__run-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 55%;
      max-width: 360px;
      padding-left: $spacing-xl;
      gap: 1rem;
      padding-right: $spacing-xl;
      padding-top: $spacing-md;
      padding-bottom: $spacing-md;
      border-radius: $radius-md;
      font-size: $font-size-p;
      color: $green;

      img {
        width: 32px;
      }
    }

    .howToOrder__run__info {
      display: flex;
      align-items: center;
      width: 55%;
      max-width: 350px;
      justify-content: center;
      gap: 1rem;

      span {
        font-size: $font-size-p - 0.2rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;

        img {
          width: 2.4rem;
        }
      }
    }
  }

}

.mainHeader_wrapper {
  width: fit-content;
  margin: 0 auto;
  text-align: left;
  margin-bottom: $spacing-2xl;

  h1 {
    font-weight: $font-weight-bold;
    font-size: $font-size-h1;

    span {
      color: $primary;
    }
  }
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
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-2xl;

  a {
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
</style>