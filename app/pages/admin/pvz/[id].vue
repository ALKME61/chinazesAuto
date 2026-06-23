<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const route = useRoute()

const tabs = [
  { label: 'Информация', key: 'info' },
  { label: 'Ячейки', key: 'cells' },
  { label: 'Сотрудники', key: 'employees' },
  { label: 'Статистика', key: 'stats' },
]

const pvzId = computed(() => String(route.params.id))
const activeTab = computed(() => {
  const tab = route.query.tab

  if (typeof tab === 'string' && tabs.some((item) => item.key === tab)) {
    return tab
  }

  return 'info'
})

const cellsRows = [
  { number: '111', name: 'Иванов Иван Иванович', count: '2', total: '3000₽' },
  { number: '112', name: 'Иванов Иван Иванович', count: '4', total: '5700₽' },
]

const employeesRows = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    contacts: '2',
    socials: ['TG', 'WA'],
    experience: '3 года',
    status: 'На смене',
    tone: 'green' as const,
  },
  {
    id: '2',
    name: 'Иванов Борис Иванович',
    contacts: '1',
    socials: ['TG'],
    experience: '1 год',
    status: 'На смене',
    tone: 'green' as const,
  },
]

const chartData = computed(() => [
  { label: 'Янв', value: 4500 },
  { label: 'Фев', value: 13000 },
  { label: 'Мар', value: 23000 },
  { label: 'Апр', value: 5500 },
  { label: 'Май', value: 12500 },
  { label: 'Июнь', value: 26000 },
  { label: 'Июль', value: 18500 },
  { label: 'Авг', value: 11200 },
  { label: 'Сент', value: 9000 },
  { label: 'Окт', value: 23000 },
  { label: 'Ноя', value: 28000 },
  { label: 'Дек', value: 22500 },
])
</script>

