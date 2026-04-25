<script setup lang="ts">
import MarkupTierEditor from '~/components/admin/markupTierEditor/ui/MarkupTierEditor.vue'
import SettingsFeatureCard from '~/components/admin/settingsFeatureCard/ui/SettingsFeatureCard.vue'
definePageMeta({
  layout: 'admin',
})

type SettingsView = 'overview' | 'price' | 'stock' | 'suppliers' | 'supplier'

type MarkupRange = {
  id: string
  from: number
  to: number | null
  markup: number | null
}

type SupplierRow = {
  id: string
  name: string
  region: string
  updated: string
  logo?: string
  badge?: string
}

const route = useRoute()

const isView = (value: unknown): value is SettingsView =>
  typeof value === 'string' && ['overview', 'price', 'stock', 'suppliers', 'supplier'].includes(value)

const currentView = computed<SettingsView>(() => {
  const view = route.query.view
  return isView(view) ? view : 'overview'
})

const settingsCards = [
  {
    title: 'Наценка по ценам',
    description: 'Основные градации стоимости товара с общей логикой по каталогу.',
    icon: '/icons/admin/onPriceIcon.svg',
    view: 'price',
  },
  {
    title: 'Наценка по наличию',
    description: 'Сценарии для остатков, предзаказа и индивидуальной корректировки.',
    icon: '/icons/admin/onStockIcon.svg',
    view: 'stock',
  },
  {
    title: 'Наценка у поставщиков',
    description: 'Базовая и ценовая наценка под конкретного поставщика.',
    icon: '/icons/admin/onSuppliersPrice.svg',
    view: 'suppliers',
  },
] as const

const priceRanges = ref<MarkupRange[]>([
  { id: 'price-1', from: 0, to: 500, markup: 50 },
  { id: 'price-2', from: 500, to: 5000, markup: 32 },
])

const priceBaseMarkup = ref(12)
const stockBaseMarkup = ref(0)
const lowStockMarkup = ref(6)

const suppliers = [
  {
    id: 'avtoto',
    name: 'AVTOTO',
    region: 'Россия / Центральный округ',
    updated: 'Сегодня, 14:20',
    logo: '/suppliers/avtotoLogo.png',
  },
  {
    id: 'nord-parts',
    name: 'Nord Parts',
    region: 'Санкт-Петербург',
    updated: 'Вчера, 18:05',
    badge: 'NP',
  },
  {
    id: 'east-auto',
    name: 'East Auto',
    region: 'Ростов-на-Дону',
    updated: '2 дня назад',
    badge: 'EA',
  },
] satisfies SupplierRow[]

const supplierConfigs = reactive<Record<string, {
  baseMarkup: number
  stockMarkup: number
  tiers: MarkupRange[]
}>>({
  avtoto: {
    baseMarkup: 10,
    stockMarkup: 4,
    tiers: [
      { id: 'avtoto-1', from: 0, to: 3000, markup: 18 },
      { id: 'avtoto-2', from: 3000, to: 12000, markup: 12 },
    ],
  },
  'nord-parts': {
    baseMarkup: 9,
    stockMarkup: 5,
    tiers: [
      { id: 'nord-1', from: 0, to: 4000, markup: 17 },
      { id: 'nord-2', from: 4000, to: 15000, markup: 11 },
    ],
  },
  'east-auto': {
    baseMarkup: 8,
    stockMarkup: 6,
    tiers: [
      { id: 'east-1', from: 0, to: 5000, markup: 16 },
      { id: 'east-2', from: 5000, to: 18000, markup: 10 },
    ],
  },
})

const activeSupplierId = computed(() => {
  const supplier = route.query.supplier

  if (typeof supplier === 'string' && suppliers.some((item) => item.id === supplier)) {
    return supplier
  }

  return suppliers[0].id
})

const activeSupplier = computed(() => suppliers.find((item) => item.id === activeSupplierId.value) ?? suppliers[0])

