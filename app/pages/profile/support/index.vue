<!-- pages/profile/support/index.vue -->
<template>
  <div class="support-page">
    <div class="support-header">
      <h2>Мои обращения</h2>
      <NuxtLink to="/profile/support/create" class="btn-create">
        + Создать обращение
      </NuxtLink>
    </div>

    <!-- Загрузка -->
    <div v-if="isLoading" class="support-loading">
      <div class="spinner"></div>
      <p>Загрузка обращений...</p>
    </div>

    <!-- Контент когда загрузилось -->
    <template v-else>
      <!-- Поиск (всегда показываем если есть тикеты) -->
      <div v-if="tickets.length > 0" class="support-filters">
        <div class="search-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="search-icon">
            <circle cx="11" cy="11" r="8" stroke="#9A9A9A" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="#9A9A9A" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input 
            v-model="search" 
            type="text" 
            placeholder="Поиск по номеру или теме..."
            class="search-input"
            @input="onSearch"
          />
        </div>
      </div>

      <!-- Пусто -->
      <div v-if="tickets.length === 0" class="support-empty">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="#D0D0D0" stroke-width="1.5"/>
            <path d="M8 10C8 7.79086 9.79086 6 12 6C14.2091 6 16 7.79086 16 10C16 12.2091 14.2091 14 12 14V16" stroke="#D0D0D0" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="12" cy="19" r="1" fill="#D0D0D0"/>
          </svg>
        </div>
        <h3>У вас пока нет обращений</h3>
        <p>Если возникли вопросы — создайте обращение, и мы поможем</p>
        <NuxtLink to="/profile/support/create" class="btn-create-empty">
          Создать первое обращение
        </NuxtLink>
      </div>

      <!-- Список тикетов -->
      <div v-if="tickets.length > 0" class="tickets-list">
        <div 
          v-for="ticket in tickets" 
          :key="ticket.id" 
          class="ticket-card"
          @click="navigateTo(`/profile/support/${ticket.id}`)"
        >
          <div class="ticket-card__header">
            <span class="ticket-id">{{ ticket.id }}</span>
            <span class="ticket-status" :class="`status--${ticket.status}`">
              {{ statusLabels[ticket.status] || ticket.status }}
            </span>
          </div>
          
          <h3 class="ticket-subject">{{ ticket.subject }}</h3>
          
          <div class="ticket-card__footer">
            <span class="ticket-category">{{ categoryLabels[ticket.category] || ticket.category }}</span>
            <span class="ticket-date">{{ formatDate((ticket as any).updated_at || ticket.updatedAt) }}</span>
          </div>
        </div>

        <!-- Пагинация -->
        <div v-if="pagination.pages > 1" class="pagination">
          <button 
            :disabled="pagination.page === 1"
            @click="changePage(pagination.page - 1)"
            class="pagination-btn"
          >
            ← Назад
          </button>
          <span class="pagination-info">
            {{ pagination.page }} из {{ pagination.pages }}
          </span>
          <button 
            :disabled="pagination.page === pagination.pages"
            @click="changePage(pagination.page + 1)"
            class="pagination-btn"
          >
            Вперёд →
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Ticket, TicketStatus, TicketCategory } from '~/types/ticket'

const search = ref('')
const tickets = ref<Ticket[]>([])
const isLoading = ref(true)
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 0
})

const statusLabels: Record<string, string> = {
  open: 'Открыт',
  waiting: 'Ожидает',
  in_progress: 'В работе',
  resolved: 'Решён',
  closed: 'Закрыт'
}

const categoryLabels: Record<string, string> = {
  order: 'Заказ',
  payment: 'Оплата',
  delivery: 'Доставка',
  product: 'Товар',
  account: 'Аккаунт'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

let searchTimeout: NodeJS.Timeout
const onSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    loadTickets()
  }, 300)
}

const changePage = (page: number) => {
  pagination.value.page = page
  loadTickets()
}

const loadTickets = async () => {
  try {
    isLoading.value = true
    const query = new URLSearchParams({
      page: String(pagination.value.page),
      limit: String(pagination.value.limit),
      ...(search.value && { search: search.value })
    })

    const data = await $fetch(`/api/tickets?${query}`)
    tickets.value = data.tickets
    pagination.value = data.pagination
  } catch (error) {
    console.error('Ошибка загрузки тикетов:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTickets()
})
</script>

<style scoped lang="scss">
.support-page {
  background: #fff;
  border-radius: 2.4rem;
  padding: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.support-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.4rem;

  h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #2d2d2d;
  }
}

.btn-create {
  padding: 1rem 2rem;
  background: $green;
  color: #fff;
  border-radius: 1.2rem;
  font-size: 1.4rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: darken($green, 5%);
  }
}

.support-filters {
  margin-bottom: 2rem;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1.4rem;
  top: 50%;
  transform: translateY(-50%);
}

.search-input {
  width: 100%;
  padding: 1.2rem 1.4rem 1.2rem 4.4rem;
  border: 2px solid #e0e0e0;
  border-radius: 1.2rem;
  font-size: 1.4rem;
  color: #2d2d2d;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: $green;
  }

  &::placeholder {
    color: #b0b0b0;
  }
}

.support-empty {
  text-align: center;
  padding: 6rem 2rem;

  .empty-icon {
    margin-bottom: 2rem;
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #2d2d2d;
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 1.4rem;
    color: #9a9a9a;
    margin-bottom: 2.4rem;
  }
}

.btn-create-empty {
  display: inline-block;
  padding: 1.2rem 2.4rem;
  background: $green;
  color: #fff;
  border-radius: 1.2rem;
  font-size: 1.5rem;
  font-weight: 500;
  text-decoration: none;
}

.support-loading {
  text-align: center;
  padding: 4rem 0;

  .spinner {
    width: 4rem;
    height: 4rem;
    border: 3px solid #e0e0e0;
    border-top-color: $green;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1.6rem;
  }

  p {
    color: #9a9a9a;
    font-size: 1.4rem;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.ticket-card {
  padding: 1.8rem;
  border: 2px solid #f0f0f0;
  border-radius: 1.6rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: $green;
    background: rgba($green, 0.02);
  }
}

.ticket-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.ticket-id {
  font-size: 1.3rem;
  font-weight: 600;
  color: #666;
  font-family: monospace;
}

.ticket-status {
  padding: 0.4rem 1.2rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-weight: 500;

  &.status--open {
    background: #fff3e0;
    color: #e65100;
  }

  &.status--waiting {
    background: #e3f2fd;
    color: #1565c0;
  }

  &.status--in_progress {
    background: #f3e5f5;
    color: #7b1fa2;
  }

  &.status--resolved {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &.status--closed {
    background: #f5f5f5;
    color: #616161;
  }
}

.ticket-subject {
  font-size: 1.6rem;
  font-weight: 500;
  color: #2d2d2d;
  margin-bottom: 1rem;
}

.ticket-card__footer {
  display: flex;
  align-items: center;
  gap: 1.6rem;
}

.ticket-category {
  font-size: 1.3rem;
  color: #9a9a9a;
  padding: 0.3rem 1rem;
  background: #f5f5f5;
  border-radius: 0.8rem;
}

.ticket-date {
  font-size: 1.3rem;
  color: #b0b0b0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f0f0f0;
}

.pagination-btn {
  padding: 0.8rem 1.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 1rem;
  background: #fff;
  color: #666;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: $green;
    color: $green;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.pagination-info {
  font-size: 1.4rem;
  color: #666;
}
</style>