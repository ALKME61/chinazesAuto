<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'

definePageMeta({
  layout: 'pvz',
  pvzSidebar: [
    { label: 'Список возвратов', to: '/pvz/returns', icon: 'return' },
    { label: 'Создать возврат', to: '/pvz/returns?mode=create', icon: 'box' },
  ],
})

const api = useAPI()
const route = useRoute()

const mode = computed(() => {
  if (route.query.mode === 'create') return 'create'
  if (route.query.mode === 'detail' && route.query.id) return 'detail'
  return 'list'
})

const returnsList = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const statusFilter = ref('')
const pvzIdFilter = ref('')

async function loadReturns() {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, string> = {}
    if (statusFilter.value) params.status = statusFilter.value
    if (pvzIdFilter.value) params.pvz_id = pvzIdFilter.value
    const data: any = await api('/api/warehouse/returns', { params })
    returnsList.value = data?.results || (Array.isArray(data) ? data : [data] || [])
  } catch {
    error.value = 'Ошибка загрузки возвратов'
    returnsList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => { if (mode.value === 'list') loadReturns() })

watch(mode, (m) => { if (m === 'list') loadReturns() })

const conditions = [
  { value: 'new', label: 'Новый' },
  { value: 'used', label: 'Б/У' },
  { value: 'defective', label: 'Брак' },
] as const

const returnOrderId = ref('')
const orderData = ref<any>(null)
const orderLoading = ref(false)
const selectedItems = reactive(new Set<number>())
const itemConditions = ref<Record<number, string>>({})
const returnReason = ref('')
const creatingReturn = ref(false)
const createResult = ref<any>(null)

async function loadOrder() {
  if (!returnOrderId.value.trim()) return
  orderLoading.value = true
  orderData.value = null
  selectedItems.clear()
  itemConditions.value = {}
  error.value = ''
  try {
    const data: any = await api(`/api/warehouse/order/${returnOrderId.value.trim()}/`)
    orderData.value = data
  } catch {
    error.value = 'Заказ не найден или недоступен'
  } finally {
    orderLoading.value = false
  }
}

function toggleReturnItem(itemId: number) {
  if (selectedItems.has(itemId)) {
    selectedItems.delete(itemId)
  } else {
    selectedItems.add(itemId)
    if (!itemConditions.value[itemId]) itemConditions.value[itemId] = 'new'
  }
}

const returnItems = computed(() => {
  if (!orderData.value?.items) return []
  return orderData.value.items.filter((i: any) => selectedItems.has(i.id || i.order_item_id))
})

async function submitReturn() {
  if (!returnOrderId.value.trim() || !returnItems.value.length || !returnReason.value.trim()) {
    error.value = 'Выберите товары и укажите причину'
    return
  }
  creatingReturn.value = true
  error.value = ''
  createResult.value = null
  try {
    const body: any = {
      order_id: Number(returnOrderId.value),
      pvz_id: 5,
      reason: returnReason.value,
      items: returnItems.value.map((i: any) => ({
        order_item_id: i.id || i.order_item_id,
        quantity: i.quantity || 1,
        condition: itemConditions.value[i.id || i.order_item_id] || 'new',
      })),
    }
    const data: any = await api('/api/warehouse/returns/create', {
      method: 'POST',
      body,
    })
    createResult.value = data
    returnOrderId.value = ''
    orderData.value = null
    selectedItems.clear()
    itemConditions.value = {}
    returnReason.value = ''
  } catch {
    error.value = 'Ошибка создания возврата'
  } finally {
    creatingReturn.value = false
  }
}

const detailReturn = ref<any>(null)
const detailLoading = ref(false)

async function loadDetail(id: string) {
  detailLoading.value = true
  detailReturn.value = null
  error.value = ''
  try {
    const data: any = await api(`/api/warehouse/returns/${id}`)
    detailReturn.value = data
  } catch {
    error.value = 'Ошибка загрузки возврата'
  } finally {
    detailLoading.value = false
  }
}

watch(() => route.query.id, (id) => {
  if (id && mode.value === 'detail') loadDetail(id as string)
})

async function approveReturn(id: number) {
  try {
    await api(`/api/warehouse/returns/${id}/approve`, { method: 'POST', body: { status: 'received' } })
    await loadReturns()
  } catch {
    alert('Ошибка подтверждения возврата')
  }
}

async function rejectReturn(id: number) {
  try {
    await api(`/api/warehouse/returns/${id}/reject`, { method: 'POST' })
    await loadReturns()
  } catch {
    alert('Ошибка отклонения возврата')
  }
}

const boxingId = ref<number | null>(null)
const boxResult = ref<any>(null)

