<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const pvzLocationLegend = [
  { label: 'Луганск', value: '60%', color: '#b9e8c4' },
  { label: 'Алчевск', value: '25%', color: '#68d27f' },
  { label: 'Ростов-на-Дону', value: '15%', color: '#18b536' },
]

const ordersLegend = [
  { label: 'Ростов-на-Дону', value: '46%', color: '#ff8a00' },
  { label: 'Алчевск', value: '27%', color: '#ffb255' },
  { label: 'Луганск', value: '27%', color: '#ffd8aa' },
]

const pvzRows = [
  {
    id: '1',
    address: 'МО, г. Москва, ул. Пушкина 3',
    load: '50%',
    turnover: '240000₽',
    activeOrders: '5',
    status: 'Открыто',
    tone: 'green' as const,
  },
  {
    id: '2',
    address: 'МО, г. Москва, ул. Пушкина 3',
    load: '60%',
    turnover: '135000₽',
    activeOrders: '2',
    status: 'Закрыто',
    tone: 'gray' as const,
  },
]
</script>

<template>
  <section class="admin-pvz">
    <div class="admin-pvz__heading">
      <h1>ПВЗ</h1>
    </div>

    <div class="admin-pvz__top">
      <div class="admin-pvz__stats">
        <AdminMetricCard title="Всего ПВЗ" value="16" icon="store" class="admin-pvz__card admin-pvz__card--total">
          <div class="admin-pvz__trend">
            <span>↑ 4</span>
            <span>Прибавилось с прошлого года</span>
          </div>
        </AdminMetricCard>

        <AdminMetricCard title="Сотрудники доставки" value="15" icon="clients" class="admin-pvz__card admin-pvz__card--delivery">
          Держим линии доставки в тонусе
        </AdminMetricCard>

        <AdminMetricCard title="Сотрудники ПВЗ" value="24" icon="clients" class="admin-pvz__card admin-pvz__card--team">
          По точкам сейчас всё укомплектовано
        </AdminMetricCard>

        <section class="admin-panel admin-pvz__donut-card admin-pvz__donut-card--locations">
          <h2>Локации ПВЗ</h2>

          <div class="admin-pvz__donut-layout">
            <ul class="admin-pvz__legend">
              <li v-for="item in pvzLocationLegend" :key="item.label">
                <span :style="{ backgroundColor: item.color }" />
                <p>
                  <strong>{{ item.label }}</strong>
                  <em>({{ item.value }})</em>
                </p>
              </li>
            </ul>

            <div class="admin-pvz__donut admin-pvz__donut--green" aria-hidden="true">
              <div class="admin-pvz__donut-hole" />
            </div>
          </div>
        </section>

        <section class="admin-panel admin-pvz__donut-card admin-pvz__donut-card--orders">
          <h2>Локации по кол-ву заказов</h2>

          <div class="admin-pvz__donut-layout">
            <ul class="admin-pvz__legend">
              <li v-for="item in ordersLegend" :key="item.label">
                <span :style="{ backgroundColor: item.color }" />
                <p>
                  <strong>{{ item.label }}</strong>
                  <em>({{ item.value }})</em>
                </p>
              </li>
            </ul>

            <div class="admin-pvz__donut admin-pvz__donut--orange" aria-hidden="true">
              <div class="admin-pvz__donut-hole" />
            </div>
          </div>
        </section>
      </div>
    </div>

    <section class="admin-panel admin-pvz__table">
      <div class="admin-pvz__table-head">
        <span class="admin-pvz__head-select">
          <span>Выбрать всё</span>
          <AdminIcon name="square" :size="20" />
        </span>
        <span>ID ПВЗ</span>
        <span>Адрес</span>
        <span>Загруженность</span>
        <span>Сумма заказов</span>
        <span>Активные заказы</span>
        <span>Статус</span>
        <span />
      </div>

      <div class="admin-pvz__table-scroll">
        <div v-for="row in pvzRows" :key="row.id" class="admin-pvz__table-row">
          <div class="admin-pvz__checkbox">
            <AdminIcon name="check-square" :size="20" />
          </div>
          <span>{{ row.id }}</span>
          <span>{{ row.address }}</span>
          <span>{{ row.load }}</span>
          <span>{{ row.turnover }}</span>
          <span>{{ row.activeOrders }}</span>
          <div>
            <AdminStatusBadge :label="row.status" :tone="row.tone" />
          </div>
          <NuxtLink
            class="admin-pvz__expand"
            :to="`/admin/pvz/${row.id}`"
            :aria-label="`Открыть ПВЗ ${row.id}`"
          >
            <AdminIcon name="chevron-right" :size="18" />
          </NuxtLink>
        </div>

        <div class="admin-pvz__table-filler" />
      </div>

      <div class="admin-pvz__actions">
        <button type="button" class="admin-pvz__action admin-pvz__action--square" aria-label="Добавить ПВЗ">
          <AdminIcon name="store" :size="20" />
        </button>

        <button type="button" class="admin-pvz__action admin-pvz__action--square" aria-label="Закрыть ПВЗ">
          <AdminIcon name="close" :size="20" />
        </button>

        <button type="button" class="admin-pvz__action admin-pvz__action--wide">
          <AdminIcon name="edit" :size="20" />
          <span>Редактировать ПВЗ</span>
        </button>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.admin-pvz__heading {
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

.admin-pvz__top {
  margin-bottom: 1.4rem;
}

.admin-pvz__stats {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.4rem;
}

.admin-pvz__card,
.admin-pvz__donut-card,
.admin-pvz__table {
  background: #fff;
  border-radius: 1.8rem;
}

.admin-pvz__card {
  min-height: 11.2rem;
}

.admin-pvz__card--total {
  grid-column: span 4;
}

.admin-pvz__card--delivery {
  grid-column: span 2;
}

.admin-pvz__card--team {
  grid-column: span 2;
}

.admin-pvz__donut-card {
  padding: 1.5rem 1.7rem;

  h2 {
    margin-bottom: 1.4rem;
    font-size: 1.4rem;
    font-weight: 500;
    color: #4d4d4d;
  }
}
.admin-pvz__donut-card--locations {
  grid-column: span 4;
}

.admin-pvz__donut-card--orders {
  grid-column: span 4;
}

.admin-pvz__trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span:first-child {
    color: $green;
    font-size: 1.45rem;
    font-weight: 600;
  }

  span:last-child {
    color: #9a9a9a;
    font-size: 1.32rem;
  }
}

