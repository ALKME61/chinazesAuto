<script setup lang="ts">
import UInput from '../../ui/input/ui/UInput.vue'
import handleLogin from './handleLogin'
import { validateEmail } from '~/composables/useValidation'

const props = withDefaults(defineProps<{ title?: string; to?: string }>(), { title: 'С возвращением!' })
const email = ref(''); const password = ref(''); const formError = ref('')
const fieldErrors = reactive({ email: '', password: '' }); const isSubmitting = ref(false)

function validateForm(): boolean {
  fieldErrors.email = ''; fieldErrors.password = ''; formError.value = ''; let valid = true
  const emailErr = validateEmail(email.value); if (emailErr) { fieldErrors.email = emailErr; valid = false }
  if (!password.value) { fieldErrors.password = 'Введите пароль'; valid = false }
  return valid
}

async function handleSubmit() {
  if (!validateForm()) return; isSubmitting.value = true
  try { await handleLogin(email.value, password.value) }
  catch {
    formError.value = 'Неверный e-mail или пароль'
  }
  finally { isSubmitting.value = false }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-panel">
      <NuxtLink to="/" class="auth-panel__logo">
        <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип ЧиназесАвто" />
      </NuxtLink>
      <div class="auth-panel__content">
        <h1>{{ props.title }}</h1>
        <form class="auth-panel__form" @submit.prevent="handleSubmit">
          <div class="auth-field">
            <UInput v-model="email" type="text" placeholder="E-mail" />
            <p v-if="fieldErrors.email" class="auth-field__error">{{ fieldErrors.email }}</p>
          </div>
          <div class="auth-field">
            <UInput v-model="password" type="password" placeholder="Пароль" />
            <p v-if="fieldErrors.password" class="auth-field__error">{{ fieldErrors.password }}</p>
          </div>
          <p v-if="formError" class="auth-panel__error">{{ formError }}</p>
          <button type="submit" class="auth-panel__submit" :disabled="isSubmitting"
            :class="{ 'auth-panel__submit--loading': isSubmitting }"><span v-if="isSubmitting"
              class="spinner" /><template v-else>Продолжить</template></button>
        </form>
        <p class="auth-panel__footer">Нет аккаунта? <NuxtLink to="/auth/signin">Зарегистрируйтесь</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 3rem 2rem;
}

.auth-panel {
  width: min(50em, 100%);
  min-height: 60vh;
  padding: 3rem;
  background: #fff;
  border-radius: 3rem;
}

.auth-panel__logo {
  display: inline-flex;
  margin-bottom: 6.2rem;
  width: 100%;

  img {
    width: 50%;
  }
}

.auth-panel__content {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;

  h1 {
    font-size: 3.2rem;
    font-weight: 600;
    color: #333333;
  }
}

.auth-panel__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.auth-field__error {
  margin: 0;
  font-size: 1.2rem;
  color: #c62828;
  padding-left: 0.4rem;
}

.auth-panel__error {
  margin: 0;
  padding: 1rem 1.4rem;
  background: #fff0f0;
  color: #c62828;
  font-size: 1.4rem;
  border-radius: 1rem;
  line-height: 1.4;
}

.auth-panel__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5.4rem;
  border: 0;
  border-radius: 1.2rem;
  background: $linear-green;
  color: #fff;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.auth-panel__submit--loading {
  opacity: 0.8;
}

.auth-panel__footer {
  color: #7a7a7a;
  font-size: 1.7rem;
  font-weight: 300;

  a {
    color: $orange;
  }
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 767px) {
  .auth-page {
    padding: 1.8rem;
  }

  .auth-panel {
    width: min(54rem, 100%);
    padding: 2rem 1.8rem 2.2rem;
    border-radius: 2.4rem;
  }

  .auth-panel__logo {
    margin-bottom: 2rem;

    img {
      width: 18rem;
    }
  }

  .auth-panel__content {
    gap: 1.4rem;

    h1 {
      font-size: 1.8rem;
    }
  }

  .auth-panel__form {
    gap: 1.2rem;
  }

  .auth-panel__submit {
    font-size: 1.6rem;
  }

  .auth-panel__footer {
    font-size: 1.35rem;
  }
}
</style>
