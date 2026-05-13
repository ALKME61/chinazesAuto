<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({
  middleware: auth
})

import Button from '~/shared/ui-kit/Button/Button.vue'
const cartItems = ref([
  {
    id: 1,
    title: 'Аккумулятор Hiki-Lo',
    article: 'GL421SA',
    category: 'АКБ',
    price: 12499,
    oldPrice: 14399,
    discount: '-20%',
    image: '/productExample.png',
    quantity: 1,
    selected: true,
  },
  {
    id: 2,
    title: 'Аккумулятор Hiki-Lo',
    article: 'GL421SA',
    category: 'АКБ',
    price: 12499,
    oldPrice: 14399,
    discount: '-20%',
    image: '/productExample.png',
    quantity: 1,
    selected: true,
  },
])

const selectAll = computed({
  get: () => cartItems.value.every(item => item.selected),
  set: (value: boolean) => {
    cartItems.value = cartItems.value.map(item => ({ ...item, selected: value }))
  },
})

const selectedItems = computed(() => cartItems.value.filter(item => item.selected))
const selectedCount = computed(() => selectedItems.value.reduce((sum, item) => sum + item.quantity, 0))
const totalPrice = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

function formatPrice(value: number) {
  return `${value}₽`
}

function decreaseQuantity(id: number) {
  cartItems.value = cartItems.value.map((item) => {
    if (item.id !== id) {
      return item
    }

    return {
      ...item,
      quantity: Math.max(1, item.quantity - 1),
    }
  })
}

function increaseQuantity(id: number) {
  cartItems.value = cartItems.value.map((item) => {
    if (item.id !== id) {
      return item
    }

    return {
      ...item,
      quantity: item.quantity + 1,
    }
  })
}

function removeItem(id: number) {
  cartItems.value = cartItems.value.filter(item => item.id !== id)
}
</script>

<template>
  <main class="cart-page shop-page">

    <div class="cart-page__layout">
      <section class="cart-page__items card-surface">
        <label class="cart-page__select-all">
          <input v-model="selectAll" type="checkbox">
          <span class="cart-page__checkbox" />
          <em>Выбрать всё</em>
        </label>

        <article v-for="item in cartItems" :key="item.id" class="cart-page__item">
          <label class="cart-page__item-check">
            <input v-model="item.selected" type="checkbox">
            <span class="cart-page__checkbox" />
          </label>

          <div class="cart-page__image">
            <NuxtImg :src="item.image" :alt="item.title" />
          </div>

          <div class="cart-page__content">
            <div class="cart-page__price-row">
              <strong>{{ formatPrice(item.price) }}</strong>
              <span>{{ formatPrice(item.oldPrice) }}</span>
              <em>{{ item.discount }}</em>
            </div>

            <h2>{{ item.title }}</h2>
            <p>{{ item.article }}</p>
            <small>{{ item.category }}</small>

            <div class="cart-page__actions">
              <button type="button" class="cart-page__trash" @click="removeItem(item.id)">
                <NuxtImg src="/icons/delete.svg" alt="Удалить" />
              </button>

              <div class="cart-page__qty">
                <button type="button" @click="decreaseQuantity(item.id)">−</button>
                <span>{{ item.quantity }}</span>
                <button type="button" @click="increaseQuantity(item.id)">+</button>
              </div>
            </div>
          </div>
        </article>
      </section>

      <aside class="cart-page__summary card-surface">
        <h2>Корзина</h2>

        <div class="cart-page__summary-row">
          <span>Выбрано товаров</span>
          <strong>{{ selectedCount }} ед</strong>
        </div>

        <div class="cart-page__summary-row">
          <span>Итого</span>
          <strong>{{ formatPrice(totalPrice) }}</strong>
        </div>

        <div class="cart-page__summary-row">
          <span>Баланс аккаунта</span>
          <strong>14400₽</strong>
        </div>

        <Button :subtext="`${formatPrice(totalPrice)} · ${selectedCount} ед`">Перейти к оформлению</Button>
      </aside>
    </div>
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

.cart-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cart-page__pickup {
  display: inline-flex;
  align-items: center;
  gap: 1.2rem;
  min-height: 6.2rem;
  padding: 0 2rem;
  color: #fff;
  background: $linear-green;

  img {
    width: 1.9rem;
    filter: brightness(0) invert(1);
  }

  span {
    flex: 1;
    font-size: 1.75rem;
    font-weight: 600;
  }

  i {
    width: 0.8rem;
    height: 0.8rem;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(45deg);
  }
}

.cart-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 34rem;
  gap: 2rem;
  align-items: start;
}

.cart-page__items {
  padding: 2.4rem;
}

.cart-page__select-all,
.cart-page__item-check {
  display: inline-flex;
  align-items: center;
  gap: 1.2rem;

  input {
    display: none;
  }
}

.cart-page__select-all {
  margin-bottom: 1.8rem;

  em {
    color: #404040;
    font-style: normal;
    font-size: 1.7rem;
  }
}

.cart-page__checkbox {
  position: relative;
  width: 2.2rem;
  height: 2.2rem;
  border: 1px solid #ff9800;
  border-radius: 0.6rem;
  background: #fff;
}

