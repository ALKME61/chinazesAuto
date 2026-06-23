<script setup lang="ts">
import Icon from '~/components/shared/ui/Icons/Icon.vue'
import PvzProductCard from '~/components/pvz/PvzProductCard.vue'
import PvzScanHero from '~/components/pvz/PvzScanHero.vue'

definePageMeta({
  layout: 'pvz',
  pvzSidebar: [
    { label: 'Неразобранные', to: '/pvz/acceptance', icon: 'box' },
    { label: 'От поставщика', to: '/pvz/acceptance?mode=supplier', icon: 'truck' },
  ],
})

const api = useAPI()
const route = useRoute()
const router = useRouter()

const mode = computed(() => {
  if (route.query.mode === 'supplier') return 'supplier'
  return 'inbox'
})
const suppliers = [
  { value: 'favorit', label: 'Favorit' },
  { value: 'profitliga', label: 'ProfitLiga' },
  { value: 'tiss', label: 'TISS' },
] as const

const selectedSupplier = ref('favorit')

const barcode = ref('')
const scanResult = ref<any>(null)
const scanLoading = ref(false)
const pendingItems = ref<any[]>([])
const batchLoading = ref(false)
const batchResult = ref<any>(null)

async function scanBarcode() {
  if (!barcode.value.trim()) return
  scanLoading.value = true
  scanResult.value = null
  try {
    const data: any = await api('/api/warehouse/receive/scan', {
      method: 'POST',
      body: {
        barcode: barcode.value.trim(),
        pvz_id: 1,
        supplier: selectedSupplier.value,
      },
    })
    scanResult.value = data
    barcode.value = ''
  } catch { alert('Ошибка сканирования') }
  finally { scanLoading.value = false }
}

function addToPending(orderItemId: number) {
  if (!scanResult.value?.matches) return
  const match = scanResult.value.matches.find((m: any) => m.order_item_id === orderItemId)
  if (!match) return
  if (pendingItems.value.some((p: any) => p.order_item_id === orderItemId)) return
  pendingItems.value.push(match)
  scanResult.value = null
}

function removeFromPending(orderItemId: number) {
  pendingItems.value = pendingItems.value.filter((p: any) => p.order_item_id !== orderItemId)
}

async function submitBatch() {
  if (!pendingItems.value.length) return
  batchLoading.value = true
  batchResult.value = null
  try {
    const data: any = await api('/api/warehouse/receive/batch', {
      method: 'POST',
      body: {
        pvz_id: 1,
        supplier: selectedSupplier.value,
        items: pendingItems.value.map((p: any) => ({ order_item_id: p.order_item_id })),
      },
    })
    batchResult.value = data
    pendingItems.value = []
  } catch { alert('Ошибка подтверждения приёмки') }
  finally { batchLoading.value = false }
}

const boxScanQr = ref('')
const boxScanResult = ref<any>(null)
const boxScanning = ref(false)

let scanBuffer = ''
let scanLastTime = 0
let scanTimer: ReturnType<typeof setTimeout> | null = null
const SCAN_GAP_MS = 300

function onGlobalKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (scanBuffer.startsWith('*-')) {
      e.preventDefault()
      const val = scanBuffer.slice(2).trim()
      if (startedBox.value) {
        receiveScanValue.value = val
        addReceiveScan()
      } else {
        startReceiveQr.value = val
        startReceive()
      }
    }
    scanBuffer = ''
    return
  }
  if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return
  const now = Date.now()
  if (scanLastTime && now - scanLastTime > SCAN_GAP_MS) scanBuffer = ''
  scanLastTime = now
  scanBuffer += e.key
  if (!scanBuffer.startsWith('*-') && scanBuffer.length > 1) { scanBuffer = ''; scanLastTime = 0; return }
  if (scanTimer) clearTimeout(scanTimer)
  scanTimer = setTimeout(() => {
    if (scanBuffer.startsWith('*-')) {
      const val = scanBuffer.slice(2).trim()
      if (startedBox.value) {
        receiveScanValue.value = val
        addReceiveScan()
      } else {
        startReceiveQr.value = val
        startReceive()
      }
    }
    scanBuffer = ''; scanLastTime = 0; scanTimer = null
  }, SCAN_GAP_MS)
}

