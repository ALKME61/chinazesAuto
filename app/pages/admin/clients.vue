<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const locationLegend = [
  { label: 'Ростов-на-дону', value: '15%', color: '#18b536' },
  { label: 'Алчевск', value: '25%', color: '#68d27f' },
  { label: 'Луганск', value: '60%', color: '#b9e8c4' },
]

const clients = [
  {
    id: '1',
    fullName: 'Иванов Иван Иванович',
    balance: '3520₽',
    discount: '10%',
    orders: '3шт.',
    phone: '+7 (123) 456-78-90',
    date: '10.11.2025',
  },
  {
    id: '2',
    fullName: 'Иванов Иван Иванович',
    balance: '7890₽',
    discount: '0%',
    orders: '3шт.',
    phone: '+7 (123) 456-78-90',
    date: '10.11.2025',
  },
]
</script>

<template>
  <section class="admin-clients">
    <div class="admin-clients__heading">
      <h1>Клиенты</h1>
    </div>

    <div class="admin-clients__top">
      <div class="admin-clients__summary">
        <AdminMetricCard title="Всего пользователей" value="13452" icon="clients" class="admin-clients__summary-card">
          <div class="admin-clients__trend">
            <span>↑ 16</span>
            <span>Прибавилось с прошлого месяца</span>
          </div>
        </AdminMetricCard>

        <AdminMetricCard title="Новые" value="15" icon="clients" class="admin-clients__summary-card">
          Позвонить
        </AdminMetricCard>
      </div>

      <section class="admin-clients__locations">
        <h2>Локации пользователей</h2>

        <div class="admin-clients__locations-content">
          <ul class="admin-clients__legend">
            <li v-for="item in locationLegend" :key="item.label">
              <span :style="{ backgroundColor: item.color }" />
              <p>
                <strong>{{ item.label }}</strong>
                <em>({{ item.value }})</em>
              </p>
            </li>
          </ul>

          <div class="admin-clients__donut" aria-hidden="true">
            <div class="admin-clients__donut-hole" />
          </div>
        </div>
      </section>
    </div>

    <div class="admin-clients__filters">
      <div class="admin-clients__tabs">
        <button type="button" class="admin-clients__tab admin-clients__tab--active">Все</button>
        <button type="button" class="admin-clients__tab">Ростов-на-дону</button>
        <button type="button" class="admin-clients__tab">Луганск</button>
        <button type="button" class="admin-clients__tab">Алчевск</button>
      </div>

      <div class="admin-clients__search-row">
        <label class="admin-clients__search">
          <input type="text" placeholder="Поиск по параметрам">
        </label>

        <button type="button" class="admin-clients__select">
          <span>ID клиента</span>
          <AdminIcon name="chevron-down" :size="18" />
        </button>
      </div>
    </div>

    <section class="admin-clients__table">
      <div class="admin-clients__table-head">
        <span class="admin-clients__head-select">
          <span>Выбрать всё</span>
          <AdminIcon name="square" :size="20" />
        </span>
        <span>ID Клиента</span>
        <span>ФИО</span>
        <span>Баланс</span>
        <span>Размер скидки</span>
        <span>Активные заказы</span>
        <span>Контактные данные</span>
        <span>Дата регистрации</span>
        <span />
      </div>

      <div class="admin-clients__table-scroll">
        <div
          v-for="client in clients"
          :key="client.id"
          class="admin-clients__table-row"
        >
          <div class="admin-clients__checkbox">
            <AdminIcon name="check-square" :size="20" />
          </div>
          <span>{{ client.id }}</span>
          <span>{{ client.fullName }}</span>
          <span>{{ client.balance }}</span>
          <span>{{ client.discount }}</span>
          <span>{{ client.orders }}</span>
          <span>{{ client.phone }}</span>
          <span>{{ client.date }}</span>
          <button type="button" class="admin-clients__expand" aria-label="Подробнее о клиенте">
            <AdminIcon name="chevron-down" :size="18" />
          </button>
        </div>

        <div class="admin-clients__table-filler" />
      </div>

      <div class="admin-clients__actions">
        <button type="button" class="admin-clients__action admin-clients__action--square" aria-label="Добавить пользователя">
          <AdminIcon name="user-plus" :size="20" />
        </button>

        <button type="button" class="admin-clients__action admin-clients__action--square" aria-label="Удалить пользователя">
          <AdminIcon name="user-minus" :size="20" />
        </button>

        <button type="button" class="admin-clients__action admin-clients__action--wide">
          <AdminIcon name="user-edit" :size="20" />
          <span>Редактировать пользователей</span>
        </button>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.admin-clients__heading {
  margin-bottom: 2.4rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #434343;
  }
}

.admin-clients__top {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(30rem, 0.84fr);
  gap: 1.6rem;
  max-width: 89rem;
}

.admin-clients__summary {
  display: grid;
  gap: 1.6rem;
}

.admin-clients__summary-card {
  min-height: 11.8rem;
}

