<script setup lang="ts">
import PvzProductCard from '~/components/pvz/PvzProductCard.vue'

definePageMeta({
  layout: 'pvz',
  pvzSidebar: [
    { label: 'Сканирование товара', to: '/pvz/shipment', icon: 'qr' },
  ],
})

const api = useAPI()
const boxResult = ref<any>(null)
const creatingBox = ref(false)

async function createBox() {
  if (!scannedItems.value.length) return
  creatingBox.value = true
  boxResult.value = null
  const authStore = useAuthStore()
  const sourceId = authStore.user?.managed_pvz || 1
  const destId = Number(selectedDestination.value) || 1
  try {
    const data: any = await api('/api/warehouse/box/create', {
      method: 'POST',
      body: {
        source_id: sourceId,
        dest_id: destId,
        item_ids: scannedItems.value.map((_, i) => i + 1),
      },
    })
    boxResult.value = data
    scannedItems.value = []
  } catch { alert('Ошибка создания коробки') }
  finally { creatingBox.value = false }
}

const router = useRouter()
const route = useRoute()

type MovementMode = 'pvz' | 'warehouse' | 'cell'

const scannedCatalog = {
  '3213513633-0445': {
    cell: '111',
    code: '3213513633 0445',
    title: 'Аккумулятор HomeBoy / GS353234',
    subtitle: 'Пользователь: Иван Петров · текущая ячейка 111',
    owner: 'Иван Петров',
  },
  '3213513633-0446': {
    cell: '112',
    code: '3213513633 0446',
    title: 'Аккумулятор HomeBoy / GS353235',
    subtitle: 'Пользователь: Иван Петров · текущая ячейка 112',
    owner: 'Иван Петров',
  },
  '4213513633-0121': {
    cell: '208',
    code: '4213513633 0121',
    title: 'Фильтр масляный / OF9021',
    subtitle: 'Пользователь: Сергей Волков · текущая ячейка 208',
    owner: 'Сергей Волков',
  },
} as const

type ScannedItem = (typeof scannedCatalog)[keyof typeof scannedCatalog]

const movementMode = computed<MovementMode>({
  get() {
    const mode = route.query.mode

    if (mode === 'warehouse' || mode === 'cell') {
      return mode
    }

    return 'pvz'
  },
  set(value) {
    router.replace({
      query: {
        ...route.query,
        mode: value === 'pvz' ? undefined : value,
      },
    })
  },
})

const scanValue = ref('')
const scannedItems = ref<ScannedItem[]>([])

type DestItem = { value: string; label: string }

const pvzDestinations = ref<DestItem[]>([])
const warehouseDestinations = ref<DestItem[]>([])

async function loadDestinations() {
  try {
    const data: any = await api('/api/warehouse/pickup-points')
    const points = Array.isArray(data) ? data : (data?.results || [])
    pvzDestinations.value = points.filter((p: any) => p.type !== 'склад').map((p: any) => ({ value: String(p.id), label: p.name || `ПВЗ №${p.id}` }))
    warehouseDestinations.value = points.filter((p: any) => p.type === 'склад').map((p: any) => ({ value: String(p.id), label: p.name || `Склад #${p.id}` }))
  } catch {}
}

onMounted(loadDestinations)

const destinations = computed(() => ({
  pvz: pvzDestinations.value.length ? pvzDestinations.value : [{ value: '5', label: 'ПВЗ Алчевск' }],
  warehouse: warehouseDestinations.value.length ? warehouseDestinations.value : [{ value: '1', label: 'Ростов (склад)' }],
  cell: [
    { value: '113', label: 'СПЯ 113' },
    { value: '114', label: 'СПЯ 114' },
    { value: '115', label: 'СПЯ 115' },
  ],
}))

const selectedDestination = ref('5')

watch(
  movementMode,
  (value) => {
    selectedDestination.value = destinations[value][0].value
  },
  { immediate: true },
)

const destinationLabel = computed(() => {
  if (movementMode.value === 'warehouse') {
    return 'Куда отправляем'
  }

  if (movementMode.value === 'cell') {
    return 'Новая ячейка'
  }

  return 'Целевой ПВЗ'
})

const destinationOptions = computed(() => destinations[movementMode.value])

const currentOwners = computed(() => [...new Set(scannedItems.value.map((item) => item.owner))])
const hasMixedOwners = computed(() => currentOwners.value.length > 1)

const addScannedItem = () => {
  const key = scanValue.value.trim().replace(/\s+/g, '')

  if (!key) {
    return
  }

  const matchedItem = Object.entries(scannedCatalog).find(([catalogKey]) => catalogKey.replace(/\s+/g, '') === key)

  if (!matchedItem) {
    scanValue.value = ''
    return
  }

  const item = matchedItem[1]

  if (!scannedItems.value.some((entry) => entry.code === item.code)) {
    scannedItems.value = [...scannedItems.value, item]
  }

  scanValue.value = ''
}
</script>

