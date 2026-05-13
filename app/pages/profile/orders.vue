<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({
  middleware: auth
})

import DesktopOrdersView from '~/components/shop/desktopOrders/ui/DesktopOrdersView.vue'

const showBarcode = ref(false)

const desktopOrder = {
  sectionTitle: 'Собираем',
  deliveryLabel: 'Доставка в пункт выдачи',
  etaLabel: 'Ожидаем 24 апреля, четверг',
  orderNumber: '№ заказа 0127-43224',
  title: 'BOSCH S5 Аккумулятор 60Ач',
  article: 'Артикул 0092S50060 · 1 шт.',
  pickupPoint: 'ПВЗ: ул. Аловаха, 2',
  totalPrice: '12 499₽',
  image: '/productExample.png',
}
</script>

<template>
  <section class="orders-page">
    <DesktopOrdersView :order="desktopOrder" @show-barcode="showBarcode = true" />

    <Transition name="barcode-fade">
      <div v-if="showBarcode" class="orders-page__modal-backdrop" @click.self="showBarcode = false">
        <div class="orders-page__modal">
          <p>Покажите сотруднику штрих-код</p>
          <div class="orders-page__modal-barcode" />
          <strong>3243557545643</strong>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.orders-page {
  display: block;
}

.orders-page__modal-barcode {
  display: inline-block;
  background:
    linear-gradient(90deg,
      #fff 0 4%,
      transparent 4% 8%,
      #fff 8% 14%,
      transparent 14% 18%,
      #fff 18% 22%,
      transparent 22% 24%,
      #fff 24% 31%,
      transparent 31% 34%,
      #fff 34% 37%,
      transparent 37% 42%,
      #fff 42% 47%,
      transparent 47% 49%,
      #fff 49% 53%,
      transparent 53% 58%,
      #fff 58% 64%,
      transparent 64% 67%,
      #fff 67% 72%,
      transparent 72% 76%,
      #fff 76% 83%,
      transparent 83% 86%,
      #fff 86% 90%,
      transparent 90% 94%,
      #fff 94% 100%);
}

.orders-page__modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(20, 20, 20, 0.42);
}

.orders-page__modal {
  width: min(34rem, 100%);
  padding: 2.4rem 1.8rem 1.8rem;
  background: #fff;
  border-radius: 1.8rem;
  text-align: center;

  p {
    margin-bottom: 1.8rem;
    color: #1f1f1f;
    font-size: 1.6rem;
  }

  strong {
    display: block;
    margin-top: 1.8rem;
    color: #7f7f7f;
    font-size: 1.7rem;
    font-weight: 500;
  }
}

.orders-page__modal-barcode {
  width: 100%;
  height: 10rem;
  background-color: #2e2e2e;
}

.barcode-fade-enter-active,
.barcode-fade-leave-active {
  transition: opacity 0.2s ease;
}

.barcode-fade-enter-from,
.barcode-fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .orders-page__modal {
    width: min(30rem, 100%);
    padding: 1.8rem 1.4rem;
  }

  .orders-page__modal-barcode {
    height: 8rem;
  }
}
</style>
