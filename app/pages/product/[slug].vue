<script setup lang="ts">
import ShopProductCard from '~/components/shop/ShopProductCard.vue'

definePageMeta({ layout: 'default' })

const route = useRoute()

const product = {
  title: 'BOSCH S5 Аккумулятор',
  price: '12499₽',
  oldPrice: '14399₽',
  discount: '-20%',
  stock: 'В наличии 5 шт',
  rating: 4.7,
  reviews: '4000+',
  reviewer: 'Николай',
  reviewerText: 'Аккумулятор топовый вообще, но важно проверить размеры перед покупкой.',
  delivery: 'Послезавтра',
  images: ['/productExample.png', '/money.png', '/productExample.png'],
}

const characteristics = [
  ['Мощность', '350w'],
  ['Профи-фактор', 'Коробочка'],
  ['Ёмкость', '75 Ач'],
  ['Полярность', 'Обратная'],
]

const fitmentRows = [
  ['BMW', '520i', 'IV(E69)', '2.0L', '2006-2010'],
  ['BMW', '520i', 'IV(E69)', '2.0L', '2006-2010'],
  ['BMW', '520i', 'IV(E69)', '2.0L', '2006-2010'],
]

const analogs = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  title: 'ELECTRO аккумулятор',
  stock: 'В наличии 5 шт',
  delivery: '3 рабочих дня',
  price: '12499₽',
  image: '/productExample.png',
  to: `/product/analog-${index + 1}`,
}))

const currentSlide = ref(0)

const activeImage = computed(() => product.images[currentSlide.value] ?? product.images[0])
const slugTitle = computed(() => {
  const raw = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  return raw ? product.title : product.title
})
</script>

<template>
  <main class="product-page shop-page">
    <section class="product-page__hero card-surface">
      <div class="product-page__gallery">
        <div class="product-page__gallery-actions product-page__gallery-actions--mobile">
          <button type="button" aria-label="Назад">←</button>
          <button type="button" aria-label="Поделиться">↗</button>
        </div>

        <div class="product-page__gallery-frame">
          <NuxtImg :src="activeImage" :alt="slugTitle" />
        </div>

        <div class="product-page__gallery-dots">
          <div
            v-for="(_, index) in product.images"
            :key="index"
            type="button"
            :class="{ 'is-active': index === currentSlide }"
            @click="currentSlide = index"
          />
        </div>

        <div class="product-page__gallery-thumbs">
          <button
            v-for="(image, index) in product.images"
            :key="`${image}-${index}`"
            type="button"
            :class="{ 'is-active': index === currentSlide }"
            @click="currentSlide = index"
          >
            <NuxtImg :src="image" :alt="`${slugTitle} ${index + 1}`" />
          </button>
        </div>
      </div>

      <aside class="product-page__summary">
        <div class="product-page__summary-head">
          <div class="product-page__price-row">
            <strong>{{ product.price }}</strong>
            <span>{{ product.oldPrice }}</span>
            <em>{{ product.discount }}</em>
          </div>
          <button type="button" class="product-page__share product-page__share--desktop">Поделиться</button>
        </div>

        <div class="product-page__info-card card-inner">
          <h1>{{ product.title }}</h1>
          <p>{{ product.stock }}</p>

          <div class="product-page__review-strip">
            <div class="product-page__rating-card">
              <strong>★ {{ product.rating }}</strong>
              <span>Отзывы {{ product.reviews }}</span>
            </div>

            <div class="product-page__review-card">
              <NuxtImg src="/productExample.png" alt="Отзыв о товаре" />
              <div>
                <div class="product-page__review-stars">★★★★☆</div>
                <strong>{{ product.reviewer }}</strong>
                <span>{{ product.reviewerText }}</span>
              </div>
            </div>
          </div>

          <button type="button" class="product-page__cart-button">
            <span>Добавить в корзину</span>
            <small>{{ product.delivery }}</small>
          </button>
        </div>
      </aside>
    </section>

    <section class="product-page__details-grid">
      <article class="product-page__details-card card-surface">
        <header>
          <h2>Характеристики</h2>
        </header>

        <div class="product-page__table">
          <div v-for="item in characteristics" :key="item[0]" class="product-page__table-row">
            <span>{{ item[0] }}</span>
            <strong>{{ item[1] }}</strong>
          </div>
        </div>

        <button type="button" class="product-page__more-link">Все характеристики</button>
      </article>

      <article class="product-page__details-card card-surface">
        <header>
          <h2>На что подходит</h2>
        </header>

        <div class="product-page__fitment-table">
          <div v-for="(row, index) in fitmentRows" :key="index" class="product-page__fitment-row">
            <span v-for="cell in row" :key="cell">{{ cell }}</span>
          </div>
        </div>

        <button type="button" class="product-page__more-link">Все автомобили</button>
      </article>
    </section>

    <section class="product-page__analogs card-surface">
      <header class="product-page__analogs-head">
        <h2>Аналоги</h2>
      </header>

      <div class="product-page__analogs-grid">
        <ShopProductCard
          v-for="analog in analogs"
          :key="analog.id"
          :title="analog.title"
          :stock="analog.stock"
          :delivery="analog.delivery"
          :price="analog.price"
          :image="analog.image"
          :to="analog.to"
          variant="mini"
          :show-button="false"
        />
      </div>
    </section>

    <button type="button" class="product-page__mobile-sticky-cart">
      <span>Добавить в корзину</span>
      <small>{{ product.delivery }}</small>
    </button>
  </main>