onMounted(() => document.addEventListener('keydown', onGlobalKeyDown))
onUnmounted(() => {
  document.removeEventListener('keydown', onGlobalKeyDown)
  if (scanTimer) clearTimeout(scanTimer)
})

async function scanBox() {
  if (!boxScanQr.value.trim()) return
  boxScanning.value = true
  boxScanResult.value = null
  try {
    const data: any = await api('/api/warehouse/box/scan', {
      method: 'POST',
      body: {
        qr_code: boxScanQr.value.trim(),
        action: 'deliver',
      },
    })
    boxScanResult.value = {
      qr_code: data.qr_code || data.box || '',
      status: data.status || '',
      items: (data.items || []).map((i: any) => ({
        ...i,
        order_item_id: i.order_item_id || i.order_id,
      })),
    }
    boxScanQr.value = ''
  } catch {
    alert('Ошибка сканирования коробки')
  } finally {
    boxScanning.value = false
  }
}

const startReceiveQr = ref('')
const startedBox = ref<any>(null)
const startReceiving = ref(false)
const receiveScanValue = ref('')

async function startReceive() {
  if (!startReceiveQr.value.trim()) return
  startReceiving.value = true
  startedBox.value = null
  try {
    const data: any = await api('/api/warehouse/box/start-receive', {
      method: 'POST',
      body: { qr_code: startReceiveQr.value.trim() },
    })
    startedBox.value = data
    receivedItemIds.clear()
    startReceiveQr.value = ''
  } catch {
    alert('Ошибка открытия коробки')
  } finally {
    startReceiving.value = false
  }
}

const receivedItemIds = reactive(new Set<number>())
const receivingItem = ref<number | null>(null)
const lastReceivedItem = ref<any>(null)

async function receiveItem(orderItemId: number) {
  if (!startedBox.value?.qr_code) return
  receivingItem.value = orderItemId
  lastReceivedItem.value = null
  try {
    const data: any = await api('/api/warehouse/box/receive-item', {
      method: 'POST',
      body: {
        qr_code: startedBox.value.qr_code,
        order_item_id: orderItemId,
      },
    })
    lastReceivedItem.value = data
    receivedItemIds.add(orderItemId)
    const isDelivered = data.box_status === 'delivered' || data.status === 'delivered'
    if (isDelivered) {
      startedBox.value = null
    }
  } catch {
    alert('Ошибка приёмки товара')
  } finally {
    receivingItem.value = null
  }
}

const remainingItems = computed(() => {
  if (!startedBox.value?.items) return 0
  return startedBox.value.items.filter((i: any) => !receivedItemIds.has(i.order_item_id)).length
})

function addReceiveScan() {
  const val = receiveScanValue.value.trim()
  if (!val || !startedBox.value) return
  const id = Number(val)
  if (!id) return
  const item = startedBox.value.items.find((i: any) => i.order_item_id === id)
  if (!item) { alert('Товар не найден в коробке'); return }
  receiveScanValue.value = ''
  receiveItem(item.order_item_id)
}

