<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'
import PvzProductCard from '~/components/pvz/PvzProductCard.vue'
import PvzScanHero from '~/components/pvz/PvzScanHero.vue'

definePageMeta({
  layout: 'pvz',
  pvzSidebar: [
    { label: 'Неразобранные', to: '/pvz/acceptance', icon: 'box' },
    { label: 'От поставщика', to: '/pvz/acceptance?mode=supplier', icon: 'truck' },
  ],
})

const route = useRoute()
const router = useRouter()

const mode = computed(() => (route.query.mode === 'supplier' ? 'supplier' : 'inbox'))

const suppliers = [
  { value: 'avtoto', label: 'AVTOTO' },
  { value: 'rossko', label: 'ROSSKO' },
  { value: 'armtek', label: 'ARMTEK' },
] as const

const selectedSupplier = computed({
  get: () => {
    const supplier = route.query.supplier
    return typeof supplier === 'string' && suppliers.some((item) => item.value === supplier) ? supplier : 'avtoto'
  },
  set: (value: string) => {
    router.replace({
      query: {
        ...route.query,
        supplier: value,
      },
    })
  },
})

const supplierName = computed(() => suppliers.find((item) => item.value === selectedSupplier.value)?.label ?? 'AVTOTO')

const boxQueue = [
  {
    title: 'Коробка BX-001',
    note: 'Отсканирована и отложена до разбора. Внутри 5 позиций',
  },
  {
    title: 'Коробка BX-002',
    note: 'Отсканирована и отложена до разбора. Внутри 2 позиции',
  },
] as const

const supplierItems = [
  {
    cell: '111',
    code: '4607025331241',
    title: 'Аккумулятор HomeBoy / GS353234',
    subtitle: 'Штрихкод поставщика · пользователь Иван Петров · цена в накладной 2320 ₽',
    quantity: '1 шт.',
  },
  {
    cell: '124',
    code: '4607025331241',
    title: 'Аккумулятор HomeBoy / GS353234',
    subtitle: 'Одинаковый штрихкод у двух заказов · нужен выбор по накладной',
    quantity: 'Совпадение',
    badge: 'Совпадение',
  },
  {
    cell: '208',
    code: '4688121900213',
    title: 'Фильтр масляный / OF9021',
    subtitle: 'Штрихкод поставщика · пользователь Сергей Волков · цена в накладной 870 ₽',
    quantity: '1 шт.',
  },
] as const

const matchingOrders = [
  {
    id: 'CH-22041',
    client: 'Иван Петров',
    article: 'GS353234',
    purchasePrice: '2320 ₽',
    invoicePrice: '2320 ₽',
    status: 'Назначен',
    action: 'Совпало',
    assigned: true,
  },
  {
    id: 'CH-22058',
    client: 'Андрей Соколов',
    article: 'GS353234',
    purchasePrice: '2420 ₽',
    invoicePrice: '2320 ₽',
    status: false,
    action: 'Назначить товар',
    assigned: false,
  },
] as const

const journalItems = [
  'Штрихкод поставщика и внутренний QR, который будет напечатан после назначения товара.',
  'Цена из накладной, цена покупки клиента и итоговое решение оператора.',
  'Кто подтвердил совпадение и в какой момент смены это произошло.',
] as const
</script>

