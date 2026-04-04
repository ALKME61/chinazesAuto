<script setup lang="ts">
const route = useRoute()

const selectedCar = 'BMW 5 IV седан (E39) 540 i'
const brandOptions = ['BOSCH', 'Zekkert', 'Stellox', 'Zekkert', 'Stellox']

const products = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  title: 'BOSCH S5 Аккумулятор',
  stock: 'В наличии 5 шт',
  delivery: index === 0 ? 'Доставка 24 часа' : 'Доставка 2-3 рабочих дня',
  isFastDelivery: index === 0,
  price: '12499₽',
  image: '/productExample.png',
}))

const pages = [1, 2, 3, 4]

const categoryName = computed(() => {
  const queryValue = route.query.categoryName

  if (typeof queryValue === 'string' && queryValue.length) {
    return queryValue
  }

  return 'accumulators'
})
</script>

<template>
  <section class="catalog-page" :data-category="categoryName">
    <aside class="catalog-filters">
      <div class="catalog-filters__title">
        <span class="catalog-filters__icon" />
        <h2>Фильтры</h2>
      </div>

      <div class="catalog-filter">
        <button class="catalog-filter__heading" type="button">
          <span class="catalog-filter__chevron catalog-filter__chevron--up" />
          <span>Бренд</span>
        </button>

        <label class="catalog-filter__search">
          <NuxtImg src="/icons/search.svg" alt="" />
          <input type="text" placeholder="Поиск">
        </label>

        <label class="catalog-filter__check catalog-filter__check--all">
          <input type="checkbox">
          <span class="catalog-filter__box" />
          <span>Все бренды</span>
        </label>

        <div class="catalog-filter__divider" />

        <label
          v-for="brandOption in brandOptions"
          :key="brandOption"
          class="catalog-filter__check"
        >
          <input type="checkbox">
          <span class="catalog-filter__box" />
          <span>{{ brandOption }}</span>
        </label>

        <button class="catalog-filter__more" type="button">
          Показать ещё
          <span class="catalog-filter__chevron catalog-filter__chevron--down" />
        </button>
      </div>

      <div class="catalog-filter">
        <button class="catalog-filter__heading" type="button">
          <span class="catalog-filter__chevron catalog-filter__chevron--up" />
          <span>Цена</span>
        </button>

        <div class="catalog-filter__price">
          <label>
            <input type="text" placeholder="От 2349">
          </label>

          <label>
            <input type="text" placeholder="До 23699">
          </label>
        </div>
      </div>

      <div class="catalog-filter catalog-filter--collapsed">
        <button class="catalog-filter__heading" type="button">
          <span class="catalog-filter__chevron catalog-filter__chevron--down" />
          <span>Тип конструкции</span>
        </button>
      </div>
    </aside>

    <section class="catalog-results">
      <div class="catalog-results__top">
        <div class="catalog-results__fit">
          <span>Подходит на:</span>
          <div class="catalog-results__fit-row">
            <strong>{{ selectedCar }}</strong>
            <button type="button" aria-label="Удалить выбранный автомобиль">×</button>
          </div>
        </div>

        <div class="catalog-results__sort">
          <button class="catalog-sort catalog-sort--active" type="button">
            <span class="catalog-sort__currency">₽↓</span>
            <span>По убыванию</span>
          </button>

          <button class="catalog-sort" type="button">
            <span class="catalog-sort__doc" />
            <span>Популярные</span>
          </button>

          <button class="catalog-sort" type="button">
            <span class="catalog-sort__clock" />
            <span>Быстрее всего</span>
          </button>
        </div>
      </div>

      <div class="catalog-grid">
        <article
          v-for="product in products"
          :key="product.id"
          class="catalog-card"
        >
          <div class="catalog-card__image">
            <NuxtImg :src="product.image" alt="Изображение аккумулятора" />
          </div>

          <div class="catalog-card__content">
            <span class="catalog-card__stock">{{ product.stock }}</span>
            <h3>{{ product.title }}</h3>
            <p :class="{ 'catalog-card__delivery--fast': product.isFastDelivery }">
              {{ product.delivery }}
            </p>
            <strong>{{ product.price }}</strong>
          </div>

          <button class="catalog-card__button" type="button">Добавить в корзину</button>
        </article>
      </div>

      <nav class="catalog-pagination" aria-label="Пагинация каталога">
        <button class="catalog-pagination__arrow" type="button" aria-label="Предыдущая страница">
          <span />
        </button>

        <button
          v-for="page in pages"
          :key="page"
          class="catalog-pagination__page"
          :class="{ 'catalog-pagination__page--active': page === 1 }"
          type="button"
        >
          {{ page }}
        </button>

        <button class="catalog-pagination__arrow catalog-pagination__arrow--next" type="button" aria-label="Следующая страница">
          <span />
        </button>
      </nav>
    </section>
  </section>
</template>

<style scoped lang="scss">
.catalog-page {
  display: grid;
  grid-template-columns: clamp(24rem, 19vw, 27.6rem) minmax(0, 1fr);
  gap: clamp(1.4rem, 1.5vw, 1.8rem);
  width: $content-width;
  margin: 0 auto;
}