function getItemImage(imagePath: string | null | undefined): string {
  if (!imagePath) return '/productExample.png'
  const fullUrl = `http://212.41.28.206/${imagePath.replace(/^\//, '')}`
  return `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`
}

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
        </section>

        <section class="pvz-page__panel">
          <div class="pvz-page__panel-head">
            <h2>Товар потерялся</h2>
          </div>

          <div class="pvz-page__lost-card">
            <Icon name="warningIcon" :size="24" />
            <p>Если товар не найден в коробке или потерялся после сканирования, оператор оставляет запись в журнале и отмечает статус для дальнейшего разбора.</p>
          </div>
        </section>
      </div>

      <div class="pvz-page__box-receive">
        <div v-if="!startedBox" class="pvz-page__panel-head" style="margin-bottom:1.2rem;">
          <h2>Приёмка коробки</h2>
          <span>Отсканируйте QR-код коробки, чтобы начать</span>
        </div>

        <div v-if="!startedBox" class="pvz-page__box-scan-controls">
          <label>
            <span>QR-код коробки</span>
            <input v-model="startReceiveQr" type="text" placeholder="CHZ-BOX-...">
          </label>
          <button type="button" class="pvz-page__primary" :disabled="startReceiving" @click="startReceive">
            {{ startReceiving ? 'Открытие...' : 'Открыть коробку' }}
          </button>
        </div>

        <div v-if="startedBox" class="pvz-page__box-receive-content">
          <div class="pvz-page__box-receive-header">
            <p><b>Коробка:</b> {{ startedBox.qr_code }} · <b>Статус:</b> {{ startedBox.status }}</p>
            <p>{{ startedBox.source }} → {{ startedBox.destination }} · <b>Осталось:</b> {{ remainingItems }} / {{ startedBox.items?.length || 0 }}</p>
          </div>

          <div class="pvz-page__products">
            <PvzProductCard
              v-for="item in startedBox.items"
              :key="item.order_item_id"
              :cell="item.suggested_cell || '—'"
              :code="item.article_nr"
              :title="`${item.brand} ${item.article_nr}`"
              :subtitle="`order_item_id: ${item.order_item_id}`"
              :quantity="'1 шт.'"
              :image="getItemImage(item.image)"
              :dimmed="receivedItemIds.has(item.order_item_id)"
              :badge="receivedItemIds.has(item.order_item_id) ? 'Принят' : ''"
              :badge-tone="receivedItemIds.has(item.order_item_id) ? 'success' : undefined"
            />
          </div>

          <div v-if="!lastReceivedItem || lastReceivedItem.box_status !== 'delivered' && lastReceivedItem?.status !== 'delivered'" class="pvz-page__box-receive-scanner">
            <div class="pvz-page__box-scan-controls">
              <label>
                <span>Сканировать товар</span>
                <input v-model="receiveScanValue" type="text" placeholder="*-012345" @keydown.enter.prevent="addReceiveScan">
              </label>
              <button type="button" class="pvz-page__primary" :disabled="receivingItem !== null" @click="addReceiveScan">
                {{ receivingItem !== null ? 'Приёмка...' : 'Принять' }}
              </button>
            </div>
            <p class="pvz-page__box-receive-hint">Отсканируйте QR-код товара или введите order_item_id</p>
          </div>

          <div v-if="lastReceivedItem && (lastReceivedItem.box_status === 'delivered' || lastReceivedItem.status === 'delivered')" class="pvz-page__box-receive-complete">
            <h3>Коробка полностью принята!</h3>
            <p>Все товары готовы к выдаче</p>
          </div>
        </div>
      </div>

    </template>

    <template v-else>
      <section class="pvz-page__workspace">
        <div class="pvz-page__workspace-head">
          <div>
            <h2>Приёмка от поставщика</h2>
            <p>Сканируйте штрихкод — добавляйте товары в список приёмки</p>
          </div>

          <div class="pvz-page__summary">
            <span>В списке</span>
            <strong>{{ pendingItems.length }}</strong>
          </div>
        </div>

        <div class="pvz-page__supplier-controls">
          <label>
            <span>Поставщик</span>
            <select v-model="selectedSupplier">
              <option v-for="s in suppliers" :key="s.value" :value="s.value">
                {{ s.label }}
              </option>
            </select>
          </label>

          <label>
            <span>Штрихкод (EAN)</span>
            <input v-model="barcode" type="text" placeholder="3165143122013" @keydown.enter.prevent="scanBarcode">
          </label>

          <button type="button" class="pvz-page__primary" :disabled="scanLoading" @click="scanBarcode">
            {{ scanLoading ? 'Сканирование...' : 'Сканировать' }}
          </button>
        </div>

        <!-- 2+ совпадений — таблица выбора -->
        <div v-if="scanResult && scanResult.matches_count > 1" class="pvz-page__scan-matches" style="margin-top:1.6rem;">
          <h3>Найдено {{ scanResult.matches_count }} совпадения — куда отнести товар?</h3>
          <div class="pvz-page__products" style="margin-top:1rem;">
            <article v-for="match in scanResult.matches" :key="match.order_item_id" class="pvz-page__match-card">
              <div class="pvz-page__match-header">
                <strong>{{ match.article_nr || scanResult.article_nr }}</strong>
                <span>{{ match.brand || scanResult.brand }}</span>
              </div>
              <div class="pvz-page__match-body">
                <p>Заказ #{{ match.order_id }} · {{ match.supplier }} · {{ match.price_formatted }}</p>
                <p>Клиент: {{ match.customer?.email || match.customer?.id }} · {{ match.quantity }} шт.</p>
              </div>
              <button type="button" class="pvz-page__primary" style="min-height:4rem;padding:0 1.4rem;font-size:1.3rem;margin-top:0.8rem;" @click="addToPending(match.order_item_id)">
                Выбрать заказ #{{ match.order_id }}
              </button>
            </article>
          </div>
        </div>

        <!-- 1 совпадение — карточка товара с кнопкой добавить -->
        <div v-if="scanResult && scanResult.matches_count === 1" class="pvz-page__products" style="margin-top:1.6rem;">
          <PvzProductCard
            :cell="'—'"
            :code="scanResult.matches[0].article_nr"
            :title="scanResult.matches[0].brand + ' ' + scanResult.matches[0].article_nr"
            :subtitle="`Заказ #${scanResult.matches[0].order_id} · ${scanResult.matches[0].supplier} · ${scanResult.matches[0].price_formatted}`"
            :quantity="`${scanResult.matches[0].quantity} шт.`"
            :image="getItemImage(scanResult.matches[0].image || scanResult.image)"
          />
          <div class="pvz-page__confirm-actions">
            <button type="button" class="pvz-page__primary" @click="addToPending(scanResult.matches[0].order_item_id)">
              {{ pendingItems.some(p => p.order_item_id === scanResult.matches[0].order_item_id) ? 'Уже в списке' : 'Добавить в список приёмки' }}
            </button>
          </div>
        </div>

        <!-- Список ожидания подтверждения -->
        <div v-if="pendingItems.length && !batchResult" class="pvz-page__pending">
          <div class="pvz-page__pending-head">
            <h3>Список приёмки</h3>
            <span>{{ pendingItems.length }} {{ pendingItems.length === 1 ? 'товар' : 'товаров' }}</span>
          </div>

          <div class="pvz-page__products">
            <div v-for="item in pendingItems" :key="item.order_item_id" class="pvz-page__pending-card">
              <PvzProductCard
                :cell="'—'"
                :code="item.article_nr"
                :title="item.brand + ' ' + item.article_nr"
                :subtitle="`Заказ #${item.order_id} · ${item.supplier}`"
                :quantity="`${item.quantity} шт.`"
                :image="getItemImage(item.image)"
              />
              <button type="button" class="pvz-page__pending-remove" @click="removeFromPending(item.order_item_id)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>

          <button type="button" class="pvz-page__batch-btn" :disabled="batchLoading" @click="submitBatch">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10L8 14L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ batchLoading ? 'Приёмка...' : `Завершить приёмку — ${pendingItems.length} ${pendingItems.length === 1 ? 'товар' : 'товаров'}` }}
          </button>
        </div>

        <!-- Результат батча -->
        <div v-if="batchResult" class="pvz-page__batch-result" style="margin-top:1.6rem;">
          <h3>✓ Принято {{ batchResult.received }} товаров</h3>
          <div class="pvz-page__products" style="margin-top:1rem;">
            <div v-for="item in batchResult.items" :key="item.order_item_id" class="pvz-page__match-card">
              <div class="pvz-page__match-header">
                <strong>{{ item.article_nr }}</strong>
                <span>{{ item.brand }}</span>
              </div>
              <div class="pvz-page__match-body">
                <p>Заказ #{{ item.order_id }} · {{ item.quantity }} шт.</p>
                <p>Ячейка: <b>{{ item.cell }}</b> · Статус: arrived</p>
                <p>Клиент: {{ item.customer }}</p>
              </div>
            </div>
          </div>
          <button type="button" class="pvz-page__primary" style="margin-top:1.2rem;" @click="batchResult = null; pendingItems = []">
            Новая приёмка
          </button>
        </div>
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