<template>
  <section class="pvz-page">
    <div class="pvz-subnav">
      <NuxtLink :class="{ 'pvz-subnav__link--active': mode === 'inbox' }" to="/pvz/acceptance">Приёмка</NuxtLink>
      <NuxtLink :class="{ 'pvz-subnav__link--active': mode === 'supplier' }" to="/pvz/acceptance?mode=supplier">Приёмка от поставщика</NuxtLink>
    </div>

    <template v-if="mode === 'inbox'">
      <div class="pvz-page__grid">
        <section class="pvz-page__panel">
          <div class="pvz-page__panel-head">
            <h2>Неразобранные поступления</h2>
            <span>Можете разобрать позже</span>
          </div>

          <div class="pvz-page__box-list">
            <article v-for="box in boxQueue" :key="box.title">
              <div>
                <strong>{{ box.title }}</strong>
                <p>{{ box.note }}</p>
              </div>
              <button type="button">Разобрать</button>
            </article>
          </div>

          <div class="pvz-page__tool-row">
            <button type="button" class="pvz-page__primary">Сканировать следующую коробку</button>
            <button type="button" class="pvz-page__secondary">Напечатать QR для товаров</button>
          </div>
        </section>

        <section class="pvz-page__panel">
          <div class="pvz-page__panel-head">
            <h2>Товар потерялся</h2>
            <span>Каркас под будущую логику для поиска и фиксации расхождений.</span>
          </div>

          <div class="pvz-page__lost-card">
            <PvzIcon name="warning" :size="24" />
            <p>Если товар не найден в коробке или потерялся после сканирования, оператор оставляет запись в журнале и отмечает статус для дальнейшего разбора.</p>
          </div>
        </section>
      </div>

      <PvzScanHero
        title="Отсканируйте QR-код коробки"
        subtitle="После сканирования коробка попадает в неразобранные. Её можно закрыть и разобрать позже."
        caption="Следующий шаг: разложить товары и напечатать уникальные QR-коды, привязанные к пользователю."
        icon="box"
      />
    </template>

    <template v-else>
      <section class="pvz-page__workspace">
        <div class="pvz-page__workspace-head">
          <div>
            <h2>Приёмка от поставщика</h2>
            <p>Сначала выбираем поставщика, затем сканируем штрихкоды запчастей. Если одинаковую позицию заказали несколько пользователей, оператор сверяет заказ с накладной и назначает товар нужному клиенту.</p>
          </div>

          <div class="pvz-page__summary">
            <span>Журнал сопоставлений</span>
            <strong>6 записей</strong>
          </div>
        </div>

        <div class="pvz-page__supplier-controls">
          <label>
            <span>Поставщик</span>
            <select v-model="selectedSupplier">
              <option v-for="supplier in suppliers" :key="supplier.value" :value="supplier.value">
                {{ supplier.label }}
              </option>
            </select>
          </label>

          <label>
            <span>Штрихкод поставщика</span>
            <input type="text" placeholder="Например, 4607025331241">
          </label>

          <button type="button" class="pvz-page__primary">Добавить после скана</button>
          <button type="button" class="pvz-page__secondary">Напечатать наши QR-коды</button>
        </div>

        <div class="pvz-page__issue-layout">
          <aside class="pvz-page__issue-sidebar">
            <div class="pvz-page__metric">
              <span>Поставщик</span>
              <strong>{{ supplierName }}</strong>
            </div>
            <div class="pvz-page__metric">
              <span>Отсканировано позиций</span>
              <strong>{{ supplierItems.length }}</strong>
            </div>
            <div class="pvz-page__metric">
              <span>Совпадений на проверке</span>
              <strong>1</strong>
            </div>
            <button type="button" class="pvz-page__primary">Подтвердить разбор поставки</button>
          </aside>

          <div class="pvz-page__products">
            <PvzProductCard
              v-for="item in supplierItems"
              :key="`${item.code}-${item.cell}`"
              :cell="item.cell"
              :code="item.code"
              :title="item.title"
              :subtitle="item.subtitle"
              :quantity="item.quantity"
              :badge="'badge' in item ? item.badge : ''"
              badge-tone="danger"
            />
          </div>
        </div>
      </section>

      <section class="pvz-page__workspace pvz-page__workspace--match">
        <div class="pvz-page__workspace-head">
          <div>
            <h2>Система совпадений</h2>
            <p>Одинаковый штрихкод поставщика может относиться к нескольким заказам. Оператор сверяет данные по заказу с накладной и назначает товар нужному пользователю.</p>
          </div>

          <div class="pvz-page__summary">
            <span>Позиция на проверке</span>
            <strong>1/1</strong>
          </div>
        </div>

        <div class="pvz-page__match-layout">
          <article class="pvz-page__match-card">
            <div class="pvz-page__match-header">
              <strong>Штрихкод 4607025331241</strong>
              <span>AVTOTO · позиция из накладной</span>
            </div>

            <div class="pvz-page__match-body">
              <p><b>Артикул:</b> GS353234</p>
              <p><b>Наименование:</b> Аккумулятор HomeBoy / GS353234</p>
              <p><b>Цена в накладной:</b> 2320 ₽</p>
            </div>
          </article>

          <div class="pvz-page__match-orders">
            <div class="pvz-page__match-table-head">
              <span>Заказ</span>
              <span>Клиент</span>
              <span>Артикул</span>
              <span>Цена покупки</span>
              <span>Цена в накладной</span>
              <span>Статус</span>
              <span></span>
            </div>

            <div v-for="order in matchingOrders" :key="order.id" class="pvz-page__match-row">
              <span>{{ order.id }}</span>
              <span>{{ order.client }}</span>
              <span>{{ order.article }}</span>
              <span>{{ order.purchasePrice }}</span>
              <span>{{ order.invoicePrice }}</span>
              <span :class="order.assigned ? 'pvz-page__status pvz-page__status--ok' : 'pvz-page__status pvz-page__status--warn'">
                {{ order.status }}
              </span>
              <button type="button" :class="order.assigned ? 'pvz-page__action pvz-page__action--done' : 'pvz-page__action'">
                {{ order.action }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="pvz-page__panel pvz-page__panel--compact">
        <div class="pvz-page__panel-head">
          <h2>Что пишем в журнал</h2>
          <span>Чтобы потом не спорить, кто и что назначил.</span>
        </div>

        <ul class="pvz-page__checklist">
          <li v-for="item in journalItems" :key="item">{{ item }}</li>
        </ul>
      </section>
    </template>
  </section>
</template>

<style scoped lang="scss">
.pvz-page {
  display: grid;
  gap: 2rem;
}

.pvz-subnav {
  display: flex;
  justify-content: center;
  gap: 3rem;

  a {
    font-size: 1.6rem;
    font-weight: 500;
    color: #333;
    text-decoration: none;
  }
}

.pvz-subnav__link--active {
  color: #18b536 !important;
  font-weight: 700 !important;
}

.pvz-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32rem;
  gap: 2rem;
}

