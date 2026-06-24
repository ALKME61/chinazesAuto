<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'
import PvzProductCard from '~/components/pvz/PvzProductCard.vue'
import PvzScanHero from '~/components/pvz/PvzScanHero.vue'
import { QrcodeStream } from 'vue-qrcode-reader'

definePageMeta({
  layout: 'pvz',
  pvzSidebar: [
    { label: 'QR-код клиента', to: '/pvz/issue', icon: 'qr' },
    { label: '4 цифры + SMS', to: '/pvz/issue?mode=sms', icon: 'sms' },
  ],
})

const api = useAPI()
const route = useRoute()
const { useAuthStore } = await import('~~/stores/auth')
const authStore = useAuthStore()
const mode = computed(() => (route.query.mode === 'sms' ? 'sms' : 'qr'))
const pvzName = ref('')

async function loadPvzName() {
  const managedPvz = authStore.user?.managed_pvz
  if (!managedPvz) return
  try {
    const data: any = await api('/api/warehouse/pickup-points')
    const points = Array.isArray(data) ? data : (data?.results || [])
    const found = points.find((p: any) => p.id === managedPvz)
    if (found) pvzName.value = found.name || `ПВЗ №${found.id}`
  } catch {}
}

onMounted(loadPvzName)

const orderId = ref('')
const orderItems = ref<any[]>([])
const checkedItems = ref<Set<number>>(new Set())
const issueResult = ref<any>(null)
const error = ref('')
const loading = ref(false)
const issuing = ref(false)
const showScanner = ref(false)
const scannerPaused = ref(false)

let scanBuffer = ''
let scanLastTime = 0
let scanTimer: ReturnType<typeof setTimeout> | null = null
const SCAN_GAP_MS = 300

function onGlobalKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (scanBuffer.startsWith('*-')) {
      e.preventDefault()
      orderId.value = scanBuffer.slice(2).trim()
      if (orderId.value) { scanBuffer = ''; loadOrder() }
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
      const id = scanBuffer.slice(2).trim()
      if (id) { orderId.value = id; loadOrder() }
    }
    scanBuffer = ''; scanLastTime = 0; scanTimer = null
  }, SCAN_GAP_MS)
}

onMounted(() => document.addEventListener('keydown', onGlobalKeyDown))
onUnmounted(() => {
  document.removeEventListener('keydown', onGlobalKeyDown)
  if (scanTimer) clearTimeout(scanTimer)
})

async function loadOrder() {
  if (!orderId.value.trim()) return
  loading.value = true
  error.value = ''
  orderItems.value = []
  checkedItems.value = new Set()
  issueResult.value = null
  try {
    const data: any = await api(`/api/warehouse/order/${orderId.value.trim()}/`)
    if (!data || !data.items) { error.value = 'Заказ не найден'; return }
    orderItems.value = (data.items || []).map((item: any, i: number) => ({
      id: item.order_item_id || item.id || i,
      orderItemId: item.order_item_id || item.id,
      articleNr: item.article_nr || '',
      brand: item.brand || '',
      quantity: item.quantity || 1,
      cell: item.cell || '—',
      supplierStatus: item.supplier_status || '',
      internalStatus: item.internal_status || '',
    }))
  } catch {
    error.value = 'Ошибка загрузки заказа'
  } finally { loading.value = false }
}

function toggleItem(itemId: number) {
  const next = new Set(checkedItems.value)
  if (next.has(itemId)) { next.delete(itemId) } else { next.add(itemId) }
  checkedItems.value = next
}

const allChecked = computed(() => orderItems.value.length > 0 && checkedItems.value.size === orderItems.value.length)

async function confirmIssue() {
  if (!orderId.value.trim() || !allChecked.value) return
  issuing.value = true
  error.value = ''
  try {
    const data: any = await api(`/api/warehouse/issue/${orderId.value.trim()}`, { method: 'POST' })
    issueResult.value = data
    orderItems.value = []
    checkedItems.value = new Set()
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Ошибка выдачи'
  } finally { issuing.value = false }
}

function resetForm() {
  orderId.value = ''
  orderItems.value = []
  checkedItems.value = new Set()
  issueResult.value = null
  error.value = ''
}

function onQrDetect(detected: any[]) {
  const value = detected?.[0]?.rawValue
  if (!value) return
  orderId.value = value
  scannerPaused.value = true
  setTimeout(() => {
    showScanner.value = false
    scannerPaused.value = false
    loadOrder()
  }, 300)
}
</script>