.admin-clients__trend {
  display: flex;
  align-items: center;
  gap: 0.6rem;

  span:first-child {
    color: $green;
    font-size: 1.45rem;
    font-weight: 600;
  }

  span:last-child {
    color: #a0a0a0;
    font-size: 1.3rem;
  }
}

.admin-clients__locations,
.admin-clients__table {
  background: #fff;
  border-radius: 1.8rem;
}

.admin-clients__locations {
  padding: 1.4rem 1.6rem;

  h2 {
    font-size: 1.4rem;
    color: #555;
    font-weight: 500;
  }
}

.admin-clients__locations-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4rem;
  min-height: 18.8rem;
}

.admin-clients__legend {
  display: flex;
  flex-direction: column;
  gap: 1.7rem;

  li {
    display: grid;
    grid-template-columns: 1.4rem minmax(0, 1fr);
    align-items: center;
    gap: 0.8rem;
  }

  span {
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
  }

  p {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 1.4rem;
    color: #747474;
  }

  strong {
    color: #575757;
    font-weight: 500;
  }

  em {
    color: #9b9b9b;
    font-style: normal;
  }
}

.admin-clients__donut {
  position: relative;
  width: 15.3rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: conic-gradient(
    #b9e8c4 0 60%,
    #18b536 60% 75%,
    #68d27f 75% 100%
  );
  transform: rotate(-90deg);
}

.admin-clients__donut-hole {
  position: absolute;
  inset: 2.8rem;
  background: #fff;
  border-radius: 50%;
}

.admin-clients__filters {
  width: fit-content;
  margin-top: 1.6rem;
  margin-bottom: 1.6rem;
}

.admin-clients__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 1.4rem;
  margin-bottom: 1.6rem;
}

.admin-clients__tab {
  min-width: 12.6rem;
  height: 4.8rem;
  padding: 0 2rem;
  background: #fff;
  border: 0;
  border-radius: 1.4rem;
  font-size: 1.45rem;
  color: #1f1f1f;
  cursor: pointer;
}

.admin-clients__tab--active {
  background: $linear-green;
  color: #fff;
}

.admin-clients__search-row {
  display: flex;
  gap: 1.2rem;
}

.admin-clients__search,
.admin-clients__select {
  display: flex;
  align-items: center;
  height: 4.8rem;
  background: #fff;
  border: 0;
  border-radius: 1.4rem;
}

.admin-clients__search {
  width: 30.2rem;
  padding: 0 1.6rem;

  input {
    width: 100%;
    background: transparent;
    border: 0;
    font-size: 1.45rem;
    color: #454545;

    &::placeholder {
      color: #9e9e9e;
    }
  }
}

.admin-clients__select {
  justify-content: space-between;
  gap: 1.2rem;
  min-width: 15.2rem;
  padding: 0 1.5rem;
  font-size: 1.45rem;
  color: #525252;
  cursor: pointer;
}

.admin-clients__table {
  padding: 1.6rem 1.6rem 2rem;

  &-head,
  &-row {
    display: grid;
    grid-template-columns: 14rem 12rem 1.6fr 1fr 1.2fr 1.2fr 1.55fr 1.2fr 4rem;
    align-items: center;
    gap: 1rem;
  }
}

.admin-clients__table-head {
  padding: 0 1.2rem 1.4rem;
  font-size: 1.35rem;
  color: #aaaaaa;
}

.admin-clients__head-select {
  display: flex;
  align-items: center;
  gap: 1rem;

  :deep(svg) {
    color: #d2d2d2;
  }
}

.admin-clients__table-scroll {
  max-height: 36rem;
  overflow-y: auto;
  padding-right: 0.6rem;

  &::-webkit-scrollbar {
    width: 0.6rem;
  }

  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 999px;
  }
}

.admin-clients__table-row {
  min-height: 4.8rem;
  padding: 0 1.2rem;
  font-size: 1.45rem;
  color: #4b4b4b;
}

.admin-clients__checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.4rem;
  height: 4.4rem;
  color: $green;
}

.admin-clients__expand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  height: 3.4rem;
  background: transparent;
  border: 0;
  color: #a3a3a3;
  cursor: pointer;
}

.admin-clients__table-filler {
  min-height: 25rem;
}

.admin-clients__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.8rem;
  padding-left: 1.2rem;
}

.admin-clients__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  height: 4.8rem;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 0.9rem;
  box-shadow: 0 8px 18px rgba(20, 20, 20, 0.05);
  color: #444;
  cursor: pointer;
}

.admin-clients__action--square {
  width: 4.8rem;
}

.admin-clients__action--wide {
  padding: 0 1.7rem;
  font-size: 1.5rem;
}

@media (max-width: 1520px) {
  .admin-clients__table {
    overflow-x: auto;
  }

  .admin-clients__table-head,
  .admin-clients__table-row,
  .admin-clients__actions {
    min-width: 120rem;
  }
}

@media (max-width: 1280px) {
  .admin-clients__top {
    grid-template-columns: 1fr;
    max-width: none;
  }
}
</style>