.pvz-page__box-scan {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
}

.pvz-page__box-scan-controls {
  display: flex;
  gap: 1rem;
  align-items: end;
  margin-top: 1.4rem;
  flex-wrap: wrap;

  label {
    display: grid;
    gap: 0.6rem;
  }

  span {
    font-size: 1.2rem;
    color: #8d8d8d;
  }

  input {
    height: 4.4rem;
    padding: 0 1.2rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1rem;
    font-size: 1.35rem;
    color: #444;
    min-width: 22rem;
  }
}

.pvz-page__box-scan-result {
  margin-top: 1.4rem;
  padding: 1.4rem;
  background: #e8f5e9;
  border-radius: 1.4rem;

  p {
    font-size: 1.35rem;
    color: #2e7d32;
    line-height: 1.5;
  }
}

.pvz-page__box-scan-items {
  display: grid;
  gap: 0.6rem;
  margin-top: 1rem;
}

.pvz-page__box-scan-item {
  padding: 0.8rem 1rem;
  background: #fff;
  border-radius: 0.8rem;
  font-size: 1.3rem;
  color: #444;
}

.pvz-page__box-receive {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
}

.pvz-page__box-receive-content {
  margin-top: 1.6rem;
  display: grid;
  gap: 1.4rem;
}

.pvz-page__box-receive-header {
  padding: 1.4rem;
  background: #f0f7f1;
  border-radius: 1.4rem;

  p {
    font-size: 1.35rem;
    color: #2e7d32;
    line-height: 1.6;
  }
}

