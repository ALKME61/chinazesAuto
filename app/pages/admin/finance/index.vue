<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const api = useAPI()
const route = useRoute()
const tab = ref<string>((route.query.tab as string) || 'transactions')
const loading = ref(true)
const transactions = ref<any[]>([])
const users = ref<any[]>([])
const totalAmount = ref(0)
const totalBalance = ref(0)

async function loadTransactions() {
  try {
    const data: any = await api('/api/admin/balance/transactions')
    transactions.value = data?.results || []
    totalAmount.value = data?.total_amount_kopecks || 0
  } catch { transactions.value = []; totalAmount.value = 0 }
}

async function loadUsers() {
  try {
    const data: any = await api('/api/admin/balance/users')
    users.value = data?.users || []
    totalBalance.value = data?.total_balance_kopecks || 0
  } catch { users.value = [] }
}

onMounted(async () => {
  loading.value = true
  await Promise.all([loadTransactions(), loadUsers()])
  loading.value = false
})

function formatKopecks(k: number): string {
  return (k / 100).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 })
}

const typeLabels: Record<string, string> = {
  payment: 'Пополнение', refund: 'Возврат', order_payment: 'Оплата заказа',
}
const roleLabels: Record<string, string> = {
  super_admin: 'Супер-админ', customer: 'Клиент', pvz_worker: 'ПВЗ', driver: 'Водитель',
}
</script>

<template>
  <section class="admin-finance">
    <div class="admin-finance__heading">
      <h1>Финансы</h1>
    </div>

    <div class="admin-finance__tabs">
      <button type="button" class="admin-finance__tab" :class="{ 'admin-finance__tab--active': tab === 'transactions' }" @click="tab = 'transactions'">Транзакции</button>
      <button type="button" class="admin-finance__tab" :class="{ 'admin-finance__tab--active': tab === 'balances' }" @click="tab = 'balances'">Балансы пользователей</button>
    </div>

    <div v-if="loading" class="admin-finance__loading">Загрузка...</div>

    <!-- Transactions -->
    <template v-else-if="tab === 'transactions'">
      <div class="admin-finance__summary">
        <div class="admin-finance__summary-card">
          <span class="admin-finance__summary-label">Всего транзакций</span>
          <span class="admin-finance__summary-value">{{ transactions.length }}</span>
        </div>
        <div class="admin-finance__summary-card">
          <span class="admin-finance__summary-label">Общая сумма</span>
          <span class="admin-finance__summary-value admin-finance__summary-value--green">{{ formatKopecks(totalAmount) }}</span>
        </div>
      </div>

      <section class="admin-panel admin-table">
        <div class="admin-table__head">
          <span>ID</span>
          <span>Пользователь</span>
          <span>Тип</span>
          <span>Сумма</span>
          <span>Комментарий</span>
          <span>Дата</span>
        </div>

        <div v-if="!transactions.length" class="admin-table__loading">Нет транзакций</div>
        <div v-else class="admin-table__rows">
          <div v-for="t in transactions" :key="t.id" class="admin-table__row">
            <span>{{ t.id }}</span>
            <span>{{ t.user?.email || '—' }}</span>
            <span>{{ typeLabels[t.type] || t.type }}</span>
            <span :class="t.type === 'refund' ? 'admin-finance__amount--negative' : 'admin-finance__amount--positive'">{{ formatKopecks(t.amount) }}</span>
            <span class="admin-finance__comment">{{ t.comment || '—' }}</span>
            <span>{{ t.created?.slice(0, 10) }}</span>
          </div>
        </div>
      </section>
    </template>

    <!-- Balances -->
    <template v-else>
      <div class="admin-finance__summary">
        <div class="admin-finance__summary-card">
          <span class="admin-finance__summary-label">Общий баланс</span>
          <span class="admin-finance__summary-value admin-finance__summary-value--green">{{ formatKopecks(totalBalance) }}</span>
        </div>
        <div class="admin-finance__summary-card">
          <span class="admin-finance__summary-label">Пользователей</span>
          <span class="admin-finance__summary-value">{{ users.length }}</span>
        </div>
      </div>

      <section class="admin-panel admin-table">
        <div class="admin-table__head">
          <span>ID</span>
          <span>Email</span>
          <span>Роль</span>
          <span>Баланс</span>
        </div>

        <div v-if="!users.length" class="admin-table__loading">Нет пользователей</div>
        <div v-else class="admin-table__rows">
          <div v-for="u in users" :key="u.id" class="admin-table__row">
            <span>{{ u.id }}</span>
            <span>{{ u.email }}</span>
            <span>{{ roleLabels[u.role] || u.role }}</span>
            <span>{{ formatKopecks(u.balance || 0) }}</span>
          </div>
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped lang="scss">
.admin-finance__heading {
  margin-bottom: 1.8rem;
  h1 { font-size: 3rem; font-weight: 700; color: #434343; }
}

.admin-finance__tabs {
  display: inline-flex;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.admin-finance__tab {
  min-width: 14rem;
  min-height: 4.2rem;
  padding: 0 2rem;
  border: 0;
  background: #1d1d1d;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &--active { background: $green; }
}

.admin-finance__loading { text-align: center; padding: 4rem; color: #999; font-size: 1.6rem; }

.admin-finance__summary {
  display: flex;
  gap: 1.4rem;
  margin-bottom: 1.4rem;
}

.admin-finance__summary-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.6rem 2rem;
  background: #fff;
  border-radius: 1.8rem;
  min-width: 20rem;
}

.admin-finance__summary-label { font-size: 1.3rem; color: #999; }
.admin-finance__summary-value { font-size: 2.4rem; font-weight: 700; color: #333; }
.admin-finance__summary-value--green { color: $green; }

.admin-panel { background: #fff; border-radius: 1.8rem; }

.admin-table { padding: 1.6rem; }

.admin-table__head, .admin-table__row {
  display: grid;
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
  max-height: 50rem;
  overflow-y: auto;
}

.admin-finance__amount--positive { color: $green; font-weight: 600; }
.admin-finance__amount--negative { color: #e53935; font-weight: 600; }
.admin-finance__comment { color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.admin-table__head:has(> :nth-child(6)),
.admin-table__row:has(> :nth-child(6)) {
  grid-template-columns: 6rem 1.5fr 1fr 1fr 1.5fr 1fr;
}

.admin-table__head:has(> :nth-child(4)):not(:has(> :nth-child(5))),
.admin-table__row:has(> :nth-child(4)):not(:has(> :nth-child(5))) {
  grid-template-columns: 6rem 1.5fr 1fr 1fr;
}
</style>