<template>
  <section class="pvz-detail">
    <div class="pvz-detail__heading">
      <h1>ПВЗ ID {{ pvzId }}</h1>
      <p>МО, г. Москва, ул. Пушкина 3</p>
    </div>

    <nav class="pvz-detail__tabs" aria-label="Разделы ПВЗ">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.key"
        class="pvz-detail__tab"
        :class="{ 'pvz-detail__tab--active': activeTab === tab.key }"
        :to="{ path: `/admin/pvz/${pvzId}`, query: tab.key === 'info' ? {} : { tab: tab.key } }"
      >
        {{ tab.label }}
      </NuxtLink>
    </nav>

    <template v-if="activeTab === 'info'">
      <div class="pvz-detail__info-top">
        <AdminMetricCard title="Статус ПВЗ" value="Открыто" icon="store" class="pvz-detail__status-card">
          Ещё 2 часа 37 минут
        </AdminMetricCard>

        <section class="pvz-detail__schedule">
          <div class="pvz-detail__panel-heading">
            <h2>График работы</h2>
            <AdminIcon name="clients" :size="20" />
          </div>

          <div class="pvz-detail__schedule-grid">
            <span>ПН-ПТ</span>
            <strong>8:00 - 20:00</strong>
            <span>СБ</span>
            <strong>8:00 - 19:00</strong>
            <span>ВСК</span>
            <strong>Выходной</strong>
          </div>
        </section>
      </div>

      <section class="pvz-detail__map-panel">

        <div class="pvz-detail__map-actions">
          <div class="pvz-detail__address-chip">МО, г. Москва, ул. Пушкина 3</div>
          <button type="button" class="pvz-detail__primary-button">Принять изменения</button>
        </div>
      </section>
    </template>

    <template v-else-if="activeTab === 'cells'">
      <div class="pvz-detail__toolbar">
        <div class="pvz-detail__segmented">
          <button type="button" class="pvz-detail__segment pvz-detail__segment--active">Стеллаж</button>
          <button type="button" class="pvz-detail__segment">Полка</button>
          <button type="button" class="pvz-detail__segment">Ячейка</button>
        </div>

        <label class="pvz-detail__switch">
          <input type="checkbox" checked>
          <span />
          <em>Поиск по топологии</em>
        </label>
      </div>

      <section class="pvz-detail__table-panel">
        <div class="pvz-detail__table-head pvz-detail__table-head--cells">
          <span class="pvz-detail__head-select">
            <span>Выбрать всё</span>
            <AdminIcon name="square" :size="20" />
          </span>
          <span>№ СПЯ</span>
          <span>ФИО</span>
          <span>Кол-во товара</span>
          <span>Сумма товара</span>
        </div>

        <div class="pvz-detail__table-scroll">
          <div v-for="row in cellsRows" :key="row.number" class="pvz-detail__table-row pvz-detail__table-row--cells">
            <div class="pvz-detail__checkbox">
              <AdminIcon name="check-square" :size="20" />
            </div>
            <span>{{ row.number }}</span>
            <span>{{ row.name }}</span>
            <span>{{ row.count }}</span>
            <span>{{ row.total }}</span>
          </div>

          <div class="pvz-detail__table-filler" />
        </div>

        <button type="button" class="pvz-detail__primary-button pvz-detail__primary-button--compact">Добавить СПЯ</button>
      </section>
    </template>

    <template v-else-if="activeTab === 'employees'">
      <div class="pvz-detail__employees-top">
        <section class="pvz-detail__shift-card">
          <div class="pvz-detail__panel-heading">
            <h2>Сейчас на смене</h2>
            <AdminIcon name="clients" :size="20" />
          </div>

          <div class="pvz-detail__shift-list">
            <div>
              <strong>Иванов Иван Иванович</strong>
              <span>+7 (123) 456-78-90</span>
            </div>
            <div>
              <strong>Иванов Борис Иванович</strong>
              <span>+7 (123) 456-78-90</span>
            </div>
          </div>
        </section>
      </div>

      <section class="pvz-detail__table-panel">
        <div class="pvz-detail__table-head pvz-detail__table-head--employees">
          <span class="pvz-detail__head-select">
            <span>Выбрать всё</span>
            <AdminIcon name="square" :size="20" />
          </span>
          <span>ID сотрудника</span>
          <span>ФИО</span>
          <span>Контактные данные</span>
          <span>Соц. сети для связи</span>
          <span>Стаж работы(лет)</span>
          <span>Статус</span>
        </div>

        <div class="pvz-detail__table-scroll">
          <div
            v-for="row in employeesRows"
            :key="row.id"
            class="pvz-detail__table-row pvz-detail__table-row--employees"
          >
            <div class="pvz-detail__checkbox">
              <AdminIcon name="check-square" :size="20" />
            </div>
            <span>{{ row.id }}</span>
            <span>{{ row.name }}</span>
            <span>{{ row.contacts }}</span>
            <div class="pvz-detail__socials">
              <span
                v-for="social in row.socials"
                :key="`${row.id}-${social}`"
                class="pvz-detail__social"
                :class="`pvz-detail__social--${social.toLowerCase()}`"
              >
                {{ social }}
              </span>
            </div>
            <span>{{ row.experience }}</span>
            <div>
              <AdminStatusBadge :label="row.status" :tone="row.tone" />
            </div>
          </div>

          <div class="pvz-detail__table-filler" />
        </div>

        <button type="button" class="pvz-detail__primary-button pvz-detail__primary-button--compact">Добавить сотрудника</button>
      </section>
    </template>

    <template v-else>
      <div class="pvz-detail__stats-top">
        <AdminMetricCard title="Активные заказы" value="32" icon="store" class="pvz-detail__stats-card">
          Контролируем выдачу по точке
        </AdminMetricCard>
        <AdminMetricCard title="Доход за Декабрь" value="+130000₽" icon="store" class="pvz-detail__stats-card">
          Текущий ритм выше среднего
        </AdminMetricCard>
        <AdminMetricCard title="Чистая прибыль" value="+70000₽" icon="store" class="pvz-detail__stats-card">
          После вычета расходов точки
        </AdminMetricCard>
      </div>

      <article class="pvz-detail__chart-card">
        <div class="pvz-detail__chart-head">
          <button class="pvz-detail__chart-period" type="button">
            Оборот за год
            <span class="pvz-detail__chart-chevron" />
          </button>
        </div>
        <AdminAreaChart :data="chartData" y-suffix="₽" value-label="Оборот" gradient-id="pvz-stats-gradient" />
      </article>
    </template>
  </section>