.admin-pvz__donut-layout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4rem;
  min-height: 15.8rem;
}

.admin-pvz__legend {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  }

  p {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.5rem;
    color: #6f6f6f;
    font-size: 1.4rem;
    line-height: 1.35;
  }

  strong {
    color: #5a5a5a;
    font-weight: 500;
  }

  em {
    color: #9a9a9a;
    font-style: normal;
  }
}

.admin-pvz__donut {
  position: relative;
  width: 15.2rem;
  aspect-ratio: 1;
  border-radius: 50%;
  transform: rotate(-90deg);
}

.admin-pvz__donut--green {
  background: conic-gradient(
    #b9e8c4 0 60%,
    #68d27f 60% 85%,
    #18b536 85% 100%
  );
}

.admin-pvz__donut--orange {
  background: conic-gradient(
    #ff8a00 0 46%,
    #ffb255 46% 73%,
    #ffd8aa 73% 100%
  );
}

.admin-pvz__donut-hole {
  position: absolute;
  inset: 2.4rem;
  background: #fff;
  border-radius: 50%;
}

.admin-pvz__table {
  padding: 1.6rem 1.6rem 2rem;
}

.admin-pvz__table-head,
.admin-pvz__table-row {
  display: grid;
  grid-template-columns: 14rem 11rem 1.9fr 1fr 1.25fr 1.25fr 1.25fr 4rem;
  align-items: center;
  gap: 1rem;
}

.admin-pvz__table-head {
  padding: 0 1.2rem 1.4rem;
  font-size: 1.35rem;
  color: #9f9f9f;
}

.admin-pvz__head-select {
  display: flex;
  align-items: center;
  gap: 1rem;

  :deep(svg) {
    color: #d2d2d2;
  }
}

.admin-pvz__table-scroll {
  max-height: 34rem;
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

.admin-pvz__table-row {
  min-height: 4.8rem;
  padding: 0 1.2rem;
  font-size: 1.45rem;
  color: #4a4a4a;
}

.admin-pvz__checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.4rem;
  height: 4.4rem;
  color: $green;
}

.admin-pvz__expand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  height: 3.4rem;
  color: #a3a3a3;
}

.admin-pvz__table-filler {
  min-height: 20rem;
}

.admin-pvz__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.8rem;
  padding-left: 1.2rem;
}

.admin-pvz__action {
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

.admin-pvz__action--square {
  width: 4.8rem;
}

.admin-pvz__action--wide {
  padding: 0 1.7rem;
  font-size: 1.5rem;
}

@media (max-width: 1520px) {
  .admin-pvz__table {
    overflow-x: auto;
  }

  .admin-pvz__table-head,
  .admin-pvz__table-row,
  .admin-pvz__actions {
    min-width: 108rem;
  }
}

@media (max-width: 1360px) {
  .admin-pvz__card--total,
  .admin-pvz__card--delivery,
  .admin-pvz__card--team,
  .admin-pvz__donut-card--locations,
  .admin-pvz__donut-card--orders {
    grid-column: span 6;
  }
}

@media (max-width: 1180px) {
  .admin-pvz__stats {
    grid-template-columns: 1fr;
  }

  .admin-pvz__card--total,
  .admin-pvz__card--delivery,
  .admin-pvz__card--team,
  .admin-pvz__donut-card--locations,
  .admin-pvz__donut-card--orders {
    grid-column: auto;
  }
}
</style>

