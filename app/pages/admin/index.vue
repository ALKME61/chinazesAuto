<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const locationLegend = [
  { label: 'Ростов-на-Дону', value: '15%', color: '#18b536' },
  { label: 'Алчевск', value: '25%', color: '#68d27f' },
  { label: 'Луганск', value: '60%', color: '#b9e8c4' },
]

const orderRows = [
  {
    id: '124423',
    customer: 'Иванов Иван Иванович',
    pvz: 'ПВЗ №1',
    discount: '10%',
    items: '3шт.',
    total: '2400₽',
    status: 'Новый',
    statusTone: 'orange' as const,
    date: '10.11.2025',
  },
  {
    id: '124423',
    customer: 'Иванов Иван Иванович',
    pvz: 'ПВЗ №2',
    discount: '0%',
    items: '3шт.',
    total: '16000₽',
    status: 'В обработке',
    statusTone: 'purple' as const,
    date: '10.11.2025',
  },
]
</script>

<template>
  <section class="admin-dashboard">
    <div class="admin-dashboard__heading">
      <h1>Активные заказы</h1>
      <p>Удачной работы, Алексей!</p>
    </div>

    <div class="admin-dashboard__top">
      <div class="admin-dashboard__stats">
        <AdminMetricCard title="Всего заказов" value="13" icon="orders"
          class="admin-dashboard__card admin-dashboard__card--total">
          <div class="admin-dashboard__trend">
            <span>↑ 24%</span>
            <span>С прошлого месяца</span>
          </div>
        </AdminMetricCard>

        <AdminMetricCard title="Вопросы по заказам" value="3" accent
          class="admin-dashboard__card admin-dashboard__card--question">
          Ответить как можно быстрее
        </AdminMetricCard>

        <AdminMetricCard title="Новые заказы" value="4" icon="newOrders"
          class="admin-dashboard__card admin-dashboard__card--new">
          Требуется обслужить
        </AdminMetricCard>

        <AdminMetricCard title="В обработке" value="3" icon="inProgress"
          class="admin-dashboard__card admin-dashboard__card--processing">
          Контролируем
        </AdminMetricCard>

        <AdminMetricCard title="Отгружен" value="3" icon="shippedOrders"
          class="admin-dashboard__card admin-dashboard__card--shipped">
          Почти всё
        </AdminMetricCard>

        <AdminMetricCard title="Отменён" value="2" icon="close"
          class="admin-dashboard__card admin-dashboard__card--cancelled">
          Что-то пошло не так
        </AdminMetricCard>

        <section class="admin-panel admin-dashboard__locations">
          <h2>Статистика по локациям заказов</h2>

          <div class="admin-dashboard__locations-content">
            <ul class="admin-dashboard__legend">
              <li v-for="item in locationLegend" :key="item.label">
                <span :style="{ backgroundColor: item.color }" />
                <p class="admin-dashboard__legend-text">
                  <strong>{{ item.label }}</strong>
                  <em>({{ item.value }})</em>
                </p>
              </li>
            </ul>

            <div class="admin-dashboard__donut" aria-hidden="true">
              <div class="admin-dashboard__donut-hole" />
            </div>
          </div>
        </section>
      </div>

      <section class="admin-panel admin-dashboard__appeals">
        <h2>Обращения</h2>

        <div class="admin-dashboard__appeals-empty">
          <p>Пока что</p>
          <p>обращений нет</p>
          <span>
            <AdminIcon name="celebrate" :size="30" />
          </span>
        </div>
      </section>
    </div>

    <section class="admin-panel admin-table">
      <div class="admin-table__head">
        <span class="admin-table__head-select">
          <span>Выбрать всё</span>
          <AdminIcon name="square" :size="20" />
        </span>
        <span>Номер заказа</span>
        <span>ФИО</span>
        <span>ПВЗ</span>
        <span>Размер скидки</span>
        <span>Кол-во позиций</span>
        <span>Сумма</span>
        <span>Статус заказа</span>
        <span>Дата заказа</span>
        <span />
      </div>

      <div class="admin-table__scroll">
        <div v-for="row in orderRows" :key="`${row.id}-${row.pvz}`" class="admin-table__row">
          <div class="admin-table__checkbox">
            <AdminIcon name="check-square" :size="20" />
          </div>
          <span>{{ row.id }}</span>
          <span>{{ row.customer }}</span>
          <span>{{ row.pvz }}</span>
          <span>{{ row.discount }}</span>
          <span>{{ row.items }}</span>
          <span>{{ row.total }}</span>
          <div>
            <AdminStatusBadge :label="row.status" :tone="row.statusTone" />
          </div>
          <span>{{ row.date }}</span>
          <button type="button" class="admin-table__expand" aria-label="Подробнее о заказе">
            <AdminIcon name="chevron-down" :size="18" />
          </button>
        </div>

        <div class="admin-table__filler" />
      </div>

      <div class="admin-table__actions">
        <button type="button" class="admin-table__action admin-table__action--square" aria-label="Редактировать">
          <AdminIcon name="edit" :size="20" />
        </button>

        <button type="button" class="admin-table__action admin-table__action--square" aria-label="Печать">
          <AdminIcon name="print" :size="20" />
        </button>

        <button type="button" class="admin-table__action admin-table__action--export">
          <AdminIcon name="download" :size="20" />
          <span>Экспорт в Excel</span>
        </button>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.admin-dashboard__heading {
  margin-bottom: 1.8rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #434343;
  }

  p {
    margin-top: 0.4rem;
    font-size: 1.6rem;
    color: #5d5d5d;
  }
}