input:checked + .cart-page__checkbox {
  background: #ff9800;

  &::after {
    position: absolute;
    top: 0.35rem;
    left: 0.7rem;
    width: 0.5rem;
    height: 0.9rem;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(45deg);
    content: '';
  }
}

.cart-page__item {
  display: grid;
  grid-template-columns: auto 14rem minmax(0, 1fr);
  gap: 1.6rem;
  padding: 2rem 0;
  border-top: 1px solid #f0f0f0;
}

.cart-page__image {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #fafafa;
  border-radius: 1.8rem;

  img {
    width: 100%;
    max-width: 10.6rem;
  }
}

.cart-page__content {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  h2 {
    color: #2e2e2e;
    font-size: 1.95rem;
    font-weight: 500;
  }

  p,
  small {
    color: #8a8a8a;
    font-size: 1.55rem;
  }
}

.cart-page__price-row {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  flex-wrap: wrap;

  strong {
    color: #ff9800;
    font-size: 2rem;
    font-weight: 700;
  }

  span {
    color: #9b9b9b;
    font-size: 1.6rem;
    text-decoration: line-through;
  }

  em {
    color: #e14d5a;
    font-style: normal;
    font-size: 1.6rem;
    font-weight: 600;
  }
}

.cart-page__actions {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 0.4rem;
}

.cart-page__trash {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border: 0;
  background: transparent;

  img {
    width: 1.8rem;
    opacity: 0.65;
  }
}

.cart-page__qty {
  display: inline-flex;
  align-items: center;
  gap: 1.4rem;
  min-height: 4.4rem;
  padding: 0 1.3rem;
  border: 1px solid #ececec;
  border-radius: 1.3rem;

  button {
    border: 0;
    background: transparent;
    color: #8c8c8c;
    font-size: 2rem;
    line-height: 1;
  }

  span {
    min-width: 1.4rem;
    color: #2d2d2d;
    font-size: 1.6rem;
    text-align: center;
  }
}

.cart-page__summary {
  position: sticky;
  top: 13rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 2.4rem;

  h2 {
    color: #2d2d2d;
    font-size: 2.8rem;
    font-weight: 700;
  }
}

.cart-page__summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;

  span {
    color: #7f7f7f;
    font-size: 1.55rem;
  }

  strong {
    color: #2d2d2d;
    font-size: 1.85rem;
  }
}

.cart-page__submit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 6.2rem;
  margin-top: 0.4rem;
  border: 0;
  border-radius: 1.6rem;
  background: $linear-green;
  color: #fff;

  span {
    font-size: 1.8rem;
    font-weight: 600;
  }

  small {
    font-size: 1.45rem;
    opacity: 0.88;
  }
}

@media (max-width: 991px) {
  .cart-page__layout {
    grid-template-columns: 1fr;
  }

  .cart-page__summary {
    position: static;
  }
}

@media (max-width: 767px) {
  .shop-page {
    width: calc(100% - 3rem);
  }

  .card-surface {
    border-radius: 1.8rem;
  }

  .cart-page {
    gap: 1.4rem;
  }

  .cart-page__pickup {
    min-height: 5.2rem;
    padding: 0 1.4rem;

    span {
      font-size: 1.45rem;
    }
  }

  .cart-page__items {
    padding: 1.6rem 1.4rem;
  }

  .cart-page__select-all {
    margin-bottom: 1.2rem;

    em {
      font-size: 1.45rem;
    }
  }

  .cart-page__checkbox {
    width: 1.9rem;
    height: 1.9rem;
  }

  input:checked + .cart-page__checkbox::after {
    top: 0.25rem;
    left: 0.6rem;
  }

  .cart-page__item {
    grid-template-columns: auto 9.6rem minmax(0, 1fr);
    gap: 1rem;
    padding: 1.6rem 0;
  }

  .cart-page__image {
    align-self: start;
    padding: 0.8rem;
    border-radius: 1.4rem;

    img {
      max-width: 7.4rem;
    }
  }

  .cart-page__content {
    gap: 0.4rem;

    h2 {
      font-size: 1.4rem;
    }

    p,
    small {
      font-size: 1.2rem;
    }
  }

  .cart-page__price-row {
    gap: 0.6rem;

    strong,
    span,
    em {
      font-size: 1.3rem;
    }
  }

  .cart-page__actions {
    gap: 0.6rem;
    margin-top: 0.8rem;
  }

  .cart-page__trash {
    width: 3.2rem;
    height: 3.2rem;

    img {
      width: 1.4rem;
    }
  }

  .cart-page__qty {
    min-height: 3.6rem;
    gap: 1.1rem;
    padding: 0 1rem;
    border-radius: 1rem;

    button {
      font-size: 1.7rem;
    }

    span {
      font-size: 1.35rem;
    }
  }

  .cart-page__summary {
    position: sticky;
    bottom: 1rem;
    z-index: 5;
    gap: 1rem;
    padding: 1.4rem;
  }

  .cart-page__summary h2,
  .cart-page__summary-row {
    display: none;
  }

  .cart-page__submit {
    min-height: 5.8rem;
    border-radius: 1.4rem;

    span {
      font-size: 1.6rem;
    }

    small {
      font-size: 1.3rem;
    }
  }
}
</style>