<template>
  <section class="pvz-page">
    <div class="pvz-page__heading">
      <h1>Перемещение товара</h1>
    </div>

    <div class="pvz-page__grid">
      <section class="pvz-page__workspace">
        <div class="pvz-page__workspace-head">
          <div>
            <h2>Сканирование и сборка перемещения</h2>
            <p>После сканирования товар появляется в списке</p>
          </div>
        </div>

        <div class="pvz-page__controls">
          <label class="pvz-page__scan">
            <span>Скан товара</span>
            <input
              v-model="scanValue"
              type="text"
              placeholder="Например, 3213513633-0445"
              @keydown.enter.prevent="addScannedItem"
            >
          </label>

          <button type="button" class="pvz-page__primary" @click="addScannedItem">
            Добавить
          </button>

          <label class="pvz-page__select">
            <span>Тип перемещения</span>
            <select v-model="movementMode">
              <option value="pvz">Отправка на ПВЗ</option>
              <option value="warehouse">Отправка на склад</option>
              <option value="cell">Смена ячейки</option>
            </select>
          </label>

          <label class="pvz-page__select">
            <span>{{ destinationLabel }}</span>
            <select v-model="selectedDestination">
              <option v-for="option in destinationOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>

        <div v-if="!scannedItems.length" class="pvz-page__empty">
          <h3>Пока ничего не отсканировано</h3>
          <p>После сканирования товар появится здесь и сразу войдёт в собираемое перемещение.</p>
        </div>

        <template v-else>
          <div v-if="movementMode === 'cell' && hasMixedOwners" class="pvz-page__warning">
            В одну ячейку нельзя переложить товары разных пользователей. Сейчас в списке: {{ currentOwners.join(', ') }}.
          </div>

          <div class="pvz-page__shipment-layout">
            <aside class="pvz-page__shipment-sidebar">
              <div class="pvz-page__metric">
                <span>Товаров в перемещении</span>
                <strong>{{ scannedItems.length }}</strong>
              </div>
              <div class="pvz-page__metric">
                <span>Пользователей</span>
                <strong>{{ currentOwners.length }}</strong>
              </div>
              <div class="pvz-page__metric">
                <span>Режим</span>
                <strong v-if="movementMode === 'pvz'">На ПВЗ</strong>
                <strong v-else-if="movementMode === 'warehouse'">На склад</strong>
                <strong v-else>Смена ячейки</strong>
              </div>
            </aside>

            <div class="pvz-page__products">
              <PvzProductCard
                v-for="item in scannedItems"
                :key="item.code"
                :cell="item.cell"
                :code="item.code"
                :title="item.title"
                :subtitle="item.subtitle"
              />
            </div>
          </div>
        </template>
      </section>

      <aside class="pvz-page__panel">
        <div class="pvz-page__panel-head">
          <h2>Финальный шаг</h2>
          <span>В зависимости от режима</span>
        </div>

        <div class="pvz-page__primary-row">
          <button type="button" class="pvz-page__primary" :disabled="creatingBox" @click="createBox">
            {{ creatingBox ? 'Создание...' : 'Создать коробку' }}
          </button>
        </div>

        <div v-if="boxResult" class="pvz-page__panel" style="margin-top:1.2rem;">
          <div class="pvz-page__panel-head">
            <h2>Коробка создана</h2>
            <span>{{ boxResult.status }}</span>
          </div>
          <div class="pvz-page__match-body" style="margin-top:0.8rem;">
            <p><b>QR-код:</b> {{ boxResult.qr_code }}</p>
            <p><b>Товаров:</b> {{ boxResult.items_count }}</p>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pvz-page {
  display: grid;
  gap: 2rem;
}

.pvz-page__heading {
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

.pvz-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 28rem;
  gap: 2rem;
}

.pvz-page__workspace,
.pvz-page__panel {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
}

.pvz-page__workspace-head,
.pvz-page__panel-head {
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

.pvz-page__controls {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 21rem minmax(24rem, 0.9fr) minmax(24rem, 1fr);
  gap: 1rem;
  align-items: end;
  margin-top: 1.8rem;
}

.pvz-page__scan,
.pvz-page__select {
  display: grid;
  gap: 0.7rem;

  span {
    font-size: 1.25rem;
    color: #8d8d8d;
  }

  input,
  select {
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

.pvz-page__empty {
  display: grid;
  place-items: center;
  min-height: 26rem;
  margin-top: 1.8rem;
  background: #fbfbfb;
  border-radius: 2rem;
  text-align: center;

  h3 {
    font-size: 1.9rem;
    color: #3c3c3c;
  }

  p {
    margin-top: 0.8rem;
    max-width: 40rem;
    font-size: 1.35rem;
    line-height: 1.5;
    color: #8a8a8a;
  }
}

.pvz-page__warning {
  margin-top: 1.6rem;
  padding: 1.3rem 1.5rem;
  background: #fff5f5;
  border-radius: 1.4rem;
  font-size: 1.32rem;
  line-height: 1.45;
  color: #c35555;
}

.pvz-page__shipment-layout {
  display: grid;
  grid-template-columns: 22rem minmax(0, 1fr);
  gap: 1.8rem;
  margin-top: 1.8rem;
}

.pvz-page__shipment-sidebar {
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.pvz-page__action-stack {
  display: grid;
  gap: 1rem;
  margin-top: 1.6rem;
}

.pvz-page__primary,
.pvz-page__secondary {
  min-height: 5rem;
  border: 0;
  border-radius: 1.3rem;
  font-size: 1.45rem;
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

.pvz-page__primary:disabled {
  background: #d7e8db;
  cursor: not-allowed;
}

.pvz-page__hint {
  margin-top: 0.4rem;
  padding: 1.2rem 1.3rem;
  background: #fafafa;
  border-radius: 1.2rem;

  p {
    font-size: 1.28rem;
    line-height: 1.45;
    color: #717171;
  }
}

@media (max-width: 1480px) {
  .pvz-page__controls,
  .pvz-page__grid,
  .pvz-page__shipment-layout,
  .pvz-page__products {
    grid-template-columns: 1fr;
  }
}
</style>
