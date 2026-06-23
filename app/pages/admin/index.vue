<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const api = useAPI()
const loading = ref(true)
const summary = ref<any>(null)
const ordersStats = ref<any[]>([])
const topProducts = ref<any[]>([])
const orders = ref<any[]>([])
const ordersLoading = ref(true)

async function loadSummary() {
  try {
    const data: any = await api('/api/admin/dashboard/summary')
    summary.value = data
  } catch { summary.value = null }
}

async function loadOrdersStats() {
  try {
    const data: any = await api('/api/admin/stats/orders?granularity=day')
    ordersStats.value = data?.data || []
  } catch { ordersStats.value = [] }
}

async function loadTopProducts() {
  try {
    const data: any = await api('/api/admin/stats/top-products?period=month&limit=5')
    topProducts.value = data?.data || []
  } catch { topProducts.value = [] }
}

async function loadOrders() {
  ordersLoading.value = true
  try {
    const data: any = await api('/api/admin/orders?page_size=10')
    orders.value = data?.results || []
  } catch { orders.value = [] }
  finally { ordersLoading.value = false }
}

onMounted(async () => {
  await Promise.all([loadSummary(), loadOrdersStats(), loadTopProducts(), loadOrders()])
  loading.value = false
})

function formatKopecks(kopecks: number): string {
  return (kopecks / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })
}

function statusTone(status: string): string {
  const map: Record<string, string> = {
    'new': 'orange', 'processing': 'purple', 'delivered': 'green',
    'cancelled': 'red', 'shipped': 'blue', 'supplier_shipped': 'blue',
    'arrived': 'green', 'ready': 'green', 'issued': 'gray',
  }
  return map[status] || 'gray'
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    'new': 'Новый', 'processing': 'В обработке', 'delivered': 'Доставлен',
    'cancelled': 'Отменён', 'shipped': 'Отгружен', 'supplier_shipped': 'У поставщика',
    'arrived': 'На складе', 'ready': 'Готов', 'issued': 'Выдан',
  }
  return map[status] || status
}

const ordersChartData = computed(() =>
  ordersStats.value.map((d: any) => ({
    label: (d.date || '').slice(5),
    value: d.total || 0,
  })),
)
</script>

