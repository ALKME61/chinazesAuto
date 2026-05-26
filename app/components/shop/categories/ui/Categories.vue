<script setup lang="ts">
import { categories } from '../types/indexCategories'

const imagesLoaded = ref<Record<number, boolean>>({})

const onImageLoad = (index: number) => {
  imagesLoaded.value[index] = true
}
</script>

<template>
  <section class="home-hero card-section">
    <h1><slot></slot></h1>
    <div class="categories">
      <NuxtLink 
        v-for="(category, index) in categories" 
        :key="category.title" 
        :to="category.to" 
        class="categories__card"
      >
        <!-- Скелетон (показывается только пока нет изображения) -->
        <div 
          v-if="!imagesLoaded[index]" 
          class="categories__card-skeleton"
        >
          <div class="skeleton-image"></div>
          <div class="skeleton-text"></div>
        </div>
        
        <!-- Изображение всегда в DOM, но видно только после загрузки -->
        <NuxtImg 
          :src="category.image" 
          :alt="category.title"
          :class="{ 'image-loaded': imagesLoaded[index] }"
          @load="onImageLoad(index)"
        />
        
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
  text-decoration: none;
  transition-duration: 0.3s;
  overflow: visible; // Меняем с hidden на visible чтобы изображение не обрезалось

  &:hover {
    background: #eeeeee;
    transition-duration: 0.3s;

    img {
      top: -4rem;
      width: min(14rem, 70%);
      transition-duration: 0.3s;
    }
  }

  img {
    position: absolute;
    top: -3rem;
    left: 50%;
    transform: translateX(-50%);
    width: min(12.5rem, 70%);
    transition-duration: 0.3s;
    opacity: 0; // Скрываем до загрузки
    z-index: 2;
    
    &.image-loaded {
      opacity: 1;
    }
  }

  span {
    font-size: 1.9rem;
    line-height: 1.25;
    position: relative;
    z-index: 1;
  }
}

// Стили для скелетона
.categories__card-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 3;
  background: #fafafa;
  border-radius: 2rem;
  
  .skeleton-image {
    position: relative;
    width: min(10rem, 60%);
    height: min(10rem, 60%);
    background: linear-gradient(
      90deg,
      #e0e0e0 25%,
      #f0f0f0 50%,
      #e0e0e0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 50%;
  }
  
  .skeleton-text {
    width: 80%;
    height: 2rem;
    background: linear-gradient(
      90deg,
      #e0e0e0 25%,
      #f0f0f0 50%,
      #e0e0e0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 1rem;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
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
  
  .categories__card-skeleton {
    .skeleton-image {
      width: 7rem;
      height: 7rem;
    }
    
    .skeleton-text {
      height: 1.4rem;
      width: 70%;
    }
  }
}
</style>