async function createReturnBox(id: number) {
  boxingId.value = id
  boxResult.value = null
  try {
    const data: any = await api(`/api/warehouse/returns/${id}/box`, { method: 'POST' })
    boxResult.value = data
  } catch {
    alert('Ошибка создания коробки возврата')
  } finally {
    boxingId.value = null
  }
}
</script>

<template>
  <section class="pvz-page">
    <div class="pvz-page__heading">
      <h1>Возвраты</h1>
    </div>

    <template v-if="mode === 'list'">
      <div class="pvz-page__toolbar">
        <div class="pvz-page__filters">
          <label>
            <span>Статус</span>
            <select v-model="statusFilter">
              <option value="">Все</option>
              <option value="pending">Ожидает</option>
              <option value="received">Принят</option>
              <option value="rejected">Отклонён</option>
            </select>
          </label>
          <label>
            <span>ПВЗ ID</span>
            <input v-model="pvzIdFilter" type="number" placeholder="ID ПВЗ">
          </label>
          <button type="button" class="pvz-page__primary" style="min-height:4.4rem;padding:0 1.6rem;" @click="loadReturns">
            Применить
          </button>
        </div>
      </div>

      <div v-if="loading" class="pvz-page__empty">Загрузка...</div>

      <div v-else-if="error" class="pvz-page__note pvz-page__note--error">
        <span>{{ error }}</span>
      </div>

      <div v-else-if="!returnsList.length" class="pvz-page__empty">
        <h3>Нет возвратов</h3>
        <p>Создайте новый возврат через боковое меню</p>
      </div>

      <div v-else class="pvz-page__list">
        <article v-for="ret in returnsList" :key="ret.id" class="pvz-page__card">
          <div class="pvz-page__card-head">
            <strong>Возврат #{{ ret.id }}</strong>
            <span class="pvz-page__status" :class="{
              'pvz-page__status--ok': ret.status === 'received',
              'pvz-page__status--warn': ret.status === 'pending',
              'pvz-page__status--fail': ret.status === 'rejected',
            }">{{ ret.status }}</span>
          </div>
          <div class="pvz-page__card-body">
            <p>Заказ: #{{ ret.order_id }} · ПВЗ: {{ ret.pvz_id }}</p>
            <p v-if="ret.reason">Причина: {{ ret.reason }}</p>
            <p>Позиций: {{ ret.items_count || ret.items?.length || 0 }}</p>
          </div>
          <div v-if="ret.status === 'pending'" class="pvz-page__card-actions">
            <button type="button" class="pvz-page__secondary" @click="approveReturn(ret.id)">Принять</button>
            <button type="button" class="pvz-page__danger" @click="rejectReturn(ret.id)">Отклонить</button>
            <button type="button" class="pvz-page__secondary" :disabled="boxingId === ret.id" @click="createReturnBox(ret.id)">
              {{ boxingId === ret.id ? 'Создание...' : 'Коробка' }}
            </button>
          </div>
          <div v-if="boxResult && boxingId === ret.id" class="pvz-page__box-result">
            <p>QR: <strong>{{ boxResult.qr_code }}</strong></p>
            <p>Товаров: {{ boxResult.items_count }} · {{ boxResult.source }} → {{ boxResult.destination }}</p>
          </div>
        </article>
      </div>
    </template>

    <template v-else-if="mode === 'create'">
      <div class="pvz-page__workspace">
        <div class="pvz-page__workspace-head">
          <h2>Создать возврат</h2>
          <span>Введите номер заказа, выберите товары и укажите причину</span>
        </div>

        <div class="pvz-page__order-lookup" style="display:flex;gap:1rem;align-items:end;margin-bottom:1.6rem;">
          <label style="display:grid;gap:0.6rem;flex:1;">
            <span style="font-size:1.2rem;color:#8d8d8d;">Номер заказа</span>
            <input v-model="returnOrderId" type="number" placeholder="18" style="height:4.8rem;padding:0 1.4rem;background:#fafafa;border:1px solid #ececec;border-radius:1.2rem;font-size:1.4rem;color:#444;" @keydown.enter.prevent="loadOrder">
          </label>
          <button type="button" class="pvz-page__primary" style="min-height:4.8rem;padding:0 1.8rem;" :disabled="orderLoading" @click="loadOrder">
            {{ orderLoading ? 'Загрузка...' : 'Найти заказ' }}
          </button>
        </div>

        <div v-if="error" class="pvz-page__note pvz-page__note--error" style="margin-bottom:1.2rem;">
          <span>{{ error }}</span>
        </div>

        <template v-if="orderData">
          <div class="pvz-page__order-info" style="padding:1.2rem 1.4rem;background:#f6fbf7;border-radius:1.2rem;margin-bottom:1.2rem;">
            <p style="font-size:1.35rem;color:#2e7d32;"><b>Заказ #{{ orderData.id }}</b> · {{ orderData.pickup_point || orderData.pvz }} · {{ orderData.status }}</p>
            <p v-if="orderData.user" style="font-size:1.3rem;color:#555;">Клиент: {{ orderData.user.email || orderData.user.id }}</p>
          </div>

          <div class="pvz-page__return-items" style="display:grid;gap:0.8rem;margin-bottom:1.4rem;">
            <div v-for="item in orderData.items" :key="item.id || item.order_item_id" class="pvz-page__return-item" :class="{ 'pvz-page__return-item--selected': selectedItems.has(item.id || item.order_item_id) }" @click="toggleReturnItem(item.id || item.order_item_id)">
              <div class="pvz-page__return-item-check">
                <div v-if="selectedItems.has(item.id || item.order_item_id)" class="pvz-page__return-item-checked">✓</div>
              </div>
              <div class="pvz-page__return-item-info">
                <strong>{{ item.article_nr }}</strong>
                <span>{{ item.brand }}</span>
                <span v-if="item.internal_status">Статус: {{ item.internal_status }}</span>
              </div>
              <div v-if="selectedItems.has(item.id || item.order_item_id)" class="pvz-page__return-item-condition" @click.stop>
                <select v-model="itemConditions[item.id || item.order_item_id]" style="height:3.6rem;padding:0 1rem;background:#fff;border:1px solid #ddd;border-radius:0.8rem;font-size:1.25rem;color:#444;">
                  <option v-for="c in conditions" :key="c.value" :value="c.value">{{ c.label }}</option>
                </select>
              </div>
            </div>
          </div>

          <label class="pvz-page__wide" style="display:grid;gap:0.6rem;margin-bottom:1.2rem;">
            <span style="font-size:1.2rem;color:#8d8d8d;">Причина возврата</span>
            <textarea v-model="returnReason" placeholder="Опишите причину" style="width:100%;min-height:8rem;padding:1.2rem 1.4rem;background:#fafafa;border:1px solid #ececec;border-radius:1.2rem;font-size:1.4rem;color:#444;resize:vertical;"/>
          </label>

          <button type="button" class="pvz-page__primary" style="width:100%;min-height:5rem;font-size:1.5rem;" :disabled="creatingReturn || !returnItems.length || !returnReason.trim()" @click="submitReturn">
            {{ creatingReturn ? 'Создание...' : `Создать возврат (${returnItems.length} ${returnItems.length === 1 ? 'товар' : 'товаров'})` }}
          </button>
        </template>

        <div v-if="createResult" class="pvz-page__result" style="margin-top:1.6rem;">
          <p>Возврат #{{ createResult.id }} создан, статус: {{ createResult.status }}</p>
          <p>Позиций: {{ createResult.items_count }}</p>
          <NuxtLink to="/pvz/returns" class="pvz-page__secondary" style="display:inline-flex;align-items:center;justify-content:center;min-height:4.4rem;padding:0 1.6rem;text-decoration:none;margin-top:1rem;">
            К списку возвратов
          </NuxtLink>
        </div>
      </div>
    </template>

    <template v-else-if="mode === 'detail'">
      <div v-if="detailLoading" class="pvz-page__empty">Загрузка...</div>
      <div v-else-if="error" class="pvz-page__note pvz-page__note--error">{{ error }}</div>
      <div v-else-if="detailReturn" class="pvz-page__workspace">
        <div class="pvz-page__workspace-head">
          <h2>Возврат #{{ detailReturn.id }}</h2>
          <span class="pvz-page__status" :class="{
            'pvz-page__status--ok': detailReturn.status === 'received',
            'pvz-page__status--warn': detailReturn.status === 'pending',
            'pvz-page__status--fail': detailReturn.status === 'rejected',
          }">{{ detailReturn.status }}</span>
        </div>
        <div class="pvz-page__detail-body">
          <p><b>Заказ:</b> #{{ detailReturn.order_id }}</p>
          <p><b>ПВЗ:</b> {{ detailReturn.pvz_id }}</p>
          <p><b>Причина:</b> {{ detailReturn.reason }}</p>
          <p><b>Позиций:</b> {{ detailReturn.items_count }}</p>
        </div>
        <NuxtLink to="/pvz/returns" class="pvz-page__secondary" style="display:inline-flex;align-items:center;justify-content:center;min-height:4.4rem;padding:0 1.6rem;text-decoration:none;margin-top:1.2rem;">
          Назад к списку
        </NuxtLink>
      </div>
    </template>
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
}

