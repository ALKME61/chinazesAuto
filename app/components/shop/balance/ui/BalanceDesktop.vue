<script setup lang="ts">
import UInput from '~/components/shared/ui/input/ui/UInput.vue'
import Button from '~/components/shared/ui/Button/ui/Button.vue'
import { useAuthStore } from '~~/stores/auth'

const authStore = useAuthStore()
const accountBalance = ref('0 ₽')
const isLoading = ref(true)  // ✅ Добавляем флаг загрузки
const isModalOpen = ref(false)
const customAmount = ref('')
const isPaymentLoading = ref(false)

const amounts = [500, 1000, 3000, 5000, 10000]

const operations = [
  {
    id: '12513642',
    type: 'Покупка',
    amount: '-3000₽',
    amountClass: 'balance-table__amount--negative',
    date: '11.01.2026',
    status: 'Доставлен',
  },
  {
    id: '12513642',
    type: 'Пополнение',
    amount: '+3000₽',
    amountClass: 'balance-table__amount--positive',
    date: '11.01.2026',
    status: 'Доставлен',
  },
]

// ✅ Загружаем данные при монтировании
onMounted(async () => {
  await loadUserData()
})

async function loadUserData() {
  try {
    isLoading.value = true
    
    // Если юзер не загружен — загружаем
    if (!authStore.user) {
      await authStore.fetchUser()
    }
    
    // Обновляем баланс
    if (authStore.user?.balance !== undefined) {
      const balance = authStore.user.balance/100
      const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance
      accountBalance.value = new Intl.NumberFormat('ru-RU').format(numBalance) + ' ₽'
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  } finally {
    isLoading.value = false
  }
}

async function initPayment() {
  if (!customAmount.value) return

  try {
    isPaymentLoading.value = true
    
    const response = await $fetch('/api/payments/init', {
      method: 'POST',
      body: { amount: Number(customAmount.value) * 100 }
    })

    if (response.payment_url) {
      window.open(response.payment_url, '_blank')
    }
    
    if (response.payment_id) {
      startPolling(response.payment_id)
    }

    isModalOpen.value = false
    customAmount.value = ''

  } catch (error) {
    console.error('Ошибка:', error)
  } finally {
    isPaymentLoading.value = false
  }
}

function startPolling(paymentId: string) {
  const checkInterval = setInterval(async () => {
    try {
      const response = await $fetch(`/api/payments/check/${paymentId}`)
      
      if (response.status === 'paid' || response.status === 'success') {
        clearInterval(checkInterval)
        // ✅ Обновляем баланс после успешной оплаты
        await loadUserData()
      }
    } catch (error) {
      console.error('Ошибка проверки платежа:', error)
    }
  }, 3000)

  setTimeout(() => clearInterval(checkInterval), 5 * 60 * 1000)
}
</script>

<template>
  <section class="balance-page">
    <!-- Скелетон при загрузке -->
    <template v-if="isLoading">
      <article class="balance-card">
        <div class="balance-card__top">
          <div class="balance-card__icon">
            <div class="skeleton-circle"></div>
          </div>
          <div class="balance-card__meta">
            <div class="skeleton-text skeleton-text--large"></div>
            <div class="skeleton-text skeleton-text--small"></div>
          </div>
        </div>
        <div class="skeleton-button"></div>
      </article>
    </template>

    <!-- Реальный контент -->
    <template v-else>
      <article class="balance-card">
        <div class="balance-card__top">
          <div class="balance-card__icon">
            <NuxtImg src="/icons/ruble.svg" alt="Иконка баланса" />
          </div>

          <div class="balance-card__meta">
            <strong>{{ accountBalance }}</strong>
            <span>Баланс аккаунта</span>
          </div>
        </div>

        <button class="balance-card__button" type="button" @click="isModalOpen = true">
          Пополнить баланс
        </button>
      </article>
    </template>

    <!-- Модальное окно (без изменений) -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
        <div class="balance-modal">
          <div class="balance-modal__logo">
            <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип ЧиназесАвто" />
          </div>

          <div class="balance-modal__content">
            <h1>Пополнение баланса</h1>

            <form class="balance-modal__form" @submit.prevent="initPayment">
              <UInput type="text" placeholder="Введите сумму пополнения" v-model="customAmount" />

              <div class="amount-quick">
                <button 
                  v-for="amount in amounts" 
                  :key="amount" 
                  type="button"
                  :class="['amount-chip', { active: customAmount === String(amount) }]"
                  @click="customAmount = String(amount)"
                >
                  {{ amount }} ₽
                </button>
              </div>

              <Button 
                background="green" 
                @click="initPayment" 
                :disabled="!customAmount || isPaymentLoading"
              >
                {{ isPaymentLoading ? 'Загрузка...' : 'Оплатить' }}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Таблица операций (без изменений) -->
    <section class="balance-operations">
      <h2>Операции по счёту</h2>

      <div class="balance-table">
        <div class="balance-table__head">
          <span>ID операции</span>
          <span>Тип операции</span>
          <span>Сумма</span>
          <span>Дата</span>
          <span>Статус</span>
        </div>

        <div class="balance-table__body">
          <div 
            v-for="(operation, index) in operations" 
            :key="`${operation.id}-${index}`"
            class="balance-table__row"
          >
            <span>{{ operation.id }}</span>
            <span>{{ operation.type }}</span>
            <span class="balance-table__amount" :class="operation.amountClass">
              {{ operation.amount }}
            </span>
            <span>{{ operation.date }}</span>
            <span>{{ operation.status }}</span>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
// Твои оригинальные стили...
.balance-page {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}

.balance-card,
.balance-table {
  background: #fff;
  border-radius: 20px;
}

.balance-card {
  width: 100%;
  max-width: 36.8rem;
  padding: 2rem 1.8rem 1.8rem;
}

.balance-card__top {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2.2rem;
}

.balance-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.6rem;
  height: 4.6rem;
  flex-shrink: 0;
  border-radius: 50%;

  img {
    width: 4.6rem;
    height: 4.6rem;
  }
}

