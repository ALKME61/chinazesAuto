<script setup lang="ts">
type OrdersTab = 'current' | 'completed'

interface DesktopOrder {
  sectionTitle: string
  deliveryLabel: string
  etaLabel: string
  orderNumber: string
  title: string
  article: string
  pickupPoint: string
  totalPrice: string
  image: string
}

interface OrderProduct {
  image: string
  price: string
  badge?: string
}

interface CompletedOrder {
  title: string
  helperText: string
  price: string
  image: string
}

const props = defineProps<{
  order: DesktopOrder
}>()

const emit = defineEmits<{
  showBarcode: []
}>()

const activeTab = ref<OrdersTab>('current')

const currentProducts = computed<OrderProduct[]>(() => [
  { image: props.order.image, price: props.order.totalPrice, badge: 'В обработке' },
  { image: props.order.image, price: '12 890₽', badge: 'Оплачен' },
])

const completedOrder = computed<CompletedOrder>(() => ({
  title: 'Отменён 22 апреля',
  helperText: 'Вы отменили заказ',
  price: '149₽',
  image: props.order.image,
}))

const openBarcode = () => {
  emit('showBarcode')
}
</script>

<template>
  <section class="orders-view">
    <header class="orders-view__hero">
      <div class="orders-view__headline">
        <h2>Заказы</h2>
      </div>

      <div class="orders-view__controls">
        <div class="orders-view__tabs" role="tablist" aria-label="Фильтр заказов">
          <button
            type="button"
            class="orders-view__tab"
            :class="{ 'orders-view__tab--active': activeTab === 'current' }"
            @click="activeTab = 'current'"
          >
            Актуальные
          </button>
          <button
            type="button"
            class="orders-view__tab"
            :class="{ 'orders-view__tab--active': activeTab === 'completed' }"
            @click="activeTab = 'completed'"
          >
            Завершённые
          </button>
        </div>

        <button type="button" class="orders-view__barcode-button" @click="openBarcode">
          Показать штрихкод
        </button>
      </div>
    </header>

    <article v-if="activeTab === 'current'" class="orders-view__card orders-view__card--current">
      <div class="orders-view__summary">
        <div>
          <button type="button" class="orders-view__status-link">
            {{ order.sectionTitle }}
            <span>›</span>
          </button>

          <p class="orders-view__delivery">{{ order.deliveryLabel }}</p>
          <strong class="orders-view__eta">{{ order.etaLabel }}</strong>
        </div>

        <div class="orders-view__meta">
          <span class="orders-view__order-number">{{ order.orderNumber }}</span>
          <span class="orders-view__pickup">{{ order.pickupPoint }}</span>
        </div>
      </div>

      <div class="orders-view__content">
        <div class="orders-view__gallery">
          <article
            v-for="(product, index) in currentProducts"
            :key="`current-${index}`"
            class="orders-view__product-card"
          >
            <div class="orders-view__image-wrap">
              <NuxtImg :src="product.image" :alt="order.title" />
            </div>
            <span v-if="product.badge" class="orders-view__product-badge">{{ product.badge }}</span>
            <strong class="orders-view__product-price">{{ product.price }}</strong>
          </article>
        </div>
      </div>
    </article>

    <article v-else class="orders-view__card orders-view__card--completed">
      <div class="orders-view__completed-copy">
        <h3>
          {{ completedOrder.title }}
          <span>›</span>
        </h3>
        <p>{{ completedOrder.helperText }}</p>
      </div>

      <div class="orders-view__completed-product">
        <div class="orders-view__image-wrap orders-view__image-wrap--completed">
          <NuxtImg :src="completedOrder.image" alt="Товар из завершённого заказа" />
        </div>
        <strong class="orders-view__product-price">{{ completedOrder.price }}</strong>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.orders-view {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.orders-view__hero,
.orders-view__card {
  background: #fff;
  border-radius: 3.2rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.orders-view__hero {
  padding: 3.2rem 3.4rem 2.8rem;
}

.orders-view__headline {
  h2 {
    margin: 0;
    color: #2a2d33;
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 1.1;
  }
}

.orders-view__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2.8rem;
}

.orders-view__tabs {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  border-radius: 2rem;
  background: #eef6f1;
}

.orders-view__tab {
  min-height: 4.8rem;
  padding: 0 2.2rem;
  border: 0;
  border-radius: 1.6rem;
  background: transparent;
  color: #2f3f50;
  font-size: 1.8rem;
  font-weight: 600;
}

.orders-view__tab--active {
  background: $green;
  color: #fff;
}

.orders-view__barcode-button {
  flex-shrink: 0;
  min-height: 5rem;
  padding: 0 2rem;
  border: 0;
  border-radius: 1.6rem;
  background: $green;
  color: #fff;
  font-size: 1.7rem;
  font-weight: 600;
}

.orders-view__card--current {
  display: grid;
  grid-template-columns: minmax(2rem, 32rem) minmax(0, 1fr);
  padding: 2.8rem 3.2rem;
}

.orders-view__summary {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding-right: 3rem;
  border-right: 1px solid #edf0f3;
}

.orders-view__status-link {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: #12161b;
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1.05;

  span {
    color: $green;
  }
}

.orders-view__delivery {
  margin: 1.2rem 0 0;
  color: #7d8b99;
  font-size: 1.6rem;
}

.orders-view__eta {
  display: block;
  margin-top: 0.8rem;
  color: #12161b;
  font-size: 1.8rem;
  font-weight: 700;
}

.orders-view__meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.orders-view__order-number,
.orders-view__pickup {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 3.8rem;
  padding: 0 1.6rem;
  border-radius: 999px;
  background: #eef6f1;
  color: $green;
  font-size: 1.6rem;
  font-weight: 600;
}

.orders-view__pickup {
  background: #f4f6f8;
  color: #5f6a77;
}

.orders-view__content {
  padding-left: 3rem;
}

.orders-view__gallery {
  display: flex;
  align-items: stretch;
  gap: 1.8rem;
}

.orders-view__product-card,
.orders-view__completed-product {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.orders-view__image-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18rem;
  height: 18rem;
  padding: 1.6rem;
  border-radius: 2.4rem;
  background: #f7f8f9;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.orders-view__image-wrap--completed {
  width: 16rem;
  height: 16rem;
}

.orders-view__product-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 3.4rem;
  padding: 0 1.4rem;
  border-radius: 999px;
  background: #e6fff0;
  color: $green;
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
}

