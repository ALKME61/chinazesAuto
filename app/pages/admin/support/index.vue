<script setup lang="ts">
import type { Ticket, TicketStatus, TicketCategory } from '~/types/ticket'

definePageMeta({ layout: 'admin' })

const search = ref('')
const selectedStatus = ref<TicketStatus | ''>('')
const selectedCategory = ref<TicketCategory | ''>('')
const currentPage = ref(1)
const tickets = ref<Ticket[]>([])
const isLoading = ref(true)
const totalTickets = ref(0)
const totalPages = ref(1)
const limit = 15

const statusOptions: { label: string; value: TicketStatus | '' }[] = [
  { label: 'Все статусы', value: '' },
  { label: 'Открыт', value: 'open' },
  { label: 'Ожидает', value: 'waiting' },
  { label: 'В работе', value: 'in_progress' },
  { label: 'Решён', value: 'resolved' },
  { label: 'Закрыт', value: 'closed' },
]

const categoryOptions: { label: string; value: TicketCategory | '' }[] = [
  { label: 'Все категории', value: '' },
  { label: 'Заказ', value: 'order' },
  { label: 'Оплата', value: 'payment' },
  { label: 'Доставка', value: 'delivery' },
  { label: 'Товар', value: 'product' },
  { label: 'Аккаунт', value: 'account' },
]

const statusLabels: Record<string, string> = {
  open: 'Открыт',
  waiting: 'Ожидает',
  in_progress: 'В работе',
  resolved: 'Решён',
  closed: 'Закрыт',
}

const categoryLabels: Record<string, string> = {
  order: 'Заказ',
  payment: 'Оплата',
  delivery: 'Доставка',
  product: 'Товар',
  account: 'Аккаунт',
}

const priorityLabels: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочный',
}

const fetchTickets = async () => {
  isLoading.value = true
  try {
    const query: Record<string, string | number> = {
      page: currentPage.value,
      limit,
    }
    if (selectedStatus.value) query.status = selectedStatus.value
    if (selectedCategory.value) query.category = selectedCategory.value
    if (search.value.trim()) query.search = search.value.trim()

    const data = await $fetch<{
      tickets: any[]
      pagination: { page: number; limit: number; total: number; pages: number }
    }>('/api/tickets', { query })
    tickets.value = (data.tickets || []).map((t: any) => ({
      ...t,
      createdAt: t.created_at || t.createdAt,
      updatedAt: t.updated_at || t.updatedAt,
      closedAt: t.closed_at || t.closedAt,
    }))
    totalTickets.value = data.pagination?.total || 0
    totalPages.value = data.pagination?.pages || 1
  } catch (e) {
    console.error('Ошибка загрузки тикетов:', e)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (date: string) => {
  if (!date) return '—'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

const getMessageCount = (ticket: Ticket) => ticket.messages?.length || 0

const statusBadgeTone = (status: string) => {
  switch (status) {
    case 'open': return 'orange'
    case 'waiting': return 'blue'
    case 'in_progress': return 'purple'
    case 'resolved': return 'green'
    case 'closed': return 'gray'
    default: return 'gray'
  }
}

const priorityBadgeTone = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'red'
    case 'high': return 'orange'
    case 'medium': return 'blue'
    case 'low': return 'gray'
    default: return 'gray'
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchTickets()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchTickets()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchTickets()
  }
}

let searchTimeout: ReturnType<typeof setTimeout> | null = null
const onSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(applyFilters, 300)
}

watch([selectedStatus, selectedCategory], applyFilters)

onMounted(fetchTickets)
</script>