</template>

<style scoped lang="scss">
.pvz-detail__heading {
  margin-bottom: 1rem;

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

.pvz-detail__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4rem;
  margin-bottom: 1.6rem;
}

.pvz-detail__tab {
  font-size: 1.6rem;
  color: #343434;
  transition: color 0.2s ease;
}

.pvz-detail__tab--active {
  color: $green;
  font-weight: 600;
}

.pvz-detail__info-top,
.pvz-detail__stats-top {
  display: grid;
  gap: 1.4rem;
  margin-bottom: 1.4rem;
}

.pvz-detail__info-top {
  grid-template-columns: minmax(0, 1.35fr) minmax(24rem, 0.65fr);
}

.pvz-detail__stats-top {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.pvz-detail__status-card,
.pvz-detail__stats-card,
.pvz-detail__schedule,
.pvz-detail__map-panel,
.pvz-detail__table-panel,
.pvz-detail__shift-card,
.pvz-detail__chart-card {
  background: #fff;
  border-radius: 1.8rem;
}

.pvz-detail__panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  h2 {
    font-size: 1.4rem;
    font-weight: 500;
    color: #4d4d4d;
  }
}

.pvz-detail__schedule {
  padding: 1.5rem 1.6rem;
}

.pvz-detail__schedule-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.9rem 1.4rem;
  margin-top: 1.2rem;

  span,
  strong {
    font-size: 1.4rem;
    line-height: 1.35;
  }

  span {
    color: #6fcf7f;
    font-weight: 500;
  }

  strong {
    color: #787878;
    font-weight: 400;
  }
}

.pvz-detail__map-panel {
  padding: 0.8rem;
}

