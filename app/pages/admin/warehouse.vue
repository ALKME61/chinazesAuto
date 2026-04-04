<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const utilization = [
  { label: 'Луганск-1', value: '78%', color: '#18b536' },
  { label: 'РНД-Центр', value: '64%', color: '#68d27f' },
  { label: 'Резервный склад', value: '41%', color: '#b9e8c4' },
]

const warehouseTasks = [
  { title: 'Низкий остаток по фильтрам', note: '12 позиций требуют пополнения', tone: 'orange' },
  { title: 'Ожидается поставка BOSCH', note: 'Приемка назначена на сегодня', tone: 'green' },
  { title: 'Проверить пересорт', note: 'Склад РНД-Центр, 4 позиции', tone: 'gray' },
]

const stockRows = [
  {
    id: '48231',
    name: 'Фильтр масляный BOSCH',
    article: 'BSC-48231',
    markup: '18%',
    purchasePrice: '420₽',
    salePrice: '496₽',
    warehouse: 'Луганск-1',
  },
  {
    id: '19384',
    name: 'Аккумулятор Zekkert 75Ah',
    article: 'ZEK-19384',
    markup: '22%',
    purchasePrice: '8200₽',
    salePrice: '10004₽',
    warehouse: 'РНД-Центр',
  },
]
</script>

<template>
  <section class="admin-warehouse">
    <div class="admin-warehouse__heading">
      <h1>Склад</h1>
      <p>Держим остатки, поставки и точки пополнения под контролем.</p>
    </div>

    <section class="admin-panel admin-warehouse__table-panel">
      <div class="admin-warehouse__controls">
        <div class="admin-warehouse__tabs">
          <button type="button" class="admin-warehouse__tab admin-warehouse__tab--active">Все склады</button>
          <button type="button" class="admin-warehouse__tab">ЛУГАНСК-1</button>
          <button type="button" class="admin-warehouse__tab">РНД-ЦЕНТР</button>
          <button type="button" class="admin-warehouse__tab admin-warehouse__tab--icon">+</button>
        </div>

        <div class="admin-warehouse__actions-row">
          <button type="button" class="admin-warehouse__ghost-action">
            <AdminIcon name="download" :size="18" />
            <span>Загрузить из Excel</span>
          </button>

          <button type="button" class="admin-warehouse__ghost-action">
            <AdminIcon name="package" :size="18" />
            <span>Добавить товар</span>
          </button>

          <button type="button" class="admin-warehouse__ghost-action">
            <AdminIcon name="close" :size="18" />
            <span>Удалить товар</span>
          </button>

          <button type="button" class="admin-warehouse__ghost-action">
            <AdminIcon name="edit" :size="18" />
            <span>Редактировать товар</span>
          </button>
        </div>

        <label class="admin-warehouse__search">
          <input type="text" placeholder="Поиск по параметрам">
        </label>
      </div>

      <div class="admin-warehouse__table-head">
        <span>ID товара</span>
        <span>Наименование</span>
        <span>Артикул</span>
        <span>Наценка</span>
        <span>Цена закупки</span>
        <span>Цена продажи</span>
        <span>Склад</span>
        <span />
      </div>

      <div class="admin-warehouse__table-scroll">
        <div v-for="row in stockRows" :key="row.id" class="admin-warehouse__table-row">
          <span>{{ row.id }}</span>
          <span>{{ row.name }}</span>
          <span>{{ row.article }}</span>
          <span>{{ row.markup }}</span>
          <span>{{ row.purchasePrice }}</span>
          <span>{{ row.salePrice }}</span>
          <span>{{ row.warehouse }}</span>
          <button type="button" class="admin-warehouse__expand" aria-label="Подробнее о товаре">
            <AdminIcon name="chevron-down" :size="18" />
          </button>
        </div>

        <div class="admin-warehouse__table-filler" />
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.admin-warehouse__heading {
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

.admin-warehouse__top {
  display: grid;
  grid-template-columns: minmax(0, 1.42fr) minmax(34rem, 0.98fr);
  gap: 1.4rem;
  margin-bottom: 1.4rem;
}

.admin-warehouse__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-areas:
    'total total attention attention'
    'incoming moves capacity capacity'
    'review writeoff capacity capacity';
  grid-auto-rows: minmax(10.8rem, auto);
  gap: 1.4rem;
}

.admin-warehouse__card {
  min-height: 10.8rem;
}

.admin-warehouse__card--total {
  grid-area: total;
  min-height: 11.6rem;
}

.admin-warehouse__card--attention {
  grid-area: attention;
  min-height: 11.6rem;
}

.admin-warehouse__card--incoming {
  grid-area: incoming;
}