.pvz-page__toolbar {
  padding: 1.6rem 2rem;
  background: #fff;
  border-radius: 2.4rem;
}

.pvz-page__filters {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;

  label {
    display: grid;
    gap: 0.6rem;
  }

  span {
    font-size: 1.2rem;
    color: #8d8d8d;
  }

  select,
  input {
    min-width: 16rem;
    height: 4.4rem;
    padding: 0 1.2rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1rem;
    font-size: 1.35rem;
    color: #444;
  }
}

.pvz-page__empty {
  display: grid;
  place-items: center;
  min-height: 20rem;
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
  text-align: center;

  h3 {
    font-size: 1.8rem;
    color: #3c3c3c;
  }

  p {
    margin-top: 0.6rem;
    font-size: 1.35rem;
    color: #8a8a8a;
  }
}

.pvz-page__note {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 1.4rem;
  background: #f6fbf7;
  border-radius: 1.4rem;
  color: #5f8e68;
  font-size: 1.28rem;
  line-height: 1.45;
}

.pvz-page__note--error {
  background: #fff0f0;
  color: #c62828;
}

.pvz-page__list {
  display: grid;
  gap: 1rem;
}

.pvz-page__card {
  padding: 1.8rem;
  background: #fff;
  border-radius: 2rem;
  display: grid;
  gap: 1.2rem;
}

