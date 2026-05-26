<script setup lang="ts">
const operations = [
  { type: 'Пополнение баланса', amount: '+3000₽', positive: true, accent: '', meta: '' },
  { type: 'Оплата', amount: '-1500₽', positive: false, accent: '143543', meta: 'id заказа', date: '12.01.2026' },
  { type: 'Оплата', amount: '-1500₽', positive: false, accent: '', meta: '', date: '' },
  { type: 'Пополнение', amount: '+3000₽', positive: true, accent: '', meta: '' },
]
</script>

<template>
  <section class="balance-page">
    <article class="balance-page__hero">
      <div class="balance-page__hero-top">
        <div>
          <strong>144 000₽</strong>
          <span>Баланс аккаунта</span>
        </div>

        <div class="balance-page__discount">
          <strong>15%</strong>
          <span>Скидка</span>
        </div>
      </div>

      <div class="balance-page__hero-bottom">
        <h2>ЧиназесАвто</h2>
        <button type="button">Пополнить</button>
      </div>
    </article>

    <section class="balance-page__history">
      <h2>История операций</h2>
      <span class="balance-page__today">Сегодня</span>

      <article v-for="(operation, index) in operations" :key="`${operation.type}-${index}`" class="balance-page__operation">
        <div>
          <h3 :class="{ 'balance-page__operation-title--positive': operation.positive, 'balance-page__operation-title--negative': !operation.positive }">
            {{ operation.type }}
          </h3>
          <strong v-if="operation.accent" :class="{ 'balance-page__operation-id--positive': operation.positive, 'balance-page__operation-id--negative': !operation.positive }">{{ operation.accent }}</strong>
          <span v-if="operation.meta">{{ operation.meta }}</span>
        </div>

        <div class="balance-page__operation-side">
          <strong :class="{ 'balance-page__amount--positive': operation.positive, 'balance-page__amount--negative': !operation.positive }">
            {{ operation.amount }}
          </strong>
          <span v-if="operation.date">{{ operation.date }}</span>
        </div>
      </article>

      <button type="button" class="balance-page__more">Показать больше</button>
    </section>
  </section>
</template>

<style scoped lang="scss">
.balance-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.balance-page__hero {
  padding: 2.4rem;
  border-radius: 2.8rem;
  background: $linear-green;
  color: #fff;
}

.balance-page__hero-top,
.balance-page__hero-bottom {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.6rem;
}

.balance-page__hero-top {
  margin-bottom: 5rem;

  strong {
    display: block;
    font-size: 5rem;
    font-weight: 800;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 0.8rem;
    font-size: 2rem;
  }
}

.balance-page__discount {
  text-align: right;

  strong {
    font-size: 3.2rem;
  }
}

.balance-page__hero-bottom h2 {
  align-self: flex-end;
  font-size: 4rem;
  font-weight: 800;
}

.balance-page__hero-bottom button {
  min-width: 23rem;
  min-height: 6.8rem;
  border: 0;
  border-radius: 2rem;
  background: #fff;
  color: $green;
  font-size: 2.2rem;
  font-weight: 600;
}

.balance-page__history {
    background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  padding: 1.6rem;
  border-radius: $radius-lg;
  h2 {
    align-self: center;
    color: #313131;
    font-size: 4rem;
    font-weight: 800;
  }
}

.balance-page__today {
  color: #3f3f3f;
  font-size: 2rem;
  font-weight: 600;
}

.balance-page__operation-id--negative {
    color: $green;
    font-weight: 400;
}

.balance-page__operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 3px 6px rgba(28, 30, 32, 0.05);

  h3,
  strong,
  span {
    display: block;
  }

  h3 {
    margin-bottom: 0.6rem;
    font-size: 2rem;
    font-weight: 500;
  }



  > div > span {
    color: #9f9f9f;
    font-size: 1.5rem;
  }
}

.balance-page__operation-title--positive,
.balance-page__amount--positive {
  color: $green;
}

.balance-page__operation-title--negative,
.balance-page__amount--negative {
  color: #e14d5a;
}

.balance-page__operation-side {
  text-align: right;

  strong {
    font-size: 2.8rem;
  }

  span {
    margin-top: 2rem;
    color: #9f9f9f;
    font-size: 1.5rem;
  }
}

.balance-page__more {
  align-self: center;
  border: 0;
  background: transparent;
  color: $green;
  font-size: 1.8rem;
}

@media (max-width: 767px) {
  .balance-page {
    gap: 0.8rem;
  }

  .balance-page__hero {
    padding: 1.6rem;
    border-radius: 1.8rem;
  }

  .balance-page__hero-top {
    margin-bottom: 2.8rem;

    strong {
      font-size: 2.8rem;
    }

    span {
      font-size: 1.4rem;
    }
  }

  .balance-page__discount strong {
    font-size: 2rem;
  }

  .balance-page__hero-bottom h2 {
    font-size: 1.8rem;
  }

  .balance-page__hero-bottom button {
    min-width: 13.6rem;
    min-height: 4.8rem;
    border-radius: 1.4rem;
    font-size: 1.5rem;
  }

  .balance-page__history {
    gap: 1.2rem;

    h2 {
      font-size: 1.8rem;
    }
  }

  .balance-page__today {
    font-size: 1.5rem;
  }

  .balance-page__operation {
    padding: 1.3rem 1.4rem;
    border-radius: 1.6rem;

    h3 {
      font-size: 1.5rem;
    }

    > div > strong,
    .balance-page__operation-side strong {
      font-size: 1.8rem;
    }

    > div > span,
    .balance-page__operation-side span {
      font-size: 1.2rem;
    }
  }

  .balance-page__operation-side span {
    margin-top: 1.6rem;
  }

  .balance-page__more {
    font-size: 1.4rem;
  }
}

@media (min-width: 991px) {
    .balance-page{
        display: none;
    }
}
</style>