.pvz-page__panel,
.pvz-page__workspace {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 18px 40px rgba(20, 24, 26, 0.04);
}

.pvz-page__workspace--match {
  padding-top: 2.2rem;
}

.pvz-page__panel-head,
.pvz-page__workspace-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }

  p,
  span {
    margin-top: 0.4rem;
    font-size: 1.35rem;
    line-height: 1.45;
    color: #8b8b8b;
  }
}

.pvz-page__supplier-controls {
  display: grid;
  grid-template-columns: minmax(20rem, 26rem) minmax(26rem, 1fr) 22rem 22rem;
  gap: 1rem;
  align-items: end;
  margin-top: 1.8rem;

  label {
    display: grid;
    gap: 0.7rem;
  }

  span {
    font-size: 1.25rem;
    color: #8d8d8d;
  }

  select,
  input {
    width: 100%;
    height: 5rem;
    padding: 0 1.4rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    color: #444;
  }
}

.pvz-page__box-list {
  display: grid;
  gap: 1rem;
  margin-top: 1.6rem;

  article {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1rem;
    align-items: center;
    padding: 1.4rem 1.5rem;
    background: #fafafa;
    border: 1px solid #efefef;
    border-radius: 1.6rem;
  }

  strong {
    font-size: 1.45rem;
    color: #3a3a3a;
  }

  p {
    margin-top: 0.5rem;
    font-size: 1.28rem;
    color: #7f7f7f;
  }

  button {
    min-width: 11rem;
    min-height: 4.4rem;
    background: #f0f7f1;
    border: 0;
    border-radius: 1.2rem;
    font-size: 1.3rem;
    color: #18b536;
    cursor: pointer;
  }
}

.pvz-page__tool-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.6rem;
}