const supplierTableRows = computed(() =>
  suppliers.map((supplier) => ({
    ...supplier,
    baseMarkup: supplierConfigs[supplier.id].baseMarkup,
    stockMarkup: supplierConfigs[supplier.id].stockMarkup,
    tiers: supplierConfigs[supplier.id].tiers.filter((item) => item.to !== null && item.markup !== null).length,
  })),
)

const backToOverview = { path: '/admin/settings' }
</script>

<template>
  <section class="settings-page">
    <template v-if="currentView === 'overview'">
      <div class="settings-page__heading">
        <h1>Настройки</h1>
        <p>Собрали все сценарии наценки в одном месте, чтобы админка оставалась быстрой и предсказуемой.</p>
      </div>

      <div class="settings-page__cards-grid">
        <SettingsFeatureCard
          v-for="card in settingsCards"
          :key="card.title"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
          :to="{ path: '/admin/settings', query: { view: card.view } }"
        />
      </div>
    </template>

    <template v-else-if="currentView === 'price'">
      <div class="settings-page__heading settings-page__heading--tight">
        <NuxtLink class="settings-page__back" :to="backToOverview">← К настройкам</NuxtLink>
        <h1>Наценка по стоимости товара</h1>
        <p>Градации работают последовательно: как только последняя строка заполнена, следующая создаётся автоматически.</p>
      </div>

      <div class="settings-page__workspace">
        <MarkupTierEditor
          v-model="priceRanges"
          title="Градации по цене"
          subtitle="Используем диапазоны стоимости для автоматического расчёта наценки в каталоге."
          helper="Если последняя градация заполнена полностью, система автоматически подготовит следующую строку от конечной цены."
        />

        <aside class="settings-page__sidebar">
          <section class="settings-page__panel settings-page__panel--accent">
            <div class="settings-page__panel-head">
              <h2>Базовая наценка</h2>
              <span>По умолчанию</span>
            </div>

            <div class="settings-page__base-markup">
              <strong>{{ priceBaseMarkup }}%</strong>
              <input v-model="priceBaseMarkup" type="range" min="0" max="50">
              <label>
                <span>Если товар не попадает в градацию</span>
                <input v-model="priceBaseMarkup" type="number" min="0" max="50">
              </label>
            </div>
          </section>

          <section class="settings-page__panel">
            <div class="settings-page__panel-head">
              <h2>Наценка по наличию</h2>
              <NuxtLink class="settings-page__text-link" :to="{ path: '/admin/settings', query: { view: 'stock' } }">Открыть раздел</NuxtLink>
            </div>

            <div class="settings-page__scenario-list">
              <div>
                <span>Есть в наличии</span>
                <strong>{{ stockBaseMarkup }}%</strong>
              </div>
              <div>
                <span>Мало остатков</span>
                <strong>+{{ lowStockMarkup }}%</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </template>

    <template v-else-if="currentView === 'stock'">
      <div class="settings-page__heading settings-page__heading--tight">
        <NuxtLink class="settings-page__back" :to="backToOverview">← К настройкам</NuxtLink>
        <h1>Наценка по наличию</h1>
        <p>Раздел подготовлен как отдельная точка входа: общие правила и индивидуальные сценарии поставщиков не смешиваются.</p>
      </div>

      <div class="settings-page__cards-grid settings-page__cards-grid--compact">
        <SettingsFeatureCard
          title="Наценка по ценам"
          description="Общая ценовая матрица по каталогу."
          icon="/icons/admin/onPriceIcon.svg"
          :to="{ path: '/admin/settings', query: { view: 'price' } }"
        />

        <SettingsFeatureCard
          title="Индивидуальная наценка"
          description="Настройка правил по поставщикам и отдельным поставкам."
          icon="/icons/admin/onSuppliersPrice.svg"
          :to="{ path: '/admin/settings', query: { view: 'suppliers' } }"
        />
      </div>

      <section class="settings-page__panel settings-page__panel--wide">
        <div class="settings-page__panel-head">
          <h2>Базовые сценарии по наличию</h2>
          <span>Пока обозначаем структуру</span>
        </div>

        <div class="settings-page__stock-grid">
          <label class="settings-page__stock-card">
            <span>Есть в наличии</span>
            <input v-model="stockBaseMarkup" type="number" min="0" max="50">
            <em>Стартовая корректировка</em>
          </label>

          <label class="settings-page__stock-card">
            <span>Мало остатков</span>
            <input v-model="lowStockMarkup" type="number" min="0" max="50">
            <em>Когда товар заканчивается</em>
          </label>
        </div>
      </section>
    </template>

    <template v-else-if="currentView === 'suppliers'">
      <div class="settings-page__heading settings-page__heading--tight">
        <NuxtLink class="settings-page__back" :to="backToOverview">← К настройкам</NuxtLink>
        <h1>Наценка у поставщиков</h1>
        <p>У каждого поставщика может быть своя базовая логика, своя наценка по наличию и своя матрица по стоимости товара.</p>
      </div>

      <div class="settings-page__suppliers-top">
        <section class="settings-page__panel settings-page__panel--wide">
          <div class="settings-page__panel-head">
            <h2>Поставщики</h2>
            <span>Кастомная таблица</span>
          </div>

          <div class="settings-page__suppliers-table">
            <div class="settings-page__suppliers-head">
              <span>Поставщик</span>
              <span>Регион</span>
              <span>Базовая наценка</span>
              <span>По наличию</span>
              <span>Градаций</span>
              <span>Обновлено</span>
              <span />
            </div>

            <div class="settings-page__suppliers-body">
              <div v-for="supplier in supplierTableRows" :key="supplier.id" class="settings-page__supplier-row">
                <div class="settings-page__supplier-main">
                  <div v-if="supplier.logo" class="settings-page__supplier-logo">
                    <NuxtImg :src="supplier.logo" :alt="supplier.name" />
                  </div>
                  <div v-else class="settings-page__supplier-badge">{{ supplier.badge }}</div>
                  <div>
                    <strong>{{ supplier.name }}</strong>
                    <span>Индивидуальная матрица наценки</span>
                  </div>
                </div>

                <span>{{ supplier.region }}</span>
                <span>{{ supplier.baseMarkup }}%</span>
                <span>+{{ supplier.stockMarkup }}%</span>
                <span>{{ supplier.tiers }}</span>
                <span>{{ supplier.updated }}</span>
                <NuxtLink class="settings-page__open-link" :to="{ path: '/admin/settings', query: { view: 'supplier', supplier: supplier.id } }">
                  Настроить
                </NuxtLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>

    <template v-else>
      <div class="settings-page__heading settings-page__heading--tight">
        <NuxtLink class="settings-page__back" :to="{ path: '/admin/settings', query: { view: 'suppliers' } }">← К поставщикам</NuxtLink>
        <h1>Наценка у поставщика</h1>
        <p>Подкрутили интерфейс чуть практичнее референса: сверху короткая сводка по поставщику, справа базовые правила, слева рабочая матрица.</p>
      </div>

      <section class="settings-page__supplier-hero">
        <div class="settings-page__supplier-hero-main">
          <div v-if="activeSupplier.logo" class="settings-page__supplier-logo settings-page__supplier-logo--hero">
            <NuxtImg :src="activeSupplier.logo" :alt="activeSupplier.name" />
          </div>
          <div v-else class="settings-page__supplier-badge settings-page__supplier-badge--hero">{{ activeSupplier.badge }}</div>

          <div>
            <h2>{{ activeSupplier.name }}</h2>
            <p>{{ activeSupplier.region }}</p>
          </div>
        </div>

        <div class="settings-page__supplier-meta">
          <div>
            <span>Обновлено</span>
            <strong>{{ activeSupplier.updated }}</strong>
          </div>
          <div>
            <span>Активных градаций</span>
            <strong>{{ supplierConfigs[activeSupplier.id].tiers.filter((item) => item.to !== null && item.markup !== null).length }}</strong>
          </div>
        </div>
      </section>

      <div class="settings-page__workspace">
        <MarkupTierEditor
          v-model="supplierConfigs[activeSupplier.id].tiers"
          :title="`Градации для ${activeSupplier.name}`"
          subtitle="После выбора поставщика открываем отдельную матрицу по стоимости товара."
          helper="Базовая наценка справа сработает, если товар не попадает в диапазоны или для конкретного сценария нужен общий fallback."
        />

        <aside class="settings-page__sidebar">
          <section class="settings-page__panel settings-page__panel--accent">
            <div class="settings-page__panel-head">
              <h2>Базовая наценка</h2>
              <span>Fallback</span>
            </div>

            <div class="settings-page__base-markup">
              <strong>{{ supplierConfigs[activeSupplier.id].baseMarkup }}%</strong>
              <input v-model="supplierConfigs[activeSupplier.id].baseMarkup" type="range" min="0" max="50">
              <label>
                <span>Если диапазон не подходит</span>
                <input v-model="supplierConfigs[activeSupplier.id].baseMarkup" type="number" min="0" max="50">
              </label>
            </div>
          </section>

          <section class="settings-page__panel">
            <div class="settings-page__panel-head">
              <h2>Наценка по наличию</h2>
              <span>Для поставщика</span>
            </div>

            <div class="settings-page__scenario-list">
              <div>
                <span>Есть в наличии</span>
                <strong>0%</strong>
              </div>
              <div>
                <span>Мало остатков</span>
                <strong>+{{ supplierConfigs[activeSupplier.id].stockMarkup }}%</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.settings-page__heading {
  margin-bottom: 2rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #434343;
  }

  p {
    margin-top: 0.6rem;
    max-width: 78rem;
    font-size: 1.55rem;
    line-height: 1.45;
    color: #6a6a6a;
  }
}