.pvz-page__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  strong {
    font-size: 1.6rem;
    color: #343434;
  }
}

.pvz-page__card-body {
  display: grid;
  gap: 0.4rem;

  p {
    font-size: 1.35rem;
    color: #616161;
  }
}

.pvz-page__card-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.pvz-page__box-result {
  padding: 1rem;
  background: #f0f7f1;
  border-radius: 1rem;

  p {
    font-size: 1.3rem;
    color: #2e7d32;
  }

  strong {
    font-family: monospace;
  }
}

.pvz-page__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0 1rem;
  border-radius: 999px;
  font-size: 1.2rem !important;
  font-weight: 600;
}

.pvz-page__status--ok {
  background: #e8f5e9;
  color: #2e7d32;
}

.pvz-page__status--warn {
  background: #fff3e0;
  color: #e65100;
}

.pvz-page__status--fail {
  background: #ffebee;
  color: #c62828;
}

.pvz-page__workspace {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
}

.pvz-page__workspace-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.6rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }
}

.pvz-page__create-form {
  display: grid;
  gap: 1.2rem;

  label {
    display: grid;
    gap: 0.6rem;
  }

  span {
    font-size: 1.2rem;
    color: #8d8d8d;
  }

  input,
  select,
  textarea {
    width: 100%;
    height: 4.8rem;
    padding: 0 1.4rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    color: #444;
  }

  textarea {
    min-height: 10rem;
    padding-top: 1.2rem;
    resize: vertical;
  }
}

.pvz-page__wide {
  grid-column: 1 / -1;
}

.pvz-page__items-section {
  display: grid;
  gap: 1rem;
  padding: 1.4rem;
  background: #fafafa;
  border-radius: 1.4rem;

  strong {
    font-size: 1.4rem;
    color: #444;
  }
}

.pvz-page__items-list {
  display: grid;
  gap: 0.6rem;
}

.pvz-page__item-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 1rem;
  background: #fff;
  border-radius: 0.8rem;

  span {
    font-size: 1.3rem;
    color: #555;
  }
}

.pvz-page__add-item {
  display: flex;
  gap: 0.6rem;

  input,
  select {
    flex: 1;
    min-width: 0;
    height: 4.4rem;
    padding: 0 1rem;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 0.8rem;
    font-size: 1.3rem;
    color: #444;
  }

  select {
    flex: 0 0 12rem;
  }
}

.pvz-page__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border: 0;
  background: #ffebee;
  border-radius: 50%;
  color: #c62828;
  cursor: pointer;
  font-size: 1.2rem;
}

.pvz-page__result {
  margin-top: 1.4rem;
  padding: 1.4rem;
  background: #e8f5e9;
  border-radius: 1.4rem;
  color: #2e7d32;

  p {
    font-size: 1.4rem;
    line-height: 1.5;
  }
}

.pvz-page__detail-body {
  display: grid;
  gap: 0.8rem;

  p {
    font-size: 1.4rem;
    color: #444;
  }
}

.pvz-page__primary,
.pvz-page__secondary,
.pvz-page__danger {
  min-height: 4.4rem;
  padding: 0 1.6rem;
  border: 0;
  border-radius: 1.2rem;
  font-size: 1.35rem;
  cursor: pointer;
}

.pvz-page__primary {
  background: $linear-green;
  color: #fff;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.pvz-page__secondary {
  background: #f0f7f1;
  color: #18b536;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pvz-page__danger {
  background: #fff0f0;
  color: #c62828;
}

@media (max-width: 1380px) {
  .pvz-page__filters,
  .pvz-page__add-item {
    flex-direction: column;
  }
}
</style>