.admin-warehouse__card--moves {
  grid-area: moves;
}

.admin-warehouse__card--review {
  grid-area: review;
}

.admin-warehouse__card--writeoff {
  grid-area: writeoff;
}

.admin-warehouse__trend {
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

.admin-warehouse__capacity {
  grid-area: capacity;
  padding: 1.5rem 1.6rem;

  h2 {
    margin-bottom: 1.6rem;
    font-size: 1.4rem;
    color: #4d4d4d;
    font-weight: 500;
  }
}

.admin-warehouse__capacity-list {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.admin-warehouse__capacity-row {
  display: grid;
  gap: 0.8rem;
}

.admin-warehouse__capacity-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.35rem;

  strong {
    color: #595959;
    font-weight: 500;
  }

  span {
    color: #909090;
  }
}

.admin-warehouse__capacity-track {
  height: 1rem;
  background: #eff4ef;
  border-radius: 999px;
  overflow: hidden;
}

.admin-warehouse__capacity-fill {
  height: 100%;
  border-radius: inherit;
}

.admin-warehouse__tasks {
  padding: 1.5rem 1.8rem;

  h2 {
    margin-bottom: 1.6rem;
    font-size: 1.4rem;
    color: #4d4d4d;
    font-weight: 500;
  }
}

.admin-warehouse__tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.admin-warehouse__task {
  display: grid;
  grid-template-columns: 1rem minmax(0, 1fr);
  align-items: flex-start;
  gap: 1rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid #f1f1f1;

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  h3 {
    margin-bottom: 0.4rem;
    font-size: 1.45rem;
    font-weight: 500;
    color: #505050;
  }

  p {
    font-size: 1.32rem;
    color: #8c8c8c;
    line-height: 1.35;
  }
}

.admin-warehouse__task-dot {
  width: 1rem;
  height: 1rem;
  margin-top: 0.35rem;
  border-radius: 50%;
}

.admin-warehouse__task-dot--orange {
  background: #ff9f29;
}

.admin-warehouse__task-dot--green {
  background: #18b536;
}

.admin-warehouse__task-dot--gray {
  background: #bbbbbb;
}

.admin-warehouse__table-panel {
  padding: 1.6rem 1.6rem 2rem;
}

.admin-warehouse__controls {
  display: grid;
  gap: 1.6rem;
  margin-bottom: 1.6rem;
}

.admin-warehouse__tabs,
.admin-warehouse__actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
}

.admin-warehouse__tab,
.admin-warehouse__ghost-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  min-height: 4.8rem;
  padding: 0 1.8rem;
  background: #fff;
  border: 0;
  border-radius: 1.2rem;
  color: #343434;
  font-size: 1.45rem;
  cursor: pointer;
}

.admin-warehouse__tab--active {
  background: $linear-green;
  color: #fff;
}

.admin-warehouse__tab--icon {
  width: 4.8rem;
  padding: 0;
  font-size: 3rem;
  line-height: 1;
}

.admin-warehouse__ghost-action {
  border: 1px solid #eeeeee;
  box-shadow: 0 8px 18px rgba(20, 20, 20, 0.04);
}

.admin-warehouse__search {
  display: flex;
  width: 26.6rem;
  height: 4.8rem;
  padding: 0 1.5rem;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 1.2rem;

  input {
    width: 100%;
    border: 0;
    background: transparent;
    font-size: 1.45rem;
    color: #4a4a4a;

    &::placeholder {
      color: #999999;
    }
  }
}

.admin-warehouse__table-head,
.admin-warehouse__table-row {
  display: grid;
  grid-template-columns: 13rem 1.6fr 1.1fr 1fr 1.2fr 1.2fr 1.2fr 4rem;
  align-items: center;
  gap: 1rem;
}

.admin-warehouse__table-head {
  padding: 0 1.2rem 1.4rem;
  font-size: 1.35rem;
  color: #9a9a9a;
}

.admin-warehouse__table-scroll {
  max-height: 39rem;
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

.admin-warehouse__table-row {
  min-height: 4.8rem;
  padding: 0 1.2rem;
  font-size: 1.45rem;
  color: #4a4a4a;
}

.admin-warehouse__expand {
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

.admin-warehouse__table-filler {
  min-height: 28rem;
}

@media (max-width: 1520px) {
  .admin-warehouse__table-panel {
    overflow-x: auto;
  }

  .admin-warehouse__table-head,
  .admin-warehouse__table-row {
    min-width: 104rem;
  }
}

@media (max-width: 1280px) {
  .admin-warehouse__top {
    grid-template-columns: 1fr;
  }
}
</style>