<template>
  <section class="pvz-page">
    <div class="pvz-page__grid">
      <PvzScanHero
        title="Отсканируйте QR-код или введите номер заказа"
        subtitle="Клиент называет ID заказа"
      >
        <div class="pvz-page__sms-form">
          <label>
            <span>Номер заказа</span>
            <input v-model="orderId" type="text" placeholder="ID заказа" @keyup.enter="loadOrder">
          </label>
          <div class="pvz-page__sms-actions">
            <button type="button" :disabled="loading" @click="loadOrder">{{ loading ? 'Поиск...' : 'Найти' }}</button>
            <button type="button" class="pvz-page__button--ghost" @click="showScanner = true">
              <PvzIcon name="qr" :size="18" /><span>QR</span>
            </button>
          </div>
        </div>
        <div v-if="mode === 'qr'" class="pvz-page__hero-actions">
          <NuxtLink class="pvz-page__hero-link" to="/pvz/issue?mode=sms">Нет QR-кода? перейти к SMS</NuxtLink>
        </div>
      </PvzScanHero>

      <div>
        <div class="pvz-page__operator-grid">
          <article>
            <strong>Оператор</strong>
            <p>{{ authStore.user?.email || 'Сотрудник' }}<br>{{ pvzName || `ПВЗ #${authStore.user?.managed_pvz || ''}` }}</p>
          </article>
          <article>
            <strong>Смена</strong>
            <p>Начало: 09:00<br>Конец: 21:00</p>
          </article>
          <article>
            <strong>Статус</strong>
            <p>Активна<br>4 часа до закрытия</p>
          </article>
        </div>

        <div v-if="error" class="pvz-page__note">
          <PvzIcon name="qr" :size="18" />
          <span>{{ error }}</span>
        </div>

        <div class="pvz-page__note">
          <PvzIcon name="qr" :size="18" />
          <span>После подтверждения можно выдать сразу все места одного пользователя.</span>
        </div>
      </div>

      <Teleport to="body">
        <div v-if="showScanner" class="pvz-qr-overlay" @click.self="showScanner = false">
          <div class="pvz-qr-overlay__content">
            <div class="pvz-qr-overlay__head">
              <h3>Наведите камеру на QR-код</h3>
              <button type="button" class="pvz-qr-overlay__close" @click="showScanner = false">
                <PvzIcon name="logout" :size="20" />
              </button>
            </div>
            <div class="pvz-qr-overlay__scanner">
              <QrcodeStream :paused="scannerPaused" @detect="onQrDetect" @error="console.error" />
            </div>
            <p class="pvz-qr-overlay__hint">QR-код должен содержать ID заказа</p>
          </div>
        </div>
      </Teleport>
    </div>

    <!-- Items checklist before issue -->
    <section v-if="orderItems.length && !issueResult" class="pvz-page__workspace">
      <div class="pvz-page__workspace-head">
        <div>
          <h2>Заказ #{{ orderId }} — товары к выдаче</h2>
          <p>Отметьте каждый товар, который передаёте клиенту</p>
        </div>
        <div class="pvz-page__summary">
          <span>Отмечено</span>
          <strong>{{ checkedItems.size }} / {{ orderItems.length }}</strong>
        </div>
      </div>

      <div class="pvz-page__issue-layout">
        <aside class="pvz-page__issue-sidebar">
          <div class="pvz-page__metric">
            <span>Количество позиций</span>
            <strong>{{ orderItems.length }}</strong>
          </div>
          <button
            type="button"
            class="pvz-page__primary"
            :disabled="issuing"
            @click="confirmIssue"
          >
            {{ issuing ? 'Выдача...' : 'Подтвердить выдачу' }}
          </button>
        </aside>

        <div class="pvz-page__products">
          <PvzProductCard
            v-for="item in orderItems"
            :key="item.id"
            :cell="item.cell"
            :code="item.articleNr"
            :title="`${item.brand} ${item.articleNr}`"
            :subtitle="`Пользователь: — · ${item.quantity} шт.`"
            :quantity="`${item.quantity} шт.`"
          />
        </div>
      </div>
    </section>

    <!-- Issue result -->
    <section v-if="issueResult" class="pvz-page__workspace">
      <div class="pvz-page__workspace-head">
        <div>
          <h2>Заказ #{{ issueResult.order_id }} — выдан</h2>
          <p>Выдано позиций: {{ issueResult.items_issued }}</p>
        </div>
      </div>

      <div class="pvz-page__products" style="margin-top:1.2rem;">
        <article v-for="(item, i) in issueResult.items" :key="item.order_item_id || item.id || i" class="pvz-page__match-card">
          <div class="pvz-page__match-header">
            <strong>{{ item.article_nr || item.article }}</strong>
            <span>Статус: {{ item.status }}</span>
          </div>
          <div class="pvz-page__match-body">
            <p>{{ item.brand || item.brand_name || '' }}</p>
          </div>
        </article>
      </div>

      <button type="button" class="pvz-page__primary" style="margin-top:1.4rem;" @click="resetForm">
        Следующая выдача
      </button>
    </section>

    <section v-else-if="!orderItems.length && !loading && !error" class="pvz-page__workspace">
      <div class="pvz-page__workspace-head">
        <div>
          <h2>Выдача товара</h2>
          <p>После подтверждения можно выдать сразу все места одного пользователя.</p>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.pvz-page {
  display: grid;
  gap: 2rem;
}

