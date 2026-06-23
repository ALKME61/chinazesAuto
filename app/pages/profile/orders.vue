<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({ middleware: auth })

const api = useAPI()

interface OrderItem {
  id: number
  supplier: string
  article_nr: string
  brand: string
  price: string
  quantity: number
  supplier_order_id: string | null
  supplier_status: string | null
  internal_status: string
  cell: string | null
  art_id: number | null
  tec_doc?: { brand?: string; article_nr?: string; description?: string }
}

interface Order {
  id: number
  status: string
  status_display?: string
  total: string
  items_count?: number
  created_at: string
  items?: OrderItem[]
  detailsFetched?: boolean
}

const orders = ref<Order[]>([])
const isLoading = ref(true)
const error = ref('')
const selectedOrderId = ref<number | null>(null)
const detailLoading = ref(false)

const statusLabels: Record<string, string> = {
  new: 'Новый',
  processing: 'Обрабатывается',
  shipped: 'Отгружен',
  completed: 'Завершён',
  cancelled: 'Отменён',
}

const internalStatusLabels: Record<string, string> = {
  new: 'Новый',
  supplier_shipped: 'Поставщик отгрузил',
  arrived: 'На складе',
  in_transit: 'В пути на ПВЗ',
  ready: 'Готов к выдаче',
  issued: 'Выдан',
}

function statusColor(s: string): string {
  if (s === 'processing') return '#ff9800'
  if (s === 'shipped' || s === 'completed' || s === 'ready' || s === 'arrived') return '#10ae3b'
  if (s === 'cancelled') return '#c62828'
  if (s === 'issued' || s === 'supplier_shipped' || s === 'in_transit') return '#2196f3'
  return '#999'
}

async function fetchOrders() {
  isLoading.value = true
  error.value = ''
  try {
    const data: any = await api('/api/orders')
    orders.value = (Array.isArray(data) ? data : data?.results || []).map((o: any) => ({
      ...o,
      items: o.items || [],
    })) as Order[]
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Ошибка загрузки'
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

async function fetchOrderDetail(order: Order) {
  if (order.detailsFetched) return
  detailLoading.value = true
  try {
    const data: any = await api(`/api/orders/${order.id}`)
    order.items = data.items || []
    order.detailsFetched = true
  } catch {
    order.detailsFetched = true
  } finally {
    detailLoading.value = false
  }
}

function toggleOrder(order: Order) {
  if (selectedOrderId.value === order.id) {
    selectedOrderId.value = null
    return
  }
  selectedOrderId.value = order.id
  if (!order.detailsFetched) fetchOrderDetail(order)
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatPrice(p: string | number) {
  return `${Number(p).toLocaleString('ru-RU')}₽`
}

onMounted(fetchOrders)
</script>

<template>
  <main class="orders-page shop-page">
    <h1 class="orders-page__title">Мои заказы</h1>

    <div v-if="isLoading" class="orders-page__skeleton">
      <div class="skeleton" v-for="n in 3" :key="n" />
    </div>

    <div v-else-if="error" class="orders-page__empty">
      <p>{{ error }}</p>
      <button type="button" @click="fetchOrders">Повторить</button>
    </div>

    <div v-else-if="!orders.length" class="orders-page__empty">
      <p>У вас ещё нет заказов</p>
      <NuxtLink to="/cart">Перейти в корзину</NuxtLink>
    </div>

    <div v-else class="orders-page__list">
      <article v-for="order in orders" :key="order.id" class="order-card card-surface">
        <header class="order-card__header" @click="toggleOrder(order)">
          <div class="order-card__meta">
            <strong class="order-card__number">№{{ order.id }}</strong>
            <span class="order-card__status" :style="{ color: statusColor(order.status) }">{{ order.status_display || statusLabels[order.status] || order.status }}</span>
          </div>
          <div class="order-card__meta">
            <span class="order-card__date">{{ formatDate(order.created_at) }}</span>
            <span class="order-card__count">{{ order.items_count || 0 }} товаров</span>
            <span class="order-card__total">{{ formatPrice(order.total) }}</span>
            <button type="button" class="order-card__expand">{{ selectedOrderId === order.id ? '−' : '+' }}</button>
          </div>
        </header>

        <Transition name="order-expand">
          <div v-if="selectedOrderId === order.id" class="order-card__detail">
            <div v-if="detailLoading && !order.detailsFetched" class="order-card__loading">Загрузка...</div>
            <template v-else-if="order.items?.length">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <div class="order-item__info">
                  <strong class="order-item__name">{{ item.tec_doc?.description || `${item.brand} ${item.article_nr}` }}</strong>
                  <span class="order-item__article">{{ item.brand }} {{ item.article_nr }}</span>
                </div>
                <div class="order-item__statuses">
                  <span class="order-item__badge" :style="{ background: statusColor(item.internal_status) }">{{ internalStatusLabels[item.internal_status] || item.internal_status }}</span>
                  <small v-if="item.supplier_status">{{ item.supplier_status }}</small>
                </div>
                <span class="order-item__price">{{ formatPrice(item.price) }}</span>
              </div>
            </template>
            <div v-else class="order-card__loading">Нет данных о товарах</div>
          </div>
        </Transition>
      </article>
    </div>
  </main>
</template>

<style scoped lang="scss">
.shop-page {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.card-surface {
  background: #fff;
  border-radius: 2.8rem;
  box-shadow: 0 18px 44px rgba(28, 30, 32, 0.05);
}

.orders-page__title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2.4rem;
}

.orders-page__list {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.orders-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  min-height: 30rem;
  padding: 4rem;

  p { color: #656565; font-size: 1.8rem; font-weight: 500; }
  a, button { color: $green; font-size: 1.5rem; background: none; border: 0; cursor: pointer; }
}

.orders-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.orders-page__skeleton .skeleton {
  height: 8rem;
  background: #e8e8e8;
  border-radius: 2.8rem;
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.order-card {
  overflow: hidden;
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.4rem;
  cursor: pointer;
  gap: 1.6rem;
}

.order-card__meta {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.order-card__number {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
}

.order-card__status {
  font-size: 1.4rem;
  font-weight: 600;
}

.order-card__date {
  color: #999;
  font-size: 1.4rem;
}

.order-card__count {
  color: #656565;
  font-size: 1.4rem;
}

.order-card__total {
  font-size: 1.8rem;
  font-weight: 700;
  color: $green;
}

.order-card__expand {
  width: 3.2rem;
  height: 3.2rem;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  font-size: 1.6rem;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-card__detail {
  border-top: 1px solid #f0f0f0;
  padding: 1.6rem 2.4rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.order-card__loading {
  padding: 1.6rem 0;
  text-align: center;
  color: #999;
  font-size: 1.4rem;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child { border-bottom: 0; padding-bottom: 0; }
}

.order-item__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.order-item__name {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-item__article {
  font-size: 1.2rem;
  color: #999;
}

.order-item__statuses {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.order-item__badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 0.6rem;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
}

.order-item__statuses small {
  font-size: 1.1rem;
  color: #999;
}

.order-item__price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #202020;
  white-space: nowrap;
}

.order-expand-enter-active,
.order-expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.order-expand-enter-from,
.order-expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

@media (max-width: 767px) {
  .shop-page { width: calc(100% - 3rem); }
  .order-card__header { flex-direction: column; align-items: stretch; gap: 0.8rem; }
  .order-card__meta { justify-content: space-between; }
  .order-card__detail { padding: 1.2rem 1.6rem 1.6rem; }
  .order-item { flex-wrap: wrap; }
  .order-item__price { margin-left: auto; }
}
</style>