.catalog-filters,
.catalog-results {
  background: #fff;
  border-radius: 2rem;
}

.catalog-filters {
  height: fit-content;
  padding: 2.1rem 1.8rem 2.3rem;
}

.catalog-filters__title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    color: #383838;
  }
}

.catalog-filters__icon {
  position: relative;
  width: 1.6rem;
  height: 1.2rem;

  &::before,
  &::after {
    position: absolute;
    left: 0;
    width: 100%;
    height: 0.2rem;
    background: #8e8e8e;
    border-radius: 999px;
    content: '';
  }

  &::before {
    top: 0.2rem;
  }

  &::after {
    top: 1rem;
    width: 0.8rem;
  }
}

.catalog-filter + .catalog-filter {
  margin-top: 2.1rem;
}

.catalog-filter__heading {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0;
  margin-bottom: 1.5rem;
  background: transparent;
  border: 0;
  font-size: 1.35rem;
  font-weight: 500;
  color: #383838;
  cursor: pointer;
}

.catalog-filter__chevron {
  width: 0.75rem;
  height: 0.75rem;
  border-right: 1.5px solid #8c8c8c;
  border-bottom: 1.5px solid #8c8c8c;
  flex-shrink: 0;
}

.catalog-filter__chevron--up {
  transform: rotate(225deg);
}

.catalog-filter__chevron--down {
  transform: rotate(45deg);
}

.catalog-filter__search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 4rem;
  margin-bottom: 1.8rem;
  background: #f4f4f4;
  border-radius: 1rem;

  img {
    position: absolute;
    left: 1.3rem;
    width: 1.6rem;
    opacity: 0.45;
  }

  input {
    width: 100%;
    height: 100%;
    padding: 0 1.4rem 0 4rem;
    background: transparent;
    border: 0;
    font-size: 1.2rem;
    color: #353535;

    &::placeholder {
      color: #a4a4a4;
    }
  }
}

.catalog-filter__check {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  color: #5f5f5f;
  cursor: pointer;

  input {
    display: none;
  }
}

.catalog-filter__check + .catalog-filter__check {
  margin-top: 1rem;
}

.catalog-filter__check--all {
  margin-bottom: 1.3rem;
}

.catalog-filter__box {
  width: 1.4rem;
  height: 1.4rem;
  border: 1px solid #c7c7c7;
  border-radius: 0.3rem;
  flex-shrink: 0;
  background: #fff;
}

.catalog-filter__divider {
  width: 100%;
  height: 1px;
  margin-bottom: 1.2rem;
  background: #dddddd;
}

.catalog-filter__more {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0;
  margin-top: 1.3rem;
  background: transparent;
  border: 0;
  font-size: 1.2rem;
  color: $green;
  cursor: pointer;

  .catalog-filter__chevron {
    width: 0.7rem;
    height: 0.7rem;
    border-color: $green;
  }
}

.catalog-filter__price {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;

  input {
    width: 100%;
    height: 4rem;
    padding: 0 1.2rem;
    border: 1px solid #d3d3d3;
    border-radius: 0.9rem;
    font-size: 1.2rem;
    color: #444;

    &::placeholder {
      color: #9b9b9b;
    }
  }
}

.catalog-filter--collapsed {
  margin-top: 1.9rem;

  .catalog-filter__heading {
    margin-bottom: 0;
  }
}

.catalog-results {
  padding: 2rem 2rem 3rem;
}

.catalog-results__top {
  margin-bottom: 1.8rem;
}

.catalog-results__fit {
  margin-bottom: 2rem;

  span {
    display: block;
    margin-bottom: 0.8rem;
    font-size: 1.2rem;
    color: #8f8f8f;
  }
}

.catalog-results__fit-row {
  display: flex;
  align-items: center;
  gap: 1.4rem;

  strong {
    font-size: 1.8rem;
    font-weight: 500;
    color: #1e1e1e;
  }

  button {
    padding: 0;
    background: transparent;
    border: 0;
    font-size: 2.4rem;
    line-height: 1;
    color: $orange;
    cursor: pointer;
  }
}

.catalog-results__sort {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
}

.catalog-sort {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  min-height: 4rem;
  padding: 0 1.8rem;
  background: #edf9ef;
  border: 0;
  border-radius: 0.8rem;
  font-size: 1.6rem;
  color: $green;
  cursor: pointer;
}

.catalog-sort--active {
  background: $linear-green;
  color: #fff;
}

.catalog-sort__currency {
  font-size: 1.8rem;
  line-height: 1;
}

