<script setup lang="ts">
import { categories } from '../types/indexCategories'
</script>
<template>
    <section class="home-hero card-section">
      <h1><slot></slot></h1>
      <div class="categories">
        <NuxtLink v-for="category in categories" :key="category.title" :to="category.to" class="categories__card">
          <NuxtImg :src="category.image" :alt="category.title" />
          <span>{{ category.title }}</span>
        </NuxtLink>
      </div>
    </section>
</template>


<style scoped lang="scss">
  .home-hero {
    background: #fff;
  }

  .home-hero h1 {
    margin-bottom: 2rem;
    text-align: left;
    font-size: 2.4rem;
  }
  .card-section {
  padding: 3.2rem;
  background: #fff;
  border-radius: 2.8rem;
  box-shadow: 0 20px 50px rgba(28, 30, 32, 0.05);
}

.categories {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
}

.categories__card:hover {
  background: #eeeeee;

  img {
    top: -4rem;
    width: min(14rem, 70%);
    transition-duration: 0.3s;
  }

  transition-duration: 0.3s;
}

.categories__card {
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
@media (max-width: 991px) {
  .categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {

  .card-section {
    padding: 1.6rem;
    border-radius: 2rem;
  }
    .categories {
    gap: 1.2rem;
  }

  .categories__card {
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
}
</style>