.settings-page__heading--tight {
  margin-bottom: 1.6rem;
}

.settings-page__back {
  display: inline-flex;
  margin-bottom: 0.8rem;
  font-size: 1.35rem;
  color: #909090;
}

.settings-page__cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 23rem));
  gap: 1.6rem;
}

.settings-page__cards-grid--compact {
  grid-template-columns: repeat(2, minmax(0, 26rem));
}

.settings-page__workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(28rem, 33rem);
  gap: 1.6rem;
  align-items: start;
}

.settings-page__sidebar {
  display: grid;
  gap: 1.6rem;
}

.settings-page__panel,
.settings-page__supplier-hero {
  padding: 1.8rem;
  background: #fff;
  border-radius: 2rem;
  box-shadow: 0 16px 34px rgba(23, 27, 29, 0.04);
}

.settings-page__panel--wide {
  padding: 2rem;
}

.settings-page__panel--accent {
  border: 1px solid rgba(24, 181, 54, 0.12);
}

.settings-page__panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.4rem;

  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #444;
  }

  span {
    font-size: 1.25rem;
    color: #9a9a9a;
  }
}

.settings-page__base-markup {
  strong {
    display: block;
    margin-bottom: 1rem;
    font-size: 3rem;
    color: #424242;
  }

  input[type='range'] {
    width: 100%;
    accent-color: #18b536;
  }

  label {
    display: grid;
    gap: 0.6rem;
    margin-top: 1.2rem;
  }

  span {
    font-size: 1.3rem;
    color: #8d8d8d;
  }

  input[type='number'] {
    width: 100%;
    height: 4.8rem;
    padding: 0 1.4rem;
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 1.2rem;
    font-size: 1.45rem;
    color: #4a4a4a;
  }
}

