<script setup lang="ts">
import { useAuthStore } from '~~/stores/auth'
import PvzIcon from '~/components/pvz/PvzIcon.vue'

definePageMeta({
  layout: false,
})

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Введите email и пароль'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const authStore = useAuthStore()
    await authStore.login({ email: email.value, password: password.value })
    const user = authStore.user
    if (user?.role === 'driver') {
      await navigateTo('/driver')
    } else {
      await navigateTo('/pvz/issue')
    }
  } catch (e: any) {
    error.value = e?.message || 'Неверный email или пароль'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pvz-login">
    <div class="pvz-login__panel">
      <NuxtLink to="/" class="pvz-login__logo">
        <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="ЧиназесАвто" />
      </NuxtLink>

      <div class="pvz-login__content">
        <div class="pvz-login__heading">
          <span>ПВЗ Web App</span>
          <h1>Вход в смену</h1>
        </div>

        <form class="pvz-login__form" @submit.prevent="handleLogin">
          <label>
            <span>Email сотрудника</span>
            <input v-model="email" type="email" placeholder="pvz@chinazesauto.ru">
          </label>

          <label>
            <span>Пароль</span>
            <input v-model="password" type="password" placeholder="Введите пароль">
          </label>

          <p v-if="error" class="pvz-login__error">{{ error }}</p>

          <button type="submit" class="pvz-login__submit" :disabled="loading">
            <PvzIcon name="login" :size="18" />
            <span>{{ loading ? 'Вход...' : 'Открыть смену' }}</span>
          </button>
        </form>

        <div class="pvz-login__links">
          <NuxtLink to="/driver/auth">Войти как водитель</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pvz-login {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 3rem;
  background:
    radial-gradient(circle at top left, rgba(24, 181, 54, 0.07), transparent 26%),
    radial-gradient(circle at bottom right, rgba(24, 181, 54, 0.05), transparent 28%),
    #f5f6f5;
}

.pvz-login__panel {
  width: min(52rem, 100%);
  padding: 3rem;
  background: #fff;
  border-radius: 3rem;
}

.pvz-login__logo {
  display: inline-flex;

  img {
    width: 18rem;
  }
}

.pvz-login__content {
  display: grid;
  gap: 2.4rem;
  margin-top: 2rem;
}

.pvz-login__heading {
  span {
    font-size: 1.25rem;
    color: #18b536;
  }

  h1 {
    margin-top: 0.8rem;
    font-size: 3.2rem;
    font-weight: 700;
    color: #363636;
  }

  p {
    margin-top: 1rem;
    font-size: 1.45rem;
    line-height: 1.55;
    color: #757575;
  }
}

.pvz-login__form {
  display: grid;
  gap: 1.3rem;

  label {
    display: grid;
    gap: 0.7rem;
  }

  span {
    font-size: 1.25rem;
    color: #8a8a8a;
  }

  input {
    width: 100%;
    height: 5.2rem;
    padding: 0 1.6rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1.4rem;
    font-size: 1.45rem;
    color: #454545;
  }
}

.pvz-login__error {
  margin: 0;
  padding: 1rem 1.4rem;
  background: #fff0f0;
  color: #c62828;
  font-size: 1.4rem;
  border-radius: 1rem;
  line-height: 1.4;
}

.pvz-login__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  min-height: 5.4rem;
  margin-top: 0.8rem;
  background: $linear-green;
  border: 0;
  border-radius: 1.4rem;
  font-size: 1.55rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  span {
    color: #fff;
  }
}

.pvz-login__links {
  display: flex;
  justify-content: center;

  a {
    font-size: 1.35rem;
    color: #18b536;
    text-decoration: none;
  }
}
</style>