.pvz-detail__map {
  position: relative;
  height: 35.2rem;
  overflow: hidden;
  border-radius: 1.4rem;
  background:
    linear-gradient(25deg, transparent 0 46%, rgba(255, 255, 255, 0.55) 46% 49%, transparent 49% 100%),
    linear-gradient(115deg, transparent 0 53%, rgba(255, 255, 255, 0.55) 53% 56%, transparent 56% 100%),
    linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    radial-gradient(circle at 18% 22%, #d7efc9 0 4rem, transparent 4rem),
    radial-gradient(circle at 76% 18%, #dcefc9 0 3.8rem, transparent 3.8rem),
    radial-gradient(circle at 87% 78%, #dbeec7 0 4.5rem, transparent 4.5rem),
    linear-gradient(135deg, #f3f5fb 0%, #f7f1e8 100%);
}

.pvz-detail__river,
.pvz-detail__road {
  position: absolute;
  border-radius: 999px;
}

.pvz-detail__river {
  width: 52rem;
  height: 1.8rem;
  left: 8rem;
  bottom: 9rem;
  background: #96c8ff;
  transform: rotate(-18deg);
  box-shadow: 0 0 0 0.8rem rgba(150, 200, 255, 0.16);
}

.pvz-detail__road {
  background: rgba(153, 162, 188, 0.72);
}

.pvz-detail__road--one {
  width: 62rem;
  height: 0.9rem;
  left: -2rem;
  top: 16rem;
  transform: rotate(28deg);
}

.pvz-detail__road--two {
  width: 56rem;
  height: 1rem;
  right: -4rem;
  top: 9rem;
  transform: rotate(-32deg);
}

.pvz-detail__road--three {
  width: 54rem;
  height: 0.9rem;
  left: 18rem;
  bottom: 8rem;
  transform: rotate(8deg);
}

.pvz-detail__map-marker {
  position: absolute;
  display: block;
  border-radius: 50%;
}

.pvz-detail__map-marker--main {
  width: 2rem;
  height: 2rem;
  top: 15.2rem;
  left: 49rem;
  background: #ff3d2f;
  box-shadow: 0 0 0 0.4rem rgba(255, 61, 47, 0.18);

  &::after {
    content: '';
    position: absolute;
    top: 0.38rem;
    left: 0.38rem;
    width: 1.24rem;
    height: 1.24rem;
    background: #fff;
    border-radius: 50%;
  }
}

.pvz-detail__map-marker--small {
  width: 1.6rem;
  height: 1.6rem;
  background: rgba(36, 131, 255, 0.88);
  box-shadow: 0 0 0 0.35rem rgba(36, 131, 255, 0.16);
}

.pvz-detail__map-marker--small-one {
  left: 6.8rem;
  bottom: 7rem;
}

.pvz-detail__map-marker--small-two {
  left: 25.8rem;
  bottom: 3.2rem;
}

.pvz-detail__map-marker--small-three {
  left: 42rem;
  bottom: 9.8rem;
}

.pvz-detail__map-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  margin-top: -6.2rem;
  padding: 0 1.2rem 1.2rem;
  position: relative;
  z-index: 1;
}

.pvz-detail__address-chip {
  min-width: 28rem;
  padding: 1.5rem 1.8rem;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 1.4rem;
  box-shadow: 0 10px 26px rgba(23, 26, 28, 0.08);
  font-size: 1.45rem;
  color: #5b5b5b;
}

.pvz-detail__primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 25rem;
  height: 4.8rem;
  padding: 0 2rem;
  background: $linear-green;
  border: 0;
  border-radius: 1rem;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
}

.pvz-detail__primary-button--compact {
  min-width: 21rem;
  margin-top: 1.8rem;
  margin-left: 1.2rem;
}

.pvz-detail__toolbar {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.4rem;
}

.pvz-detail__segmented {
  display: inline-grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 1.2rem;
}

.pvz-detail__segment {
  min-width: 10rem;
  height: 4.4rem;
  padding: 0 1.6rem;
  background: transparent;
  border: 0;
  border-right: 1px solid #ececec;
  font-size: 1.4rem;
  color: #8b8b8b;
  cursor: pointer;

  &:last-child {
    border-right: 0;
  }
}

.pvz-detail__segment--active {
  color: #515151;
  background: #fcfcfc;
}

.pvz-detail__switch {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  span {
    position: relative;
    width: 2.8rem;
    height: 1.8rem;
    background: $green;
    border-radius: 999px;

    &::after {
      content: '';
      position: absolute;
      top: 0.2rem;
      left: 1.2rem;
      width: 1.4rem;
      height: 1.4rem;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.16);
    }
  }

  em {
    font-size: 1.45rem;
    color: #525252;
    font-style: normal;
  }
}

.pvz-detail__employees-top {
  margin-bottom: 1.4rem;
}

.pvz-detail__shift-card {
  width: min(100%, 47rem);
  padding: 1.5rem 1.6rem;
}

.pvz-detail__shift-list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;

  strong {
    display: block;
    font-size: 2rem;
    font-weight: 600;
    color: #4a4a4a;
  }

  span {
    display: block;
    margin-top: 0.5rem;
    font-size: 1.35rem;
    color: #999;
  }
}

.pvz-detail__table-panel {
  padding: 1.6rem 1.6rem 2rem;
}

.pvz-detail__table-head,
.pvz-detail__table-row {
  display: grid;
  align-items: center;
  gap: 1rem;
}

.pvz-detail__table-head {
  padding: 0 1.2rem 1.4rem;
  font-size: 1.35rem;
  color: #a3a3a3;
}

.pvz-detail__table-head--cells,
.pvz-detail__table-row--cells {
  grid-template-columns: 14rem 1.1fr 1.8fr 1.2fr 1.2fr;
}

.pvz-detail__table-head--employees,
.pvz-detail__table-row--employees {
  grid-template-columns: 14rem 1fr 1.7fr 1.2fr 1.55fr 1.2fr 1.25fr;
}

.pvz-detail__head-select {
  display: flex;
  align-items: center;
  gap: 1rem;

  :deep(svg) {
    color: #d2d2d2;
  }
}

.pvz-detail__table-scroll {
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

.pvz-detail__table-row {
  min-height: 4.8rem;
  padding: 0 1.2rem;
  font-size: 1.45rem;
  color: #4a4a4a;
}

.pvz-detail__checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.4rem;
  height: 4.4rem;
  color: $green;
}

.pvz-detail__socials {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.pvz-detail__social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.2rem;
  height: 3.2rem;
  padding: 0 0.8rem;
  border-radius: 999px;
  color: #fff;
  font-size: 1.15rem;
  font-weight: 600;
}