.settings-page__scenario-list {
  display: grid;
  gap: 1rem;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.2rem 1.3rem;
    background: #fafafa;
    border-radius: 1.2rem;
  }

  span {
    font-size: 1.35rem;
    color: #666;
  }

  strong {
    font-size: 1.45rem;
    color: #424242;
  }
}

.settings-page__stock-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
}

.settings-page__stock-card {
  display: grid;
  gap: 0.8rem;
  padding: 1.5rem;
  background: #fafafa;
  border: 1px solid #efefef;
  border-radius: 1.4rem;

  span {
    font-size: 1.45rem;
    color: #444;
  }

  input {
    width: 100%;
    height: 4.6rem;
    padding: 0 1.4rem;
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 1.2rem;
    font-size: 1.45rem;
    color: #4a4a4a;
  }

  em {
    font-size: 1.22rem;
    color: #989898;
    font-style: normal;
  }
}

.settings-page__suppliers-table {
  border: 1px solid #f0f0f0;
  border-radius: 1.6rem;
  overflow: hidden;
}

.settings-page__suppliers-head,
.settings-page__supplier-row {
  display: grid;
  grid-template-columns: 2fr 1.4fr 1fr 1fr 0.8fr 1fr 12rem;
  align-items: center;
  gap: 1rem;
}

