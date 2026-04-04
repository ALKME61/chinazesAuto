<script setup lang="ts">
const totalOrders = '0\u20BD'

const summaryRows = [
  { label: 'В пути', value: '0\u20BD' },
  { label: 'Готово к выдаче', value: '0\u20BD' },
]

const orderRows = [
  {
    id: '12513642',
    address: 'г. Ростов-на-Дону, ул. Пушкинская 2',
    date: '12.01.2026',
    total: '12300\u20BD',
    status: 'Доставлен',
  },
  {
    id: '12513642',
    address: 'г. Ростов-на-Дону, ул. Пушкинская 2',
    date: '12.01.2026',
    total: '12300\u20BD',
    status: 'Доставлен',
  },
]
</script>

<template>
  <section class="orders">
    <div class="orders__summary">
      <article class="summary-card">
        <div class="summary-card__main">
          <NuxtImg class="summary-card__icon" src="/icons/money.svg" alt="Иконка суммы заказов" />
          <div class="summary-card__meta">
            <h2>{{ totalOrders }}</h2>
            <p>Сумма заказов</p>
          </div>
        </div>

        <div class="summary-card__divider" />

        <div class="summary-card__stats">
          <div
            v-for="summaryRow in summaryRows"
            :key="summaryRow.label"
            class="summary-card__stat"
          >
            <span>{{ summaryRow.label }}</span>
            <strong>{{ summaryRow.value }}</strong>
          </div>
        </div>
      </article>
    </div>

    <div class="orders__tabs" aria-label="Фильтр заказов">
      <button class="orders__tab orders__tab--active" type="button">Все заказы</button>
      <button class="orders__tab" type="button">Готово к выдаче</button>
    </div>

    <label class="orders__search" aria-label="Поиск по заказам">
      <input type="text" placeholder="Поиск по заказам">
      <NuxtImg src="/icons/search.svg" alt="" />
    </label>

    <div class="orders-table">
      <div class="orders-table__head">
        <span>ID заказа</span>
        <span>Адрес</span>
        <span>Дата заказа</span>
        <span>Сумма</span>
        <span>Статус заказа</span>
      </div>

      <div class="orders-table__body">
        <div
          v-for="(order, index) in orderRows"
          :key="`${order.id}-${index}`"
          class="orders-table__row"
        >
          <span>{{ order.id }}</span>
          <span>{{ order.address }}</span>
          <span>{{ order.date }}</span>
          <span>{{ order.total }}</span>
          <span>{{ order.status }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.orders {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

.orders__summary {
  display: flex;
}

.summary-card {
  width: 100%;
  max-width: 36.8rem;
  padding: 2rem 2.4rem;
  background: #fff;
  border-radius: $radius-md;
}

.summary-card__main {
  display: flex;
  align-items: center;
  gap: 1.8rem;
}

.summary-card__icon {
  width: 5rem;
  flex-shrink: 0;
}

.summary-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  h2 {
    font-size: 2rem;
    font-weight: 500;
    line-height: 1;
    color: #333;
  }

  p {
    font-size: 1.4rem;
    line-height: 1.3;
    color: #7f7f7f;
  }
}

.summary-card__divider {
  width: 100%;
  height: 1px;
  margin: 2rem 0 1.4rem;
  background: #ececec;
}

.summary-card__stats {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.summary-card__stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;

  span {
    font-size: 1.4rem;
    color: #666;
  }

  strong {
    font-size: 1.5rem;
    font-weight: 400;
    color: #333;
  }
}

.orders__tabs {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding-left: 1.4rem;
}

.orders__tab {
  padding: 0;
  background: transparent;
  border: 0;
  font-size: 1.6rem;
  line-height: 1.2;
  color: #434343;
  cursor: pointer;
}

.orders__tab--active {
  color: $orange;
  font-weight: 500;
}

.orders__search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 36.8rem;
  height: 4.4rem;
  background: #fff;
  border-radius: $radius-md;

  input {
    width: 100%;
    height: 100%;
    padding: 0 5.4rem 0 2rem;
    background: transparent;
    border: 0;
    font-size: 1.4rem;
    color: #333;

    &::placeholder {
      color: #acacac;
    }
  }

  img {
    position: absolute;
    right: 1.8rem;
    width: 2rem;
    opacity: 0.35;
  }
}

.orders-table {
  width: 100%;
  background: #fff;
  border-radius: $radius-md;
  padding: 0 2.6rem;
  overflow: hidden;
}

.orders-table__head,
.orders-table__row {
  display: grid;
  grid-template-columns: 1.1fr 2.6fr 1.2fr 1fr 1.15fr;
  gap: 1.6rem;
  align-items: center;
}

.orders-table__head {
  padding: 1.2rem 0;
  border-bottom: 1px solid #ececec;

  span {
    font-size: 1.3rem;
    color: #9b9b9b;
  }

  span:nth-child(2) {
    justify-self: center;
  }
}

.orders-table__body {
  display: flex;
  flex-direction: column;
}

.orders-table__row {
  padding: 2rem 0;

  span {
    font-size: 1.5rem;
    color: #434343;
    line-height: 1.35;
  }
}
</style>
