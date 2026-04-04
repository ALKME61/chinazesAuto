<script setup lang="ts">
const accountBalance = '0\u20BD'

const operations = [
  {
    id: '12513642',
    type: 'Покупка',
    amount: '-3000\u20BD',
    amountClass: 'balance-table__amount--negative',
    date: '11.01.2026',
    status: 'Доставлен',
  },
  {
    id: '12513642',
    type: 'Пополнение',
    amount: '+3000\u20BD',
    amountClass: 'balance-table__amount--positive',
    date: '11.01.2026',
    status: 'Доставлен',
  },
]
</script>

<template>
  <section class="balance-page">
    <article class="balance-card">
      <div class="balance-card__top">
        <div class="balance-card__icon">
          <NuxtImg src="/icons/plus.svg" alt="Иконка баланса" />
        </div>

        <div class="balance-card__meta">
          <strong>{{ accountBalance }}</strong>
          <span>Баланс аккаунта</span>
        </div>
      </div>

      <button class="balance-card__button" type="button">Пополнить баланс</button>
    </article>

    <section class="balance-operations">
      <h2>Операции по счёту</h2>

      <div class="balance-table">
        <div class="balance-table__head">
          <span>ID операции</span>
          <span>Тип операции</span>
          <span>Сумма</span>
          <span>Дата</span>
          <span>Статус</span>
        </div>

        <div class="balance-table__body">
          <div
            v-for="(operation, index) in operations"
            :key="`${operation.id}-${index}`"
            class="balance-table__row"
          >
            <span>{{ operation.id }}</span>
            <span>{{ operation.type }}</span>
            <span class="balance-table__amount" :class="operation.amountClass">
              {{ operation.amount }}
            </span>
            <span>{{ operation.date }}</span>
            <span>{{ operation.status }}</span>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.balance-page {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

.balance-card,
.balance-table {
  background: #fff;
  border-radius: $radius-md;
  box-shadow: 0 12px 34px rgba(28, 30, 32, 0.04);
}

.balance-card {
  width: 100%;
  max-width: 36.8rem;
  padding: 2rem 1.8rem 1.8rem;
}

.balance-card__top {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2.2rem;
}

.balance-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.6rem;
  height: 4.6rem;
  flex-shrink: 0;
  border: 0.3rem solid $green;
  border-radius: 50%;

  img {
    width: 1.8rem;
    height: 1.8rem;
  }
}

.balance-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  strong {
    font-size: 2rem;
    font-weight: 500;
    color: #333;
    line-height: 1;
  }

  span {
    font-size: 1.4rem;
    color: #7c7c7c;
    line-height: 1.3;
  }
}

.balance-card__button {
  width: 100%;
  min-height: 4.4rem;
  border: 0;
  border-radius: 0.8rem;
  background: $green;
  font-size: 1.6rem;
  font-weight: 400;
  color: #fff;
  cursor: pointer;
}

.balance-operations {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #373737;
    line-height: 1.2;
  }
}

.balance-table {
  width: 100%;
  padding: 0 2.6rem;
  overflow: hidden;
}

.balance-table__head,
.balance-table__row {
  display: grid;
  grid-template-columns: 1.2fr 1.4fr 1fr 1fr 1fr;
  gap: 1.6rem;
  align-items: center;
}

.balance-table__head {
  padding: 1.2rem 0;
  border-bottom: 1px solid #ececec;

  span {
    font-size: 1.3rem;
    color: #9b9b9b;
  }
}

.balance-table__body {
  display: flex;
  flex-direction: column;
}

.balance-table__row {
  padding: 1.9rem 0;

  span {
    font-size: 1.5rem;
    color: #434343;
    line-height: 1.35;
  }
}

.balance-table__amount {
  font-weight: 400;
}

.balance-table__amount--negative {
  color: #ff3b30 !important;
}

.balance-table__amount--positive {
  color: $green !important;
}
</style>