<template>
  <section class="support-page">
    <div class="support-page__header">
      <div>
        <h1>Обращения</h1>
        <p v-if="!isLoading">Всего обращений: {{ totalTickets }}</p>
      </div>
    </div>

    <div class="support-filters">
      <label class="admin-filter">
        <span>Статус</span>
        <select v-model="selectedStatus">
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>

      <label class="admin-filter">
        <span>Категория</span>
        <select v-model="selectedCategory">
          <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </label>

      <label class="admin-filter admin-filter--search">
        <span>Поиск</span>
        <input
          v-model="search"
          type="text"
          placeholder="По теме или ID тикета..."
          @input="onSearchInput"
        />
      </label>
    </div>

    <div v-if="isLoading" class="support-loading">Загрузка обращений...</div>

    <template v-else-if="tickets.length">
      <div class="support-table">
        <div class="support-table__head">
          <span>ID</span>
          <span>Пользователь</span>
          <span>Тема</span>
          <span>Категория</span>
          <span>Приоритет</span>
          <span>Статус</span>
          <span>Сообщений</span>
          <span>Обновлён</span>
        </div>

        <NuxtLink
          v-for="ticket in tickets"
          :key="ticket.id"
          :to="`/admin/support/${ticket.id}`"
          class="support-table__row"
        >
          <span class="support-table__id">{{ ticket.id }}</span>
          <span class="support-table__user">
            <span class="support-table__user-avatar">{{ ticket.userName?.charAt(0)?.toUpperCase() || '?' }}</span>
            <span class="support-table__user-name">{{ ticket.userName }}</span>
          </span>
          <span class="support-table__subject">{{ ticket.subject }}</span>
          <span>
            <AdminStatusBadge :label="categoryLabels[ticket.category] || ticket.category" tone="gray" />
          </span>
          <span>
            <AdminStatusBadge
              :label="priorityLabels[ticket.priority] || ticket.priority"
              :tone="priorityBadgeTone(ticket.priority)"
            />
          </span>
          <span>
            <AdminStatusBadge
              :label="statusLabels[ticket.status] || ticket.status"
              :tone="statusBadgeTone(ticket.status)"
            />
          </span>
          <span class="support-table__messages">{{ getMessageCount(ticket) }}</span>
          <span class="support-table__date">{{ formatDate(ticket.updatedAt) }}</span>
        </NuxtLink>
      </div>

      <div class="support-pagination">
        <button :disabled="currentPage <= 1" @click="prevPage">Назад</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage >= totalPages" @click="nextPage">Вперёд</button>
      </div>
    </template>

    <div v-else class="support-empty">
      <AdminIcon name="message" :size="48" />
      <p>Обращений не найдено</p>
      <span>Измените параметры фильтрации</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.support-page {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.support-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #434343;
  }

  p {
    margin-top: 0.4rem;
    font-size: 1.5rem;
    color: #6c6c6c;
  }
}

.support-filters {
  display: flex;
  align-items: flex-end;
  gap: 1.4rem;
  flex-wrap: wrap;
}

.admin-filter {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  span {
    font-size: 1.3rem;
    color: #8f8f8f;
  }

  select,
  input {
    height: 4rem;
    padding: 0 1.2rem;
    border: 1px solid #d9d9d9;
    border-radius: 0.8rem;
    background: #fff;
    font-size: 1.4rem;
    color: #4a4a4a;
    min-width: 16rem;

    &:focus {
      outline: none;
      border-color: $green;
    }
  }
}

.admin-filter--search {
  flex: 1;
  min-width: 24rem;

  input {
    width: 100%;
  }
}

.support-loading {
  padding: 4rem 0;
  text-align: center;
  color: #9a9a9a;
  font-size: 1.5rem;
}

.support-table {
  background: #fff;
  border-radius: 1.8rem;
  overflow: hidden;
}

.support-table__head,
.support-table__row {
  display: grid;
  grid-template-columns: 14rem 2fr 2.5fr 1.2fr 1.1fr 1.2fr 0.8fr 1.3fr;
  align-items: center;
  gap: 1rem;
  padding: 0 1.6rem;
}

.support-table__head {
  min-height: 4.8rem;
  font-size: 1.3rem;
  color: #9a9a9a;
  border-bottom: 1px solid #f0f0f0;
}

.support-table__row {
  min-height: 5.6rem;
  font-size: 1.4rem;
  color: #4a4a4a;
  text-decoration: none;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.15s;

  &:hover {
    background: #fafffb;
  }
}

.support-table__id {
  font-family: monospace;
  font-size: 1.3rem;
  color: #666;
}

.support-table__user {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.support-table__user-avatar {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  background: #e8f5e9;
  color: #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.support-table__user-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.support-table__subject {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: #2d2d2d;
}

.support-table__messages {
  text-align: center;
  color: #6c6c6c;
}

.support-table__date {
  color: #9a9a9a;
  font-size: 1.3rem;
}

.support-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;

  button {
    padding: 0.8rem 1.6rem;
    border: 1px solid #d9d9d9;
    border-radius: 0.8rem;
    background: #fff;
    color: #4a4a4a;
    font-size: 1.4rem;
    cursor: pointer;

    &:hover:not(:disabled) {
      border-color: $green;
      color: $green;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 1.4rem;
    color: #6c6c6c;
  }
}

.support-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  padding: 6rem 0;
  background: #fff;
  border-radius: 1.8rem;
  color: #8c8c8c;

  p {
    font-size: 1.6rem;
    color: #6c6c6c;
  }

  span {
    font-size: 1.4rem;
  }
}
</style>
