<template>
  <section class="profile-home">
    <!-- Карточка аккаунта -->
    <article class="profile-home__card profile-home__card--account">
      <!-- Скелетон -->
      <template v-if="isLoading">
        <header class="profile-home__account-head">
          <div class="profile-home__user">
            <div class="profile-home__avatar profile-home__skeleton"></div>
            <div>
              <div class="profile-home__skeleton-text profile-home__skeleton-text--name"></div>
            </div>
          </div>
          <div class="profile-home__ghost-action profile-home__skeleton"></div>
        </header>

        <div class="profile-home__rows">
          <div v-for="i in 3" :key="i" class="profile-home__row">
            <div class="profile-home__skeleton-text profile-home__skeleton-text--label"></div>
            <div>
              <div class="profile-home__skeleton-text profile-home__skeleton-text--value"></div>
              <div class="profile-home__skeleton-text profile-home__skeleton-text--action"></div>
            </div>
          </div>
        </div>
      </template>

      <!-- Реальные данные -->
      <template v-else>
        <header class="profile-home__account-head">
          <div class="profile-home__user">
            <div class="profile-home__avatar">
              {{ userInitial }}
            </div>
            <div>
              <h2>{{ userFullName }}</h2>
            </div>
          </div>

          <button type="button" class="profile-home__ghost-action">
            <NuxtImg src="/icons/Orders.svg" alt="Заказы" />
          </button>
        </header>

        <div class="profile-home__rows">
          <div class="profile-home__row">
            <span>Почта</span>
            <div>
              <strong>{{ maskedEmail }}</strong>
              <button type="button">Изменить почту</button>
            </div>
          </div>

          <div class="profile-home__row">
            <span>Пароль</span>
            <div>
              <strong>*********</strong>
              <button type="button">Изменить пароль</button>
            </div>
          </div>

          <div class="profile-home__row">
            <span>Баланс</span>
            <div>
              <strong>{{ formattedBalance }}</strong>
              <button type="button">Пополнить</button>
            </div>
          </div>
        </div>

        <div class="profile-home__logout">
          <button type="button" class="profile-home__logout-btn" @click="handleLogout">
            <NuxtImg src="/icons/logout.svg" alt="Выйти" />
            <span>Выйти из аккаунта</span>
          </button>
        </div>
      </template>
    </article>

    <!-- Карта ПВЗ (показываем всегда, если есть данные) -->
    <article 
      v-if="authStore.user?.selected_pvz" 
      class="profile-home__card profile-home__card--pickup"
    >
      <header class="profile-home__pickup-head">
        <div class="profile-home__pickup-title">
          <NuxtImg src="/icons/pvzIcon.svg" alt="ПВЗ" />
          <h3>Привязанный пункт выдачи</h3>
        </div>

        <div class="profile-home__pickup-address">
          <NuxtImg src="/icons/geo-pvz.svg" alt="Адрес" />
          <span>{{ pvzAddress }}</span>
        </div>
      </header>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.ts'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(true)

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser()
  }
  isLoading.value = false
})

const userInitial = computed(() => {
  const firstName = authStore.user?.first_name
  return firstName ? firstName.charAt(0).toUpperCase() : 'П'
})