.orders-view__product-price {
  color: #20242b;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.orders-view__card--completed {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.8rem 3.2rem;
}

.orders-view__completed-copy {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    margin: 0;
    color: #22262b;
    font-size: 2.4rem;
    font-weight: 800;

    span {
      color: $green;
    }
  }

  p {
    margin: 0;
    color: #7d8b99;
    font-size: 1.7rem;
  }
}

@media (max-width: 767px) {
  .orders-view {
    gap: 0.8rem;
  }

  .orders-view__hero,
  .orders-view__card {
    border-radius: 2.4rem;
    box-shadow: none;
  }

  .orders-view__hero {
    padding: 2rem 1.6rem 1.6rem;
  }

  .orders-view__headline h2 {
    font-size: 2.2rem;
  }

  .orders-view__controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1.2rem;
    margin-top: 1.8rem;
  }

  .orders-view__tabs {
    width: 100%;
    justify-content: stretch;
    padding: 0.6rem;
    border-radius: 1.8rem;
    background: #eef3f0;
  }

  .orders-view__tab {
    flex: 1 1 0;
    min-height: 4.8rem;
    padding: 0 1.4rem;
    font-size: 1.7rem;
  }

  .orders-view__barcode-button {
    width: 100%;
    min-height: 4.8rem;
    border-radius: 1.6rem;
    font-size: 1.6rem;
  }

  .orders-view__card--current,
  .orders-view__card--completed {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    padding: 2rem 1.6rem;
  }

  .orders-view__summary {
    gap: 1.6rem;
    padding-right: 0;
    border-right: 0;
  }

  .orders-view__status-link,
  .orders-view__completed-copy h3 {
    font-size: 2rem;
  }

  .orders-view__delivery,
  .orders-view__completed-copy p {
    font-size: 1.6rem;
  }

  .orders-view__eta {
    font-size: 1.8rem;
  }

  .orders-view__meta {
    gap: 0.8rem;
  }

  .orders-view__content {
    padding-left: 0;
  }

  .orders-view__gallery {
    overflow-x: auto;
    gap: 1.2rem;
    padding-bottom: 0.2rem;
  }

  .orders-view__product-card {
    flex: 0 0 12.6rem;
  }

  .orders-view__image-wrap,
  .orders-view__image-wrap--completed {
    width: 12.6rem;
    height: 12.6rem;
    padding: 1.2rem;
    border-radius: 2rem;
  }

  .orders-view__product-badge {
    min-height: 3rem;
    padding: 0 1.2rem;
    font-size: 1.1rem;
  }

  .orders-view__product-price {
    font-size: 1.8rem;
  }
}
</style>