.pvz-page__grid {
  display: grid;
  grid-template-columns: minmax(34rem, 40rem) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
}

.pvz-page__panel,
.pvz-page__workspace {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
}

.pvz-page__panel--compact {
  padding: 1.8rem 2rem;
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

.pvz-page__operator-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
  margin-top: 1.8rem;

  article {
    padding: 1.5rem;
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 1.6rem;
  }

  strong {
    display: block;
    margin-bottom: 0.8rem;
    font-size: 1.45rem;
    color: #393939;
  }

  p {
    font-size: 1.3rem;
    line-height: 1.5;
    color: #757575;
  }
}

.pvz-page__note {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
  padding: 1.2rem 1.4rem;
  background: #f6fbf7;
  border-radius: 1.4rem;
  color: #5f8e68;

  span {
    font-size: 1.28rem;
    line-height: 1.45;
  }
}

.pvz-page__hero-actions {
  display: flex;
  justify-content: center;
}

.pvz-page__hero-link {
  font-size: 1.35rem;
  color: #18b536;
  text-decoration: none;
}

.pvz-page__sms-form {
  display: grid;
  gap: 1.2rem;
  width: 100%;
  margin-top: 0.8rem;

  label {
    display: grid;
    gap: 0.6rem;
    text-align: left;
  }

  span {
    font-size: 1.2rem;
    color: #8b8b8b;
  }

  input {
    width: 100%;
    height: 4.8rem;
    padding: 0 1.4rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    color: #444;
  }
}

.pvz-page__sms-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  button {
    min-height: 4.8rem;
    border: 0;
    border-radius: 1.2rem;
    background: $linear-green;
    font-size: 1.35rem;
    color: #fff;
    cursor: pointer;
  }
}

.pvz-page__button--ghost {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: #f2f7f3 !important;
  color: #18b536 !important;
}

.pvz-page__summary {
  text-align: right;

  strong {
    display: block;
    font-size: 1.75rem;
    color: #393939;
  }

  span {
    font-size: 1.25rem;
    color: #8e8e8e;
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

.pvz-page__primary {
  min-height: 5.4rem;
  background: $linear-green;
  border: 0;
  border-radius: 1.4rem;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pvz-page__products {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.6rem;
}

.pvz-page__checklist {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.4rem;
  padding-left: 1.8rem;

  li {
    font-size: 1.35rem;
    line-height: 1.45;
    color: #616161;
  }
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

/* QR overlay */
.pvz-qr-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  padding: 2rem;
}

.pvz-qr-overlay__content {
  width: min(48rem, 100%);
  background: #fff;
  border-radius: 2.4rem;
  overflow: hidden;
}

.pvz-qr-overlay__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 2rem;

  h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
  }
}

.pvz-qr-overlay__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  background: #f5f5f5;
  border: 0;
  border-radius: 50%;
  color: #666;
  cursor: pointer;
}

.pvz-qr-overlay__scanner {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.pvz-qr-overlay__hint {
  text-align: center;
  padding: 1.2rem;
  font-size: 1.3rem;
  color: #888;
}

@media (max-width: 1360px) {
  .pvz-page__grid,
  .pvz-page__issue-layout,
  .pvz-page__products,
  .pvz-page__operator-grid {
    grid-template-columns: 1fr;
  }
}
</style>