.balance-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  strong {
    font-size: 2rem;
    font-weight: 500;
    color: #333;
    line-height: 1;
  }

  span {
    font-size: 1.4rem;
    color: #7c7c7c;
    line-height: 1.3;
  }
}

.balance-card__button {
  width: 100%;
  min-height: 4.4rem;
  border: 0;
  border-radius: 0.8rem;
  background: $green;
  font-size: 1.6rem;
  font-weight: 400;
  color: #fff;
  cursor: pointer;
}

// ✅ Стили для скелетона
.skeleton-circle {
  width: 4.6rem;
  height: 4.6rem;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-text {
  border-radius: 0.8rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;

  &--large {
    width: 12rem;
    height: 2rem;
  }

  &--small {
    width: 8rem;
    height: 1.4rem;
    margin-top: 0.5rem;
  }
}

.skeleton-button {
  width: 100%;
  height: 4.4rem;
  border-radius: 0.8rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.balance-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2rem;
    min-width: 0;
}

.balance-card,
.balance-table {
    background: #fff;
    border-radius: 20px;
}

.balance-card {
    width: 100%;
    max-width: 36.8rem;
    padding: 2rem 1.8rem 1.8rem;
}

.balance-card__top {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2.2rem;
}

.balance-card__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.6rem;
    height: 4.6rem;
    flex-shrink: 0;
    border-radius: 50%;

    img {
        width: 4.6rem;
        height: 4.6rem;
    }
}

.balance-card__meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    strong {
        font-size: 2rem;
        font-weight: 500;
        color: #333;
        line-height: 1;
    }

    span {
        font-size: 1.4rem;
        color: #7c7c7c;
        line-height: 1.3;
    }
}

.balance-card__button {
    width: 100%;
    min-height: 4.4rem;
    border: 0;
    border-radius: 0.8rem;
    background: $green;
    font-size: 1.6rem;
    font-weight: 400;
    color: #fff;
    cursor: pointer;
}

.balance-operations {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;

    h2 {
        font-size: 1.8rem;
        font-weight: 600;
        color: #373737;
        line-height: 1.2;
    }
}

.balance-table {
    width: 100%;
    padding: 0 2.6rem;
    overflow: hidden;
}

.balance-table__head,
.balance-table__row {
    display: grid;
    grid-template-columns: 1.2fr 1.4fr 1fr 1fr 1fr;
    gap: 1.6rem;
    align-items: center;
}

.balance-table__head {
    padding: 1.2rem 0;
    border-bottom: 1px solid #ececec;

    span {
        font-size: 1.3rem;
        color: #9b9b9b;
    }
}

.balance-table__body {
    display: flex;
    flex-direction: column;
}

.balance-table__row {
    padding: 1.9rem 0;

    span {
        font-size: 1.5rem;
        color: #434343;
        line-height: 1.35;
    }
}

.balance-table__amount {
    font-weight: 400;
}

.balance-table__amount--negative {
    color: #ff3b30 !important;
}

.balance-table__amount--positive {
    color: $green !important;
}

@media (max-width: 991px) {
    .balance-page {
        display: none;
    }
}

// НОВЫЕ СТИЛИ ТОЛЬКО ДЛЯ МОДАЛКИ
// Модалка в стиле авторизации
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.balance-modal {
  width: min(50em, 100%);
  padding: 3rem;
  background: #fff;
  border-radius: 3rem;

  @media (max-width: 767px) {
    width: min(54rem, 100%);
    padding: 2rem 1.8rem 2.2rem;
    border-radius: 2.4rem;
  }
}

.balance-modal__logo {
  display: inline-flex;
  margin-bottom: 3rem;
  width: 100%;

  img {
    width: 50%;

    @media (max-width: 767px) {
      width: 18rem;
    }
  }

  @media (max-width: 767px) {
    margin-bottom: 2rem;
  }
}

.balance-modal__content {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;

  h1 {
    font-size: 3.2rem;
    font-weight: 600;
    color: #333333;

    @media (max-width: 767px) {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 767px) {
    gap: 1.4rem;
  }
}

.balance-modal__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 767px) {
    gap: 1.2rem;
  }
}

.amount-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.amount-chip {
  padding: 0.8rem 1.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 1.2rem;
  background: #fff;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: $green;
  }

  &.active {
    border-color: $green;
    background: rgba($green, 0.08);
    color: $green;
    font-weight: 600;
  }

  @media (max-width: 767px) {
    font-size: 1.4rem;
    padding: 0.7rem 1.4rem;
  }
}
</style>