.settings-page__suppliers-head {
  padding: 1.2rem 1.5rem;
  background: #fbfbfb;
  font-size: 1.28rem;
  color: #a1a1a1;
}

.settings-page__suppliers-body {
  display: grid;
}

.settings-page__supplier-row {
  padding: 1.3rem 1.5rem;
  border-top: 1px solid #f2f2f2;
  font-size: 1.42rem;
  color: #505050;
}

.settings-page__supplier-main {
  display: flex;
  align-items: center;
  gap: 1.2rem;

  strong {
    display: block;
    font-size: 1.48rem;
    font-weight: 600;
    color: #474747;
  }

  span {
    display: block;
    margin-top: 0.4rem;
    font-size: 1.24rem;
    color: #999;
  }
}

.settings-page__supplier-logo,
.settings-page__supplier-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: 1.2rem;
  background: #fff;
  border: 1px solid #efefef;
}

.settings-page__supplier-logo img {
  max-width: 3.5rem;
  max-height: 3.5rem;
  object-fit: contain;
}

.settings-page__supplier-badge {
  font-size: 1.35rem;
  font-weight: 700;
  color: #5b5b5b;
  background: linear-gradient(135deg, #f7f7f7 0%, #fcfcfc 100%);
}

.settings-page__supplier-logo--hero,
.settings-page__supplier-badge--hero {
  width: 6rem;
  height: 6rem;
  border-radius: 1.4rem;
}

.settings-page__open-link,
.settings-page__text-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 4rem;
  padding: 0 1.4rem;
  border-radius: 1rem;
  font-size: 1.35rem;
}

.settings-page__open-link {
  background: $linear-green;
  color: #fff;
}

.settings-page__text-link {
  color: $green;
}

.settings-page__supplier-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.6rem;
}

.settings-page__supplier-hero-main {
  display: flex;
  align-items: center;
  gap: 1.4rem;

  h2 {
    font-size: 2.2rem;
    font-weight: 700;
    color: #444;
  }

  p {
    margin-top: 0.4rem;
    font-size: 1.45rem;
    color: #8d8d8d;
  }
}

.settings-page__supplier-meta {
  display: flex;
  gap: 2.4rem;

  div {
    display: grid;
    gap: 0.5rem;
  }

  span {
    font-size: 1.25rem;
    color: #9b9b9b;
  }

  strong {
    font-size: 1.6rem;
    color: #474747;
  }
}

@media (max-width: 1520px) {
  .settings-page__suppliers-table,
  .settings-page__panel--wide {
    overflow-x: auto;
  }

  .settings-page__suppliers-head,
  .settings-page__supplier-row {
    min-width: 112rem;
  }
}

@media (max-width: 1260px) {
  .settings-page__workspace,
  .settings-page__stock-grid {
    grid-template-columns: 1fr;
  }

  .settings-page__cards-grid,
  .settings-page__cards-grid--compact {
    grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
  }

  .settings-page__supplier-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .settings-page__supplier-meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>