.pvz-page__box-receive-items {
  display: grid;
  gap: 0.8rem;
}

.pvz-page__box-receive-scanner {
  margin-top: 1.6rem;
  padding: 1.6rem;
  background: #fafafa;
  border-radius: 1.4rem;
}

.pvz-page__box-receive-hint {
  margin-top: 0.8rem;
  font-size: 1.25rem;
  color: #888;
}

.pvz-page__box-receive-complete {
  margin-top: 1.6rem;
  padding: 2rem;
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 1.4rem;
  text-align: center;

  h3 {
    font-size: 1.8rem;
    color: #2e7d32;
    font-weight: 600;
  }

  p {
    margin-top: 0.6rem;
    font-size: 1.4rem;
    color: #388e3c;
  }
}

.pvz-page__pending {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
}

.pvz-page__pending-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.4rem;

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }

  span {
    font-size: 1.35rem;
    color: #18b536;
    font-weight: 600;
  }
}

.pvz-page__pending-card {
  position: relative;
}

.pvz-page__pending-remove {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.9);
  border: 0;
  border-radius: 50%;
  color: #c62828;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #ffebee;
  }
}

.pvz-page__batch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  min-height: 5rem;
  margin-top: 1.4rem;
  padding: 0 2rem;
  background: $linear-green;
  border: 0;
  border-radius: 1.4rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: 0 4px 16px rgba(24, 181, 54, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
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
