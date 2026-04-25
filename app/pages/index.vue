<script setup lang="ts">
import Categories from '~/components/shop/widgets/categories/ui/Categories.vue';
import HowToOrder from '~/components/shop/widgets/howToOrder/HowToOrder.vue';

definePageMeta({ layout: 'default' })
useHead({
  meta: [
    { name: 'theme-color', content: '#ffffff' },
  ]
})

</script>

<template>
  <main class="home-page shop-page">
    <h1 class="home-header">Запчасти <span>ЧиназесАвто</span></h1>
    <Categories>Каталог</Categories>

    <HowToOrder></HowToOrder>
  </main>
</template>

<style scoped lang="scss">
.shop-page {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
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