<template>
  <section class="admin-dashboard">
    <div class="admin-dashboard__heading">
      <h1>Дашборд</h1>
      <p v-if="summary?.period">За период {{ summary.period.from }} — {{ summary.period.to }}</p>
    </div>

    <div v-if="loading" class="admin-dashboard__loading">Загрузка...</div>

    <template v-else-if="summary">
      <div class="admin-dashboard__cards">
        <AdminMetricCard title="Заказы" :value="String(summary.orders?.total || 0)" icon="orders" class="admin-dashboard__card">
          <div class="admin-dashboard__card-meta">
            <span>Сегодня: {{ summary.orders?.today || 0 }}</span>
            <span>В обработке: {{ summary.orders?.processing || 0 }}</span>
            <span>Отменено: {{ summary.orders?.cancelled || 0 }}</span>
          </div>
        </AdminMetricCard>

        <AdminMetricCard title="Выручка" :value="formatKopecks(summary.revenue?.total_kopecks || 0)" accent class="admin-dashboard__card">
          <div class="admin-dashboard__card-meta">
            <span>Сегодня: {{ formatKopecks(summary.revenue?.today_kopecks || 0) }}</span>
            <span>Оплат: {{ summary.revenue?.payments_total || 0 }}</span>
          </div>
        </AdminMetricCard>

        <AdminMetricCard title="Пользователи" :value="String(summary.users?.total || 0)" icon="clients" class="admin-dashboard__card">
          <div class="admin-dashboard__card-meta">
            <span>Новых сегодня: {{ summary.users?.new_today || 0 }}</span>
            <span>С заказами: {{ summary.users?.with_orders || 0 }}</span>
          </div>
        </AdminMetricCard>

        <AdminMetricCard title="Поставщики" :value="String(summary.suppliers?.orders_sent_total || 0)" icon="warehouse" class="admin-dashboard__card">
          <div class="admin-dashboard__card-meta">
            <span>Ошибок: {{ summary.suppliers?.errors || 0 }}</span>
            <span>В обработке: {{ summary.suppliers?.processing || 0 }}</span>
          </div>
        </AdminMetricCard>

        <AdminMetricCard title="Логистика" :value="String(summary.logistics?.boxes_in_transit || 0)" icon="store" class="admin-dashboard__card">
          <div class="admin-dashboard__card-meta">
            <span>Коробок в пути: {{ summary.logistics?.boxes_in_transit || 0 }}</span>
            <span>Активных маршрутов: {{ summary.logistics?.routes_active || 0 }}</span>
          </div>
        </AdminMetricCard>

        <AdminMetricCard title="ПВЗ" :value="String(summary.pvz?.items_ready || 0)" icon="store" class="admin-dashboard__card">
          <div class="admin-dashboard__card-meta">
            <span>Ячеек: {{ summary.pvz?.cells_total || 0 }}/{{ summary.pvz?.cells_occupied || 0 }}</span>
            <span>В пути: {{ summary.pvz?.items_in_transit || 0 }}</span>
          </div>
        </AdminMetricCard>

        <AdminMetricCard title="Баланс" :value="formatKopecks(summary.balance?.total_balance_kopecks || 0)" icon="orders" class="admin-dashboard__card admin-dashboard__card--wide">
          <div class="admin-dashboard__card-meta">
            <span>Пополнений: {{ formatKopecks(summary.balance?.total_payments_kopecks || 0) }}</span>
            <span>Возвратов: {{ formatKopecks(summary.balance?.total_refunds_kopecks || 0) }}</span>
          </div>
        </AdminMetricCard>
      </div>

      <div class="admin-dashboard__charts">
        <section class="admin-panel admin-dashboard__chart">
          <h2>Заказы по дням</h2>
          <AdminAreaChart v-if="ordersChartData.length" :data="ordersChartData" y-suffix="" value-label="Заказы" gradient-id="orders-chart-gradient" color="#10AE3B" />
          <div v-else class="admin-dashboard__chart-empty">Нет данных</div>
        </section>

        <section class="admin-panel admin-dashboard__chart">
          <h2>Топ товаров</h2>
          <div v-if="topProducts.length" class="admin-dashboard__top-list">
            <div v-for="(p, i) in topProducts" :key="p.article_nr" class="admin-dashboard__top-row">
              <span class="admin-dashboard__top-rank">{{ i + 1 }}</span>
              <div class="admin-dashboard__top-info">
                <strong>{{ p.brand }} {{ p.article_nr }}</strong>
                <span>{{ p.orders_count }} заказов · {{ formatKopecks(p.total_kopecks) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="admin-dashboard__chart-empty">Нет данных</div>
        </section>
      </div>

      <section class="admin-panel admin-table">
        <div class="admin-table__head">
          <span>ID</span>
          <span>Пользователь</span>
          <span>ПВЗ</span>
          <span>Товаров</span>
          <span>Статус</span>
          <span>Дата</span>
        </div>

        <div v-if="ordersLoading" class="admin-table__loading">Загрузка заказов...</div>
        <div v-else class="admin-table__rows">
          <div v-for="o in orders" :key="o.id" class="admin-table__row">
            <span>{{ o.id }}</span>
            <span>{{ o.user?.email || '—' }}</span>
            <span>{{ o.pickup_point || '—' }}</span>
            <span>{{ o.items_count || 0 }}</span>
            <div><AdminStatusBadge :label="statusLabel(o.status)" :tone="statusTone(o.status) as any" /></div>
            <span>{{ o.created?.slice(0, 10) }}</span>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="admin-dashboard__loading">Ошибка загрузки данных</div>
  </section>
</template>

<style scoped lang="scss">
.admin-dashboard__heading {
  margin-bottom: 1.8rem;
  h1 { font-size: 3rem; font-weight: 700; color: #434343; }
  p { margin-top: 0.4rem; font-size: 1.6rem; color: #5d5d5d; }
}

.admin-dashboard__loading { text-align: center; padding: 4rem; color: #999; font-size: 1.6rem; }

.admin-dashboard__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 1.4rem;
  margin-bottom: 1.4rem;
}

.admin-dashboard__card--wide { grid-column: span 2; }

.admin-dashboard__card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.2rem;
  margin-top: 0.4rem;
  font-size: 1.2rem;
  span { white-space: nowrap; }
}

.admin-panel { background: #fff; border-radius: 1.8rem; }

.admin-dashboard__charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem;
  margin-bottom: 1.4rem;
}

.admin-dashboard__chart {
  padding: 1.6rem;
  h2 { font-size: 1.5rem; font-weight: 600; color: #4d4d4d; margin-bottom: 1.2rem; }
}

.admin-dashboard__chart-empty { text-align: center; padding: 3rem; color: #bbb; font-size: 1.4rem; }

.admin-dashboard__top-list { display: flex; flex-direction: column; gap: 0.6rem; }

.admin-dashboard__top-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f5f5f5;
  &:last-child { border-bottom: 0; }
}

.admin-dashboard__top-rank {
  width: 2.4rem;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0faf3;
  color: $green;
  font-size: 1.2rem;
  font-weight: 700;
  flex-shrink: 0;
}

.admin-dashboard__top-info {
  min-width: 0;
  strong { display: block; font-size: 1.3rem; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  span { font-size: 1.15rem; color: #999; }
}

.admin-table { padding: 1.6rem; }

.admin-table__head, .admin-table__row {
  display: grid;
  grid-template-columns: 6rem 1.5fr 1.2fr 1fr 1.2fr 1fr;
  align-items: center;
  gap: 1rem;
}

.admin-table__head {
  padding: 0 1.2rem 1.2rem;
  font-size: 1.3rem;
  color: #9a9a9a;
}

.admin-table__row {
  min-height: 4.4rem;
  padding: 0 1.2rem;
  font-size: 1.4rem;
  color: #4a4a4a;
}

.admin-table__loading { text-align: center; padding: 2rem; color: #999; font-size: 1.4rem; }

.admin-table__rows {
  max-height: 40rem;
  overflow-y: auto;
}

@media(max-width: 1200px) {
  .admin-dashboard__charts { grid-template-columns: 1fr; }
  .admin-dashboard__cards { grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr)); }
  .admin-dashboard__card--wide { grid-column: span 1; }
}
</style>
