<script setup lang="ts">
type MobileOrdersTab = 'current' | 'completed'

interface MobileOrderProduct {
  image: string
  price: string
  badge?: string
}

interface MobileOrder {
  id: string
  title: string
  helperText: string
  emphasisText?: string
  products: MobileOrderProduct[]
}

const activeTab = ref<MobileOrdersTab>('current')

const currentOrders: MobileOrder[] = [
  {
    id: 'current-1',
    title: 'Передаём в доставку',
    helperText: 'Доставка в пункт выдачи',
    emphasisText: 'Ожидаем 24 апреля, пятница',
    products: [
      { image: '/productExample.png', price: '12 499₽', badge: 'Оплачен' },
      { image: '/productExample.png', price: '10 586₽', badge: 'Оплачен' },
    ],
  },
]

const completedOrders: MobileOrder[] = [
  {
    id: 'completed-1',
    title: 'Отменён 22 апреля',
    helperText: 'Вы отменили заказ',
    products: [
      { image: '/productExample.png', price: '149₽' },
    ],
  },
]

const visibleOrders = computed(() =>
  activeTab.value === 'current' ? currentOrders : completedOrders,
)
</script>

<template>
  <section class="mobile-orders">
    <div class="mobile-orders__top">
      <h2>Заказы</h2>
      <button type="button" class="mobile-orders__notify" aria-label="Уведомления">
        <NuxtImg src="/icons/profile/notificationIcon.svg" alt="" />
        <span />
      </button>
    </div>

    <div class="mobile-orders__tabs" role="tablist" aria-label="Фильтр заказов">
      <button
        type="button"
        class="mobile-orders__tab"
        :class="{ 'mobile-orders__tab--active': activeTab === 'current' }"
        @click="activeTab = 'current'"
      >
        Актуальные
      </button>
      <button
        type="button"
        class="mobile-orders__tab"
        :class="{ 'mobile-orders__tab--active': activeTab === 'completed' }"
        @click="activeTab = 'completed'"
      >
        Завершённые
      </button>
    </div>

    <article
      v-for="order in visibleOrders"
      :key="order.id"
      class="mobile-orders__card"
    >
      <div class="mobile-orders__copy">
        <h3>{{ order.title }}<span>›</span></h3>
        <p>{{ order.helperText }}</p>
        <strong v-if="order.emphasisText">{{ order.emphasisText }}</strong>
      </div>

      <div class="mobile-orders__products">
        <div
          v-for="(product, index) in order.products"
          :key="`${order.id}-${index}`"
          class="mobile-orders__product"
        >
          <div class="mobile-orders__image-wrap">
            <NuxtImg :src="product.image" alt="Товар из заказа" />
            <span v-if="product.badge" class="mobile-orders__badge">{{ product.badge }}</span>
          </div>
          <strong>{{ product.price }}</strong>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.mobile-orders {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 1.6rem;
  background: #181a1f;
  border-radius: 2.8rem;
  color: #fff;
}

.mobile-orders__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;

  h2 {
    margin: 0;
    color: #f7f7f8;
    font-size: 2.2rem;
    font-weight: 800;
  }
}

.mobile-orders__notify {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4.2rem;
  height: 4.2rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);

  img {
    width: 2rem;
    height: 2rem;
    filter: brightness(0) saturate(100%) invert(100%);
    opacity: 0.78;
  }

  span {
    position: absolute;
    top: 0.9rem;
    right: 0.9rem;
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background: #17c84a;
    box-shadow: 0 0 0 0.3rem #181a1f;
  }
}

.mobile-orders__tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  padding: 0.6rem;
  background: #2d3037;
  border-radius: 2rem;
}

.mobile-orders__tab {
  min-height: 5.2rem;
  padding: 0 1.6rem;
  border: 0;
  border-radius: 1.6rem;
  background: transparent;
  color: #dbdde3;
  font-size: 1.8rem;
  font-weight: 600;
}

.mobile-orders__tab--active {
  background: #3a3d46;
  color: #fff;
}

.mobile-orders__card {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 2rem 1.8rem 2.2rem;
  background: #202329;
  border-radius: 2.8rem;
}

.mobile-orders__copy {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  h3 {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    margin: 0;
    color: #fff;
    font-size: 2rem;
    font-weight: 800;

    span {
      color: #fff;
      opacity: 0.8;
    }
  }

  p {
    margin: 0;
    color: #9ea3ae;
    font-size: 1.6rem;
  }

  strong {
    color: #fff;
    font-size: 1.8rem;
    font-weight: 700;
  }
}

.mobile-orders__products {
  display: flex;
  align-items: flex-start;
  gap: 1.4rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;
}

.mobile-orders__product {
  flex: 0 0 11.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  strong {
    color: #fff;
    font-size: 1.8rem;
    font-weight: 800;
  }
}

.mobile-orders__image-wrap {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 17rem;
  padding: 1rem;
  border-radius: 2rem;
  background: #2a2d34;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.mobile-orders__badge {
  position: absolute;
  left: 0.8rem;
  bottom: 0.8rem;
  display: inline-flex;
  align-items: center;
  min-height: 2.8rem;
  padding: 0 1rem;
  border-radius: 999px;
  background: #e6fff0;
  color: $green;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