.pvz-page__primary,
.pvz-page__secondary {
  min-height: 5rem;
  padding: 0 1.6rem;
  border: 0;
  border-radius: 1.3rem;
  font-size: 1.4rem;
  cursor: pointer;
}

.pvz-page__primary {
  background: $linear-green;
  color: #fff;
}

.pvz-page__secondary {
  background: #f5f9f5;
  color: #18b536;
}

.pvz-page__lost-card {
  display: grid;
  gap: 1rem;
  margin-top: 1.6rem;
  padding: 1.6rem;
  background: #fff7f7;
  border-radius: 1.6rem;
  color: #c35252;

  p {
    font-size: 1.35rem;
    line-height: 1.5;
  }
}

.pvz-page__summary {
  text-align: right;

  strong {
    display: block;
    font-size: 1.75rem;
    color: #393939;
  }
}

.pvz-page__issue-layout {
  display: grid;
  grid-template-columns: 22rem minmax(0, 1fr);
  gap: 1.8rem;
  margin-top: 1.8rem;
}

.pvz-page__issue-sidebar {
  display: grid;
  align-content: start;
  gap: 1rem;
}

.pvz-page__metric {
  padding: 1.4rem;
  background: #f8f8f8;
  border-radius: 1.6rem;

  span {
    display: block;
    font-size: 1.25rem;
    color: #8e8e8e;
  }

  strong {
    display: block;
    margin-top: 0.8rem;
    font-size: 2rem;
    color: #333;
  }
}

.pvz-page__products {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.6rem;
}

.pvz-page__match-layout {
  display: grid;
  grid-template-columns: 32rem minmax(0, 1fr);
  gap: 1.8rem;
  margin-top: 1.8rem;
}

.pvz-page__match-card {
  padding: 1.8rem;
  background: #fbfbfb;
  border: 1px solid #ececec;
  border-radius: 2rem;
}

.pvz-page__match-header {
  display: grid;
  gap: 0.5rem;

  strong {
    font-size: 1.8rem;
    color: #343434;
  }

  span {
    font-size: 1.28rem;
    color: #8a8a8a;
  }
}

.pvz-page__match-body {
  display: grid;
  gap: 0.7rem;
  margin-top: 1.6rem;

  p {
    font-size: 1.38rem;
    line-height: 1.45;
    color: #525252;
  }
}

.pvz-page__match-orders {
  display: grid;
  gap: 0.8rem;
}

.pvz-page__match-table-head,
.pvz-page__match-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr 1fr 1fr 1.1fr 19rem;
  gap: 1rem;
  align-items: center;
}

.pvz-page__match-table-head {
  padding: 0 0.8rem;

  span {
    font-size: 1.22rem;
    color: #909090;
  }
}

.pvz-page__match-row {
  padding: 1.2rem 0.8rem;
  background: #fafafa;
  border-radius: 1.4rem;

  span {
    font-size: 1.32rem;
    line-height: 1.4;
    color: #4c4c4c;
  }
}

.pvz-page__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.4rem;
  padding: 0 1rem;
  border-radius: 999px;
  font-size: 1.2rem !important;
  font-weight: 600;
}

.pvz-page__status--ok {
display: none;
}

.pvz-page__status--warn {
  display: none;
}

.pvz-page__action {
  min-height: 4.2rem;
  padding: 0 1.2rem;
  background: $linear-green;
  border: 0;
  border-radius: 1.1rem;
  font-size: 1.3rem;
  color: #fff;
  cursor: pointer;
}

.pvz-page__action--done {
  background: #dff5e1;
  color: #18b536;
}

.pvz-page__checklist {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.2rem;
  padding-left: 1.8rem;

  li {
    font-size: 1.35rem;
    line-height: 1.45;
    color: #616161;
  }
}

@media (max-width: 1480px) {
  .pvz-page__grid,
  .pvz-page__supplier-controls,
  .pvz-page__issue-layout,
  .pvz-page__products,
  .pvz-page__match-layout,
  .pvz-page__match-table-head,
  .pvz-page__match-row {
    grid-template-columns: 1fr;
  }
}
</style>
