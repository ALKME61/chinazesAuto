<script setup lang="ts">
import Button from '~/components/shared/ui/Button/ui/Button.vue';
import UInput from '../../ui/input/ui/UInput.vue';
import type { credentials } from './types/loginDataTypes';
import { useAuthStore } from '~~/stores/auth';
import handleLogin from './handleLogin';



const authStore = useAuthStore()

const props = withDefaults(
  defineProps<{ 
    title?: string,
    to?: string
  }>(),
  {
    title: 'С возвращением!'
  }
)

const email = ref('')
const password = ref('')

async function handleFormLogin(email: string, password: string) {
  await handleLogin(email, password)  // импортированная функция
  // Редирект уже внутри handleLogin
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

  <form class="auth-panel__form" @submit.prevent>
    <UInput type="text" placeholder="E-mail" v-model="email" />
    <UInput type="password" placeholder="Пароль" v-model="password" />
    
    <Button 
      :email="email" 
      :password="password"
      @login="handleFormLogin"
    >
      Продолжить
    </Button>
  </form>

        <p>
          Нет аккаунта?
          <NuxtLink to="/auth/signin">Зарегистрируйтесь</NuxtLink>
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
button {
  a {
    color: #fff;
  }
}

.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 3rem 2rem;
}

.auth-panel {
  width: min(50em, 100%);
  height: 80vh;
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
    color: $green;
    font-size: 3.2rem;
    font-weight: 600;
    color: #333333;
  }

  p {
    color: #7a7a7a;
    font-size: 1.7rem;
    font-weight: 300;

    a {
      color: $orange;
    }
  }
}

.auth-panel__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

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

    p {
      font-size: 1.35rem;
    }
  }

  .auth-panel__form {
    gap: 1.2rem;
  }
}
</style>