.pvz-detail__social--tg {
  background: #39a9eb;
}

.pvz-detail__social--wa {
  background: #5ccd68;
}

.pvz-detail__table-filler {
  min-height: 18rem;
}

.pvz-detail__chart-card {
  padding: 2.2rem 2.2rem 1.8rem;
  background: #fff;
  border-radius: 1.8rem;
}

.pvz-detail__chart-head {
  margin-bottom: 2.2rem;
}

.pvz-detail__chart-period {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0;
  background: transparent;
  border: 0;
  font-size: 1.8rem;
  color: #373737;
  cursor: pointer;
}

.pvz-detail__chart-chevron {
  width: 0.9rem;
  height: 0.9rem;
  border-right: 1.5px solid #5f5f5f;
  border-bottom: 1.5px solid #5f5f5f;
  transform: rotate(45deg) translateY(-1px);
}

.pvz-detail__chart-body {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  gap: 1.8rem;
}

.pvz-detail__axis {
  display: flex;
  color: #a4a4a4;
}

.pvz-detail__axis--y {
  flex-direction: column;
  justify-content: space-between;
  height: 35rem;
  padding: 2.1rem 0 4.8rem;

  span {
    font-size: 1.1rem;
    line-height: 1;
    white-space: nowrap;
  }
}

.pvz-detail__plot {
  position: relative;
  min-width: 0;
  height: 35rem;
  padding-bottom: 4.8rem;
}

.pvz-detail__canvas {
  position: relative;
  height: calc(100% - 4.8rem);
}

.pvz-detail__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.pvz-detail__grid {
  line {
    stroke: rgba(228, 228, 228, 0.9);
    stroke-width: 1;
  }
}

.pvz-detail__area {
  fill: url(#pvz-stats-gradient);
}

.pvz-detail__line {
  fill: none;
  stroke: #ff8800;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pvz-detail__marker {
  position: absolute;
  z-index: 2;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.pvz-detail__marker-ring,
.pvz-detail__marker-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.pvz-detail__marker-ring {
  background: #ff8800;
}

.pvz-detail__marker-ring--outer {
  width: 5.4rem;
  height: 5.4rem;
  opacity: 0.14;
}

.pvz-detail__marker-ring--inner {
  width: 3.2rem;
  height: 3.2rem;
  opacity: 0.24;
}

.pvz-detail__marker-dot {
  width: 1.6rem;
  height: 1.6rem;
  background: #ff8800;
  border: 0.6rem solid #fff;
  box-sizing: content-box;
}

.pvz-detail__tooltip {
  position: absolute;
  z-index: 2;
  width: 18rem;
  padding: 1.6rem 1.4rem 1.2rem;
  background: #fff;
  border-radius: 1.8rem;
  box-shadow: 0 20px 45px rgba(28, 30, 32, 0.12);
  transform: translate(1.8rem, 2.2rem);

  h3 {
    margin-bottom: 1.4rem;
    font-size: 1.6rem;
    font-weight: 500;
    color: #3a3a3a;
  }
}

.pvz-detail__tooltip-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;

  strong {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
    font-weight: 400;
    color: #4a4a4a;
  }

  span {
    font-size: 1.1rem;
    color: #8b8b8b;
  }
}

.pvz-detail__axis--x {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));

  span {
    justify-self: center;
    font-size: 1.2rem;
    color: #444;
  }
}

@media (max-width: 1520px) {
  .pvz-detail__table-panel {
    overflow-x: auto;
  }

  .pvz-detail__table-head--cells,
  .pvz-detail__table-row--cells {
    min-width: 84rem;
  }

  .pvz-detail__table-head--employees,
  .pvz-detail__table-row--employees {
    min-width: 110rem;
  }
}

@media (max-width: 1260px) {
  .pvz-detail__info-top,
  .pvz-detail__stats-top {
    grid-template-columns: 1fr;
  }

  .pvz-detail__map-actions {
    flex-direction: column;
    align-items: stretch;
    margin-top: 1.2rem;
    padding: 0 0.4rem 0.4rem;
  }

  .pvz-detail__address-chip,
  .pvz-detail__primary-button {
    min-width: 0;
    width: 100%;
  }
}
</style>
