<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({ middleware: auth })

import { useCartStore } from '~~/stores/cart'
import { useAuthStore } from '~~/stores/auth'
import Button from '~/shared/ui-kit/Button/Button.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()

const selectedIds = ref<Set<string>>(new Set())
const orderLoading = ref(false)
const orderError = ref('')

onMounted(() => {
  if (!cartStore.items.length) cartStore.fetchCart()
})

const selectAll = computed({
  get: () => cartStore.items.length > 0 && cartStore.items.every(i => selectedIds.value.has(i.id)),
  set: (v: boolean) => {
    if (v) selectedIds.value = new Set(cartStore.items.map(i => i.id))
    else selectedIds.value = new Set()
  },
})

const selectedItems = computed(() => cartStore.items.filter(i => selectedIds.value.has(i.id)))
const selectedCount = computed(() => selectedItems.value.reduce((s, i) => s + i.quantity, 0))
const totalPrice = computed(() => selectedItems.value.reduce((s, i) => s + i.price * i.quantity, 0))

function toggleItem(id: string) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function formatPrice(value: number) {
  return `${value.toLocaleString('ru-RU')}₽`
}

async function createOrder() {
  const selected = selectedItems.value
  if (!selected.length) return
  orderLoading.value = true
  orderError.value = ''
  try {
    const pvzId = authStore.user?.selected_pvz?.id || 1
    await useAPI()('/api/orders/create', {
      method: 'POST',
      body: { pickup_point_id: pvzId, comment: '' },
    })
    cartStore.items = cartStore.items.filter(i => !selectedIds.value.has(i.id))
    selectedIds.value = new Set()
    navigateTo('/profile/orders')
  } catch (e: any) {
    orderError.value = e?.data?.message || e?.message || 'Ошибка оформления заказа'
  } finally {
    orderLoading.value = false
  }
}
</script>

<template>
  <main class="cart-page shop-page">
    <template v-if="cartStore.isLoading">
      <div class="cart-page__layout">
        <section class="cart-page__items card-surface cart-page__skeleton">
          <div class="skeleton skeleton--select-all" />
          <div class="skeleton-row" v-for="n in 3" :key="n">
            <div class="skeleton skeleton--check" />
            <div class="skeleton-column">
              <div class="skeleton skeleton--price" />
              <div class="skeleton skeleton--title" />
              <div class="skeleton skeleton--subtitle" />
              <div class="skeleton-row skeleton-row--actions">
                <div class="skeleton skeleton--trash" />
                <div class="skeleton skeleton--qty" />
              </div>
            </div>
          </div>
        </section>
        <aside class="cart-page__summary card-surface cart-page__skeleton">
          <div class="skeleton skeleton--summary-title" />
          <div class="skeleton skeleton--summary-row" />
          <div class="skeleton skeleton--summary-row" />
          <div class="skeleton skeleton--summary-btn" />
        </aside>
      </div>
    </template>
    <div v-else-if="!cartStore.items.length" class="cart-page__empty">
      <p>Корзина пуста</p>
      <NuxtLink to="/">Перейти в каталог</NuxtLink>
    </div>
    <template v-else>
      <div class="cart-page__layout">
        <section class="cart-page__items card-surface">
          <label class="cart-page__select-all">
            <input v-model="selectAll" type="checkbox">
            <span class="cart-page__checkbox" />
            <em>Выбрать всё</em>
          </label>

          <article v-for="item in cartStore.items" :key="item.id" class="cart-page__item">
            <label class="cart-page__item-check">
              <input :checked="selectedIds.has(item.id)" type="checkbox" @change="toggleItem(item.id)">
              <span class="cart-page__checkbox" />
            </label>

            <div class="cart-page__content">
              <div class="cart-page__price-row">
                <strong>{{ formatPrice(item.price) }}</strong>
              </div>

              <h2>{{ item.name || `${item.brand} ${item.article_nr}` }}</h2>
              <p>{{ item.article_nr }}</p>
              <small>{{ item.brand }}</small>

              <div class="cart-page__actions">
                <button type="button" class="cart-page__trash" @click="cartStore.removeItem(item.id)">
                  <NuxtImg src="/icons/delete.svg" alt="Удалить" />
                </button>

                <div class="cart-page__qty">
                  <button type="button" @click="cartStore.updateQty(item.id, item.quantity - 1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button type="button" @click="cartStore.updateQty(item.id, item.quantity + 1)">+</button>
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
          <p v-if="orderError" class="cart-page__order-error">{{ orderError }}</p>
          <Button :subtext="`${formatPrice(totalPrice)} · ${selectedCount} ед`" :disabled="orderLoading || !selectedCount" @click="createOrder">{{ orderLoading ? 'Оформление...' : 'Оформить заказ' }}</Button>
        </aside>
      </div>
    </template>
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

