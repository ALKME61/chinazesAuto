<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'

definePageMeta({
  layout: 'pvz',
  pvzSidebar: [
    { label: 'История смены', to: '/pvz/history', icon: 'history' },
  ],
})

const historyItems = [
  { time: '09:12', title: 'Открыта смена', note: 'Алексей Курбатов вошёл в ПВЗ и подтвердил старт смены.' },
  { time: '09:28', title: 'Коробка BX-001 добавлена в неразобранные', note: 'Приёмка коробки без немедленного разбора.' },
  { time: '10:05', title: 'Выданы заказы пользователя Иван Петров', note: 'Идентификация по 4 цифрам телефона + SMS-коду.' },
  { time: '11:17', title: 'Создан возврат от клиента', note: 'Зафиксирована причина и состояние товара.' },
] as const

const unresolved = [
  '2 неразобранные коробки в очереди',
  '1 возврат ожидает отгрузки поставщику',
  '3 товара перемещены в дополнительные ячейки пользователя',
]
</script>

<template>
  <section class="pvz-history">
    <div class="pvz-history__heading">
      <h1>История смены</h1>
    </div>

    <div class="pvz-history__grid">
      <section class="pvz-history__panel">
        <div class="pvz-history__panel-head">
          <h2>Смена</h2>
        </div>

        <div class="pvz-history__stats">
          <article>
            <span>Статус</span>
            <strong>Открыта</strong>
          </article>
          <article>
            <span>Оператор</span>
            <strong>Алексей Курбатов</strong>
          </article>
          <article>
            <span>Старт</span>
            <strong>09:12</strong>
          </article>
          <article>
            <span>Передача смены</span>
            <strong>Не запланирована</strong>
          </article>
        </div>

        <div class="pvz-history__actions">
          <button type="button" class="pvz-history__primary">Закрыть смену</button>
          <button type="button" class="pvz-history__secondary">Передать смену</button>
        </div>
      </section>

      <section class="pvz-history__panel">
        <div class="pvz-history__panel-head">
          <h2>Незавершённые хвосты</h2>
          <span>Без спорных действий</span>
        </div>

        <ul class="pvz-history__todo">
          <li v-for="item in unresolved" :key="item">{{ item }}</li>
        </ul>
      </section>
    </div>

    <section class="pvz-history__panel">
      <div class="pvz-history__panel-head">
        <h2>Журнал действий</h2>
        <span>Кто и когда что сделал</span>
      </div>

      <div class="pvz-history__timeline">
        <article v-for="item in historyItems" :key="`${item.time}-${item.title}`">
          <div class="pvz-history__time">{{ item.time }}</div>
          <div class="pvz-history__line" />
          <div class="pvz-history__event">
            <strong>{{ item.title }}</strong>
            <p>{{ item.note }}</p>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.pvz-history {
  display: grid;
  gap: 2rem;
}

.pvz-history__heading {
  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #353535;
  }

  p {
    margin-top: 0.8rem;
    max-width: 80rem;
    font-size: 1.45rem;
    line-height: 1.55;
    color: #757575;
  }
}

.pvz-history__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(28rem, 0.8fr);
  gap: 2rem;
}

.pvz-history__panel {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
}

.pvz-history__panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }

  span {
    margin-top: 0.4rem;
    font-size: 1.3rem;
    color: #8d8d8d;
  }
}

.pvz-history__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.6rem;

  article {
    padding: 1.4rem;
    background: #fafafa;
    border-radius: 1.5rem;
  }

  span {
    display: block;
    font-size: 1.2rem;
    color: #949494;
  }

  strong {
    display: block;
    margin-top: 0.7rem;
    font-size: 1.45rem;
    color: #373737;
  }
}

.pvz-history__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.6rem;
}

.pvz-history__primary,
.pvz-history__secondary {
  min-height: 4.8rem;
  padding: 0 1.6rem;
  border: 0;
  border-radius: 1.2rem;
  font-size: 1.35rem;
  cursor: pointer;
}

.pvz-history__primary {
  background: $linear-green;
  color: #fff;
}

.pvz-history__secondary {
  background: #f4f8f4;
  color: #18b536;
}

.pvz-history__todo {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.5rem;
  padding-left: 1.8rem;

  li {
    font-size: 1.35rem;
    line-height: 1.45;
    color: #626262;
  }
}

.pvz-history__timeline {
  display: grid;
  gap: 1.4rem;
  margin-top: 1.8rem;

  article {
    display: grid;
    grid-template-columns: 7rem 2rem minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
  }
}

.pvz-history__time {
  font-size: 1.35rem;
  font-weight: 600;
  color: #18b536;
}

.pvz-history__line {
  position: relative;
  width: 2rem;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0.5rem;
    left: 0.45rem;
    width: 1rem;
    height: 1rem;
    background: #18b536;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    top: 1.8rem;
    bottom: -0.8rem;
    left: 0.88rem;
    width: 1px;
    background: #e7f4ea;
  }
}

.pvz-history__timeline article:last-child .pvz-history__line::after {
  display: none;
}

.pvz-history__event {
  padding-bottom: 0.5rem;

  strong {
    display: block;
    font-size: 1.45rem;
    color: #3a3a3a;
  }

  p {
    margin-top: 0.5rem;
    font-size: 1.3rem;
    line-height: 1.5;
    color: #7a7a7a;
  }
}

@media (max-width: 1380px) {
  .pvz-history__grid,
  .pvz-history__stats {
    grid-template-columns: 1fr;
  }
}
</style>