</template>

<style scoped lang="scss">
.shop-page {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.card-surface {
  background: #fff;
  border-radius: 2.8rem;
  box-shadow: 0 18px 44px rgba(28, 30, 32, 0.05);
}

.card-inner {
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.product-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.product-page__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(38rem, 44rem);
  gap: 2.4rem;
  padding: 2.8rem;
}

.product-page__gallery {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.product-page__gallery-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4.4rem;
    height: 4.4rem;
    border: 0;
    border-radius: 1.2rem;
    background: #fff;
    box-shadow: 0 12px 28px rgba(28, 30, 32, 0.06);
    color: #383838;
    font-size: 2rem;
  }
}

.product-page__gallery-actions--mobile {
  display: none;
}

.product-page__gallery-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50rem;
  padding: 3rem;
  background: #fff;
  border-radius: 2.8rem;

  img {
    width: min(44rem, 100%);
  }
}

.product-page__gallery-dots {
  display: flex;
  justify-content: center;
  gap: 4px;
  div {
    width: 8px;
    height: 8px;
    border: 0;
    border-radius: 50%;
    background: #d9d9d9;
  }

  .is-active {
    background: $green;
  }
}

.product-page__gallery-thumbs {
  display: flex;
  gap: 1rem;

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 9rem;
    height: 9rem;
    padding: 1rem;
    border: 1px solid transparent;
    border-radius: 1.8rem;
    background: #fafafa;

    &.is-active {
      border-color: rgba(16, 174, 59, 0.35);
    }

    img {
      width: 100%;
    }
  }
}

.product-page__summary {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.product-page__summary-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.product-page__price-row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;

  strong {
    color: #ff9800;
    font-size: 3.2rem;
    font-weight: 700;
  }

  span {
    color: #9a9a9a;
    font-size: 2rem;
    text-decoration: line-through;
  }

  em {
    color: #f24141;
    font-style: normal;
    font-size: 2rem;
    font-weight: 600;
  }
}

.product-page__share {
  border: 0;
  background: transparent;
  color: #6b6b6b;
  font-size: 1.5rem;
}

.product-page__info-card {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;

  h1 {
    color: #1f1f1f;
    font-size: 3rem;
    font-weight: 700;
  }

  p {
    color: $green;
    font-size: 1.8rem;
  }
}

.product-page__review-strip {
  display: grid;
  grid-template-columns: 13rem minmax(0, 1fr);
  gap: 1rem;
}

.product-page__rating-card,
.product-page__review-card {
  padding: 1.6rem;
  background: #fafafa;
  border-radius: 1.8rem;
}

.product-page__rating-card {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  strong {
    color: #303030;
    font-size: 2rem;
  }

  span {
    color: #6d6d6d;
    font-size: 1.4rem;
  }
}

.product-page__review-card {
  display: grid;
  grid-template-columns: 8rem minmax(0, 1fr);
  gap: 1.2rem;

  img {
    width: 100%;
    padding: 0.8rem;
    background: #fff;
    border-radius: 1.2rem;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  strong {
    color: #55a84f;
    font-size: 1.7rem;
    font-weight: 500;
  }

  span {
    color: #6d6d6d;
    font-size: 1.4rem;
    line-height: 1.3;
  }
}

.product-page__review-stars {
  color: #ffc107;
  font-size: 1.7rem;
  letter-spacing: 0.2rem;
}

.product-page__cart-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-height: 7rem;
  border: 0;
  border-radius: 1.8rem;
  background: $green;
  color: #fff;

  span {
    font-size: 2rem;
    font-weight: 600;
  }

  small {
    font-size: 1.5rem;
    opacity: 0.9;
  }
}

.product-page__details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
}

.product-page__details-card,
.product-page__analogs {
  padding: 2.4rem;
}

.product-page__details-card {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  h2 {
    color: #2b2b2b;
    font-size: 2.2rem;
    font-weight: 700;
  }
}

.product-page__table,
.product-page__fitment-table {
  display: flex;
  flex-direction: column;
}