const userFullName = computed(() => {
  const user = authStore.user
  if (!user) return 'Пользователь'
  
  if (user.full_name) return user.full_name
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`
  }
  if (user.first_name) return user.first_name
  
  return 'Пользователь'
})

const maskedEmail = computed(() => {
  const email = authStore.user?.email
  if (!email) return '***@***.***'
  
  const [username, domain] = email.split('@')
  if (!username || !domain) return email
  
  const maskedUsername = username.length > 3 
    ? username.slice(0, 3) + '***' 
    : username.slice(0, 1) + '***'
  
  const domainParts = domain.split('.')
  const maskedDomain = domainParts[0].slice(0, 3) + '***'
  
  return `${maskedUsername}@${maskedDomain}`
})

const formattedBalance = computed(() => {
  const balance = authStore.user?.balance/100
  if (balance === undefined || balance === null) return '0₽'
  
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance
  if (isNaN(numBalance)) return '0₽'
  
  return new Intl.NumberFormat('ru-RU').format(numBalance) + '₽'
})

const pvzAddress = computed(() => {
  const pvz = authStore.user?.selected_pvz
  if (!pvz) return ''
  
  if (typeof pvz === 'object' && pvz.address) {
    return pvz.address
  }
  
  return `ПВЗ #${pvz}`
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}
</script>

<style scoped lang="scss">
.profile-home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-home__card {
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.profile-home__account-head,
.profile-home__pickup-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.6rem;
}

.profile-home__user {
  display: flex;
  align-items: center;
  gap: 1.4rem;

  h2 {
    color: #2d2d2d;
    font-size: 2rem;
    font-weight: 600;
  }
}

.profile-home__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5.4rem;
  height: 5.4rem;
  border-radius: 1.4rem;
  background: #d8d8d8;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
}

.profile-home__ghost-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border: 0;
  border-radius: 1.2rem;
  background: #f5f5f5;
  cursor: pointer;

  img {
    width: 2rem;
  }
}

.profile-home__rows {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  margin-top: 2rem;
}

.profile-home__row {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  span {
    color: #9a9a9a;
    font-size: 1.35rem;
  }

  div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.2rem;
  }

  strong {
    color: #2c2c2c;
    font-size: 2rem;
    font-weight: 500;
  }

  button {
    border: 0;
    background: transparent;
    color: $green;
    font-size: 1.5rem;
    cursor: pointer;
  }
}

// Скелетон-загрузка
.profile-home__skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.profile-home__skeleton-text {
  height: 1.6rem;
  border-radius: 0.8rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;

  &--name {
    width: 18rem;
    height: 2rem;
  }

  &--label {
    width: 8rem;
  }

  &--value {
    width: 14rem;
    height: 2rem;
  }

  &--action {
    width: 10rem;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// Стили для кнопки выхода
.profile-home__logout {
  margin-top: 2.4rem;
  padding-top: 2rem;
  border-top: 1px solid #f0f0f0;
}

.profile-home__logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  padding: 1.2rem;
  border: 1px solid #e0e0e0;
  border-radius: 1.4rem;
  background: #fff;
  color: #666;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  img {
    width: 1.8rem;
    height: 1.8rem;
    opacity: 0.7;
  }

  &:hover {
    background: #f9f9f9;
    border-color: #ccc;
    color: #333;
  }

  &:active {
    background: #f0f0f0;
  }
}

.profile-home__pickup-head {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.profile-home__pickup-title,
.profile-home__pickup-address {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-home__pickup-title h3 {
  color: #2c2c2c;
  font-size: 1.9rem;
  font-weight: 600;
}

.profile-home__pickup-address {
  color: #4c4c4c;
  font-size: 1.55rem;

  img {
    width: 1.8rem;
  }
}

.profile-home__map {
  margin-top: 1.6rem;
  overflow: hidden;
  border-radius: 1.8rem;

  iframe {
    width: 100%;
    height: 28rem;
    border: 0;
  }
}

@media (max-width: 767px) {
  .profile-home {
    gap: 1.6rem;
  }

  .profile-home__card {
    padding: 1.8rem 1.4rem;
    border-radius: 2rem;
  }

  .profile-home__user h2 {
    font-size: 1.8rem;
  }

  .profile-home__avatar {
    width: 4.4rem;
    height: 4.4rem;
    border-radius: 1.2rem;
    font-size: 1.8rem;
  }

  .profile-home__row strong {
    font-size: 1.6rem;
  }

  .profile-home__row button {
    font-size: 1.4rem;
  }

  .profile-home__logout-btn {
    font-size: 1.4rem;
    padding: 1rem;
  }

  .profile-home__map iframe {
    height: 21rem;
  }
}
</style>