<script setup lang="ts">
const showBarcode = ref(false)

const orderItems = [
  { image: '/productExample.png' },
  { image: '/productExample.png' },
  { image: '/productExample.png' },
]
</script>

<template>
  <section class="orders-page">
    <button type="button" class="orders-page__barcode-button" @click="showBarcode = true">
      <span class="orders-page__barcode-bars" />
      <span>Показать штрихкод</span>
    </button>

    <article class="orders-page__order-card">
      <span class="orders-page__date">Заказ от 4 мая</span>
      <strong class="orders-page__id">43224</strong>
      <p class="orders-page__delivery-title">Доставка в пункт выдачи</p>
      <span class="orders-page__status">В обработке</span>

      <div class="orders-page__items">
        <div class="orders-page__previews">
          <div v-for="(item, index) in orderItems" :key="index" class="orders-page__item-preview">
            <NuxtImg :src="item.image" alt="Товар из заказа" />
          </div>
        </div>
        <span class="orders-page__eta">Послезавтра</span>
      </div>
    </article>

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
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.orders-page__barcode-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  min-height: 10rem;
  border: 0;
  border-radius: 2.4rem;
  background: $linear-green;
  color: #fff;
  font-size: 2.2rem;
  font-weight: 600;
}

.orders-page__barcode-bars,
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

.orders-page__barcode-bars {
  width: 10.8rem;
  height: 4.8rem;
}

.orders-page__order-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.8rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.orders-page__date,
.orders-page__delivery-title {
  display: block;
  color: #2f2f2f;
  font-size: 2rem;
}

.orders-page__id {
  display: block;
  color: $green;
  font-size: 5.2rem;
  font-weight: 500;
  line-height: 1;
}

.orders-page__status,
.orders-page__eta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 4rem;
  padding: 0 1.6rem;
  border-radius: 999px;
  background: #d8f8e0;
  color: $green;
  font-size: 1.7rem;
}

.orders-page__items {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin-top: 0.8rem;
}

.orders-page__previews {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.orders-page__item-preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 8rem;
  height: 8rem;
  padding: 0.8rem;
  border-radius: 1.6rem;
  background: #fafafa;

  img {
    width: 100%;
  }
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
  .orders-page {
    gap: 0.8rem;
  }

  .orders-page__barcode-button {
    justify-content: flex-start;
    gap: 1.6rem;
    min-height: 7.2rem;
    padding: 0 2rem;
    border-radius: 1.6rem;
    font-size: 1.6rem;
  }

  .orders-page__barcode-bars {
    width: 7.2rem;
    height: 3.2rem;
  }

  .orders-page__order-card {
    gap: 0.8rem;
    padding: 1.6rem;
    border-radius: 1.6rem;
  }

  .orders-page__date,
  .orders-page__delivery-title {
    font-size: 1.4rem;
  }

  .orders-page__id {
    font-size: 2.4rem;
  }

  .orders-page__status,
  .orders-page__eta {
    min-height: 3rem;
    padding: 0 1.2rem;
    font-size: 1.25rem;
  }

  .orders-page__items {
    gap: 1rem;
    flex-wrap: wrap;
  }

  .orders-page__previews {
    gap: 0;
  }

  .orders-page__item-preview {
    width: 5.2rem;
    height: 5.2rem;
    border-radius: 1.2rem;

    & + .orders-page__item-preview {
      margin-left: -1rem;
    }
  }

  .orders-page__modal {
    width: min(30rem, 100%);
    padding: 1.8rem 1.4rem;
  }

  .orders-page__modal-barcode {
    height: 8rem;
  }
}
</style>