.product-page__table-row,
.product-page__fitment-row {
  display: grid;
  align-items: center;
  gap: 1.2rem;
  padding: 1.3rem 0;
  border-bottom: 1px solid #f1f1f1;

  &:last-child {
    border-bottom: 0;
  }
}

.product-page__table-row {
  grid-template-columns: minmax(0, 1fr) auto;

  span {
    color: #9a9a9a;
    font-size: 1.6rem;
  }

  strong {
    color: #2c2c2c;
    font-size: 1.6rem;
    font-weight: 500;
  }
}

.product-page__fitment-row {
  grid-template-columns: repeat(5, minmax(0, 1fr));

  span {
    color: #8d8d8d;
    font-size: 1.55rem;
  }
}

.product-page__more-link {
  align-self: center;
  border: 0;
  background: transparent;
  color: $orange;
  font-size: 1.7rem;
  font-weight: 500;
}

.product-page__analogs-head {
  margin-bottom: 2rem;

  h2 {
    color: #2b2b2b;
    font-size: 2.2rem;
    font-weight: 700;
  }
}

.product-page__analogs-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.4rem;
}

.product-page__mobile-sticky-cart {
  display: none;
}

@media (max-width: 1199px) {
  .product-page__hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 991px) {
  .product-page__details-grid {
    grid-template-columns: 1fr;
  }

  .product-page__analogs-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .shop-page {
    width: 100%;
  }

  .product-page {
    gap: 0.8rem;
    padding-bottom: 9.6rem;
  }

  .card-surface,
  .card-inner {
    border-radius: 0;
    box-shadow: none;
  }

  .product-page__hero {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 0;
  }

  .product-page__gallery {
    gap: 0.8rem;
    padding: 0 0 0.8rem;
    background: #fff;
  }

  .product-page__gallery-actions--mobile {
    display: flex;
    padding: 1.6rem 1.6rem 0;
  }

  .product-page__gallery-actions button {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: #f3f3f3;
    box-shadow: none;
    font-size: 1.8rem;
  }

  .product-page__gallery-frame {
    min-height: 29rem;
    padding: 0 2rem 1rem;
    border-radius: 0;
  }

  .product-page__gallery-frame img {
    width: min(24rem, 100%);
  }

  .product-page__gallery-dots {
    gap: 0.6rem;
  }

  .product-page__gallery-dots div {
    width: 0.8rem;
    height: 0.8rem;
  }

  .product-page__gallery-thumbs,
  .product-page__share--desktop {
    display: none;
  }

  .product-page__summary {
    gap: 0;
  }

  .product-page__summary-head {
    padding: 0 1.6rem;
  }

  .product-page__price-row {
    gap: 0.8rem;

    strong,
    span,
    em {
      font-size: 1.6rem;
    }
  }

  .product-page__info-card {
    gap: 1.4rem;
    padding: 1.8rem 1.6rem;
    border-radius: 2.2rem 2.2rem 0 0;

    h1 {
      font-size: 1.65rem;
    }

    p {
      font-size: 1.35rem;
    }
  }

  .product-page__review-strip {
    grid-template-columns: 8.8rem minmax(0, 1fr);
  }

  .product-page__rating-card,
  .product-page__review-card {
    padding: 1rem;
    border-radius: 1.4rem;
  }

  .product-page__rating-card {
    gap: 1rem;

    strong {
      font-size: 1.4rem;
    }

    span {
      font-size: 1.2rem;
    }
  }

  .product-page__review-card {
    grid-template-columns: 6rem minmax(0, 1fr);
    gap: 0.8rem;

    strong {
      font-size: 1.35rem;
    }

    span {
      font-size: 1.15rem;
    }
  }

  .product-page__review-stars {
    font-size: 1.35rem;
    letter-spacing: 0.1rem;
  }

  .product-page__cart-button {
    display: none;
  }

  .product-page__details-grid {
    gap: 0.8rem;
  }

  .product-page__details-card,
  .product-page__analogs {
    padding: 1.8rem 1.6rem;
    border-radius: 2rem;
    box-shadow: none;
  }

  .product-page__details-card h2,
  .product-page__analogs-head h2 {
    font-size: 1.7rem;
  }

  .product-page__table-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    span,
    strong {
      font-size: 1.3rem;
    }
  }

  .product-page__fitment-row {
    grid-template-columns: repeat(5, minmax(0, 1fr));

    span {
      font-size: 1.2rem;
    }
  }

  .product-page__more-link {
    font-size: 1.45rem;
  }

  .product-page__analogs-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  .product-page__mobile-sticky-cart {
    position: fixed;
    right: 0.8rem;
    bottom: 0.8rem;
    left: 0.8rem;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    min-height: 5.8rem;
    border: 0;
    border-radius: 1.6rem;
    background: $green;
    color: #fff;

    span {
      font-size: 1.7rem;
      font-weight: 600;
    }

    small {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }
}
</style>