.admin-dashboard__top {
  display: grid;
  grid-template-columns: minmax(0, 1.42fr) minmax(34rem, 0.98fr);
  gap: 1.4rem;
  margin-bottom: 1.4rem;
}

.admin-dashboard__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-areas:
    'total total question question'
    'new processing locations locations'
    'shipped cancelled locations locations';
  grid-auto-rows: minmax(10.8rem, auto);
  gap: 1.4rem;
}

.admin-dashboard__card {
  min-height: 10.8rem;
}

.admin-dashboard__card--total {
  grid-area: total;
  min-height: 11.6rem;
}

.admin-dashboard__card--question {
  grid-area: question;
  min-height: 11.6rem;
}

.admin-dashboard__card--new {
  grid-area: new;
}

.admin-dashboard__card--processing {
  grid-area: processing;
}

.admin-dashboard__card--shipped {
  grid-area: shipped;
}

.admin-dashboard__card--cancelled {
  grid-area: cancelled;
}

.admin-dashboard__trend {
  display: flex;
  align-items: center;
  gap: 0.4rem;

  span:first-child {
    color: $green;
    font-size: 1.5rem;
    font-weight: 600;
  }

  span:last-child {
    color: #9a9a9a;
    font-size: 1.35rem;
  }
}

.admin-panel {
  background: #fff;
  border-radius: 1.8rem;
}

.admin-dashboard__locations {
  grid-area: locations;
  padding: 1.4rem 1.6rem;

  h2 {
    font-size: 1.4rem;
    color: #4d4d4d;
    font-weight: 500;
  }
}

.admin-dashboard__locations-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  height: calc(100% - 2.6rem);
  min-height: 0;
}

.admin-dashboard__legend {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  min-width: 0;

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
    flex-shrink: 0;
  }
}

.admin-dashboard__legend-text {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: #6c6c6c;
  font-size: 1.4rem;
  line-height: 1.35;

  strong {
    color: #595959;
    font-weight: 500;
  }

  em {
    color: #9a9a9a;
    font-style: normal;
  }
}

.admin-dashboard__donut {
  position: relative;
  width: 13.8rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: conic-gradient(#b9e8c4 0 60%,
      #18b536 60% 75%,
      #68d27f 75% 100%);
  transform: rotate(-90deg);
}

.admin-dashboard__donut-hole {
  position: absolute;
  inset: 2.6rem;
  background: #fff;
  border-radius: 50%;
}

.admin-dashboard__appeals {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 1.4rem 1.8rem;

  h2 {
    font-size: 1.4rem;
    color: #4d4d4d;
    font-weight: 500;
  }
}

.admin-dashboard__appeals-empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c8c8c;
  min-height: 100%;

  p {
    font-size: 1.45rem;
    line-height: 1.2;
  }

  span {
    display: inline-flex;
    margin-top: 1.3rem;
    color: #8d8d8d;
  }
}

.admin-table {
  padding: 1.6rem 1.6rem 2rem;
}

.admin-table__head,
.admin-table__row {
  display: grid;
  grid-template-columns: 13rem 14rem 1.7fr 1fr 1.2fr 1.2fr 1.1fr 1.6fr 1.1fr 4rem;
  align-items: center;
  gap: 1rem;
}

.admin-table__head {
  padding: 0 1.2rem 1.4rem;
  font-size: 1.35rem;
  color: #9a9a9a;
}

.admin-table__head-select {
  display: flex;
  align-items: center;
  gap: 1rem;

  :deep(svg) {
    color: #d2d2d2;
    flex-shrink: 0;
  }
}

.admin-table__scroll {
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

.admin-table__row {
  min-height: 4.8rem;
  padding: 0 1.2rem;
  font-size: 1.45rem;
  color: #4a4a4a;
}

.admin-table__checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.4rem;
  height: 4.4rem;
  color: $green;
}

.admin-table__expand {
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

.admin-table__filler {
  min-height: 24rem;
}

.admin-table__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.8rem;
  padding-left: 1.2rem;
}

.admin-table__action {
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

.admin-table__action--square {
  width: 4.8rem;
}

.admin-table__action--export {
  padding: 0 1.6rem;
  font-size: 1.5rem;
}

@media(max-width: 1400px) {
  .admin-dashboard__top {
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(34rem, 0.98fr);
    gap: 1.4rem;
    margin-bottom: 1.4rem;
  }
}
</style>
