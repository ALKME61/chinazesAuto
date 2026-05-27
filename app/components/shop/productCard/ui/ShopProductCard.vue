<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    stock?: string
    delivery?: string
    price: string
    oldPrice?: string
    discount?: string
    image?: string
    to?: string
    variant?: 'catalog' | 'mini'
    showButton?: boolean
  }>(),
  {
    stock: 'В наличии 5 шт',
    delivery: 'Доставка 2-3 рабочих дня',
    image: '/productExample.png',
    variant: 'catalog',
    showButton: true,
  },
)
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="shop-product-card shop-product-card--link"
    :class="`shop-product-card--${variant}`"
  >
    <div class="shop-product-card__media">
      <NuxtImg :src="image" alt="Изображение товара" />
    </div>

    <div class="shop-product-card__body">
      <p class="shop-product-card__stock">{{ stock }}</p>
      <h3>{{ title }}</h3>
      <p class="shop-product-card__delivery">{{ delivery }}</p>

      <div class="shop-product-card__price-row">
        <strong>{{ price }}</strong>
        <span v-if="oldPrice" class="shop-product-card__old-price">{{ oldPrice }}</span>
        <span v-if="discount" class="shop-product-card__discount">{{ discount }}</span>
      </div>
    </div>

    <button v-if="showButton && variant === 'catalog'" type="button" class="shop-product-card__action">Добавить в корзину</button>
  </NuxtLink>

  <article v-else class="shop-product-card" :class="`shop-product-card--${variant}`">
    <div class="shop-product-card__media">
      <NuxtImg :src="image" alt="Изображение товара" />
    </div>

    <div class="shop-product-card__body">
      <p class="shop-product-card__stock">{{ stock }}</p>
      <h3>{{ title }}</h3>
      <p class="shop-product-card__delivery">{{ delivery }}</p>

      <div class="shop-product-card__price-row">
        <strong>{{ price }}</strong>
        <span v-if="oldPrice" class="shop-product-card__old-price">{{ oldPrice }}</span>
        <span v-if="discount" class="shop-product-card__discount">{{ discount }}</span>
      </div>
    </div>

    <button v-if="showButton && variant === 'catalog'" type="button" class="shop-product-card__action">Добавить в корзину</button>
  </article>
</template>

<style scoped lang="scss">
.shop-product-card {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  color: inherit;
}

.shop-product-card--link {
  text-decoration: none;
}

.shop-product-card__media {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 25.6rem;
  padding: 2rem;
  background: #fafafa;
  border-radius: 2rem;
  overflow: hidden;

  img {
    width: 100%;
    max-width: 20.4rem;
    object-fit: contain;
  }
}

.shop-product-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  h3 {
    font-size: 1.8rem;
    font-weight: 500;
    line-height: 1.3;
    color: #202020;
    min-height: 4.6rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.shop-product-card__stock {
  color: $green;
  font-size: 1.5rem;
}

.shop-product-card__delivery {
  color: #7b7b7b;
  font-size: 1.5rem;
}

.shop-product-card__price-row {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  flex-wrap: wrap;

  strong {
    color: #202020;
    font-size: 2rem;
    font-weight: 600;
  }
}

.shop-product-card__old-price {
  color: #9e9e9e;
  font-size: 1.6rem;
  text-decoration: line-through;
}

.shop-product-card__discount {
  color: #f24141;
  font-size: 1.6rem;
  font-weight: 600;
}

.shop-product-card__action {
  min-height: 5.2rem;
  border: 0;
  border-radius: 1.2rem;
  background: $linear-green;
  color: #fff;
  font-size: 1.7rem;
  font-weight: 600;
  cursor: pointer;
}

.shop-product-card--mini {
  gap: 1rem;

  .shop-product-card__media {
    min-height: 15rem;
    padding: 1.2rem;
    border-radius: 1.6rem;

    img {
      max-width: 11rem;
    }
  }

  .shop-product-card__body {
    gap: 0.5rem;

    h3 {
      font-size: 1.55rem;
      font-weight: 500;
      min-height: 4rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .shop-product-card__stock,
  .shop-product-card__delivery,
  .shop-product-card__price-row strong {
    font-size: 1.35rem;
  }

  .shop-product-card__old-price,
  .shop-product-card__discount {
    font-size: 1.3rem;
  }
}

@media (max-width: 767px) {
  .shop-product-card {
    gap: 1rem;
  }

  .shop-product-card__media {
    min-height: 14.8rem;
    padding: 1.2rem;
    border-radius: 1.6rem;

    img {
      max-width: 10.6rem;
    }
  }

  .shop-product-card__body {
    gap: 0.45rem;

    h3 {
      font-size: 1.35rem;
      font-weight: 500;
      min-height: 3.4rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .shop-product-card__stock,
  .shop-product-card__delivery {
    font-size: 1.1rem;
  }

  .shop-product-card__price-row {
    gap: 0.5rem;

    strong {
      font-size: 1.4rem;
    }
  }

  .shop-product-card__old-price,
  .shop-product-card__discount {
    font-size: 1.15rem;
  }

  .shop-product-card__action {
    min-height: 4.4rem;
    font-size: 1.45rem;
  }
}
</style>