.cart-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  min-height: 40rem;
  padding: 4rem;

  p {
    color: #656565;
    font-size: 2.4rem;
    font-weight: 500;
  }

  a {
    color: $green;
    font-size: 1.6rem;
  }
}

.cart-page__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40rem;
  color: #999;
  font-size: 1.6rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.skeleton {
  background: #e8e8e8;
  border-radius: 1rem;
  animation: pulse 1.6s ease-in-out infinite;
}

.cart-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.skeleton--select-all {
  width: 14rem;
  height: 2.2rem;
  border-radius: 0.6rem;
  margin-bottom: 0.6rem;
}

.skeleton-row {
  display: flex;
  gap: 1.6rem;
  align-items: start;
  padding: 2rem 0;
  border-top: 1px solid #f0f0f0;
}

.skeleton-row--actions {
  border: 0;
  padding: 0;
  align-items: center;
  margin-top: 0.4rem;
}

.skeleton--check {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.6rem;
  flex-shrink: 0;
}

.skeleton-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.skeleton--price {
  width: 10rem;
  height: 2rem;
}

.skeleton--title {
  width: 70%;
  height: 1.8rem;
}

.skeleton--subtitle {
  width: 40%;
  height: 1.4rem;
}

.skeleton--trash {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
}

.skeleton--qty {
  width: 12rem;
  height: 4.4rem;
  border-radius: 1.3rem;
}

.skeleton--summary-title {
  width: 12rem;
  height: 2.8rem;
}

.skeleton--summary-row {
  width: 100%;
  height: 2rem;
}

.skeleton--summary-btn {
  width: 100%;
  height: 5.6rem;
  border-radius: 1.6rem;
  margin-top: 0.4rem;
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

  input { display: none; }
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
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1.6rem;
  padding: 2rem 0;
  border-top: 1px solid #f0f0f0;
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

  p, small {
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
  cursor: pointer;

  img { width: 1.8rem; opacity: 0.65; }
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
    cursor: pointer;
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

  span { color: #7f7f7f; font-size: 1.55rem; }
  strong { color: #2d2d2d; font-size: 1.85rem; }
}

.cart-page__order-error {
  color: #c62828;
  font-size: 1.3rem;
  margin: 0;
  text-align: center;
}

@media (max-width: 991px) {
  .cart-page__layout { grid-template-columns: 1fr; }
  .cart-page__summary { position: static; }
}

@media (max-width: 767px) {
  .shop-page { width: calc(100% - 3rem); }
  .card-surface { border-radius: 1.8rem; }
  .cart-page { gap: 1.4rem; }
  .cart-page__items { padding: 1.6rem 1.4rem; }
  .cart-page__select-all { margin-bottom: 1.2rem; em { font-size: 1.45rem; } }
  .cart-page__checkbox { width: 1.9rem; height: 1.9rem; }
  .cart-page__item { gap: 1rem; padding: 1.6rem 0; }
  .cart-page__content { gap: 0.4rem; h2 { font-size: 1.4rem; } p, small { font-size: 1.2rem; } }
  .cart-page__price-row strong { font-size: 1.3rem; }
  .cart-page__actions { gap: 0.6rem; margin-top: 0.8rem; }
  .cart-page__trash { width: 3.2rem; height: 3.2rem; img { width: 1.4rem; } }
  .cart-page__qty { min-height: 3.6rem; gap: 1.1rem; padding: 0 1rem; border-radius: 1rem; button { font-size: 1.7rem; } span { font-size: 1.35rem; } }
  .cart-page__summary { position: sticky; bottom: 1rem; gap: 1rem; padding: 1.4rem; h2 { display: none; } .cart-page__summary-row { display: none; } }
}
</style>