.catalog-sort__doc,
.catalog-sort__clock {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

.catalog-sort__doc {
  width: 1.6rem;
  height: 2rem;
  border: 1.8px solid currentColor;
  border-radius: 0.35rem;

  &::before,
  &::after {
    position: absolute;
    left: 0.35rem;
    width: 0.7rem;
    height: 0.14rem;
    background: currentColor;
    content: '';
  }

  &::before {
    top: 0.55rem;
  }

  &::after {
    top: 0.95rem;
    width: 1rem;
  }
}

.catalog-sort__clock {
  width: 1.9rem;
  height: 1.9rem;
  border: 1.8px solid currentColor;
  border-radius: 50%;

  &::before,
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    background: currentColor;
    content: '';
    transform-origin: top left;
  }

  &::before {
    width: 0.14rem;
    height: 0.55rem;
    transform: translate(-50%, -80%);
  }

  &::after {
    width: 0.45rem;
    height: 0.14rem;
    transform: translate(-5%, -50%);
  }
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4.2rem 2.4rem;
}

.catalog-card {
  display: flex;
  flex-direction: column;
}

.catalog-card__image {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 0.82;
  margin-bottom: 1.4rem;
  background: #f7f7f7;
  border-radius: 1.4rem;

  img {
    width: 71%;
    object-fit: contain;
  }
}

.catalog-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.7rem;
    font-weight: 500;
    line-height: 1.25;
    color: #202020;
  }

  p {
    margin-bottom: 1.2rem;
    font-size: 1.3rem;
    color: #757575;
    line-height: 1.3;
  }

  strong {
    margin-bottom: 1.4rem;
    font-size: 1.9rem;
    font-weight: 500;
    color: #1f1f1f;
  }
}

.catalog-card__stock {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: #34c759;
}

.catalog-card__delivery--fast {
  color: #34c759 !important;
}

.catalog-card__button {
  width: 100%;
  min-height: 4.8rem;
  background: $linear-green;
  border: 0;
  border-radius: 0.8rem;
  font-size: 1.6rem;
  color: #fff;
  cursor: pointer;
}

.catalog-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.4rem;
  margin-top: 3.4rem;
}

.catalog-pagination__page,
.catalog-pagination__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  padding: 0;
  background: transparent;
  border: 0;
  font-size: 1.5rem;
  color: #7f7f7f;
  cursor: pointer;
}

.catalog-pagination__page--active {
  color: $green;
}

.catalog-pagination__arrow span {
  width: 0.9rem;
  height: 0.9rem;
  border-right: 1.5px solid #8a8a8a;
  border-bottom: 1.5px solid #8a8a8a;
  transform: rotate(135deg);
}

.catalog-pagination__arrow--next span {
  transform: rotate(-45deg);
}

@media (max-width: 1600px) {
  .catalog-results {
    padding: 1.8rem 1.8rem 2.6rem;
  }

  .catalog-grid {
    gap: 3.4rem 2rem;
  }

  .catalog-card__content {
    h3 {
      font-size: 1.6rem;
    }

    strong {
      font-size: 1.8rem;
    }
  }
}

@media (max-width: 1480px) {
  .catalog-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .catalog-results__fit-row {
    strong {
      font-size: 1.6rem;
    }
  }

  .catalog-sort {
    min-height: 3.8rem;
    padding: 0 1.5rem;
    font-size: 1.4rem;
  }
}

@media (max-width: 1280px) {
  .catalog-page {
    grid-template-columns: 23rem minmax(0, 1fr);
    gap: 1.2rem;
  }

  .catalog-filters {
    padding: 1.8rem 1.5rem 2rem;
  }

  .catalog-results {
    padding: 1.6rem 1.6rem 2.2rem;
  }

  .catalog-results__top {
    margin-bottom: 1.5rem;
  }

  .catalog-results__fit {
    margin-bottom: 1.6rem;
  }

  .catalog-results__fit-row {
    gap: 1rem;

    strong {
      font-size: 1.45rem;
    }
  }

  .catalog-results__sort {
    gap: 0.8rem;
  }

  .catalog-sort {
    gap: 0.8rem;
    min-height: 3.6rem;
    padding: 0 1.2rem;
    font-size: 1.3rem;
  }

  .catalog-sort__currency {
    font-size: 1.6rem;
  }

  .catalog-sort__doc {
    width: 1.4rem;
    height: 1.7rem;
  }

  .catalog-sort__clock {
    width: 1.6rem;
    height: 1.6rem;
  }

  .catalog-grid {
    gap: 3rem 1.6rem;
  }

  .catalog-card__image {
    margin-bottom: 1.1rem;
    border-radius: 1.1rem;
  }

  .catalog-card__content {
    h3 {
      margin-bottom: 0.8rem;
      font-size: 1.45rem;
    }

    p {
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    strong {
      margin-bottom: 1.2rem;
      font-size: 1.7rem;
    }
  }

  .catalog-card__stock {
    margin-bottom: 0.8rem;
    font-size: 1.2rem;
  }

  .catalog-card__button {
    min-height: 4.2rem;
    font-size: 1.4rem;
  }

  .catalog-pagination {
    margin-top: 2.8rem;
  }
}

@media (max-width: 1120px) {
  .catalog-page {
    grid-template-columns: 21rem minmax(0, 1fr);
  }

  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .catalog-results__fit-row {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .catalog-sort {
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>
