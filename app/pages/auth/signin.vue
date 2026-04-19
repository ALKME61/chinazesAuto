<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <main class="auth-page">
    <section class="auth-panel">
      <NuxtLink to="/" class="auth-panel__logo">
        <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип ЧиназесАвто" />
      </NuxtLink>

      <div class="auth-panel__content">
        <h1>Создайте аккаунт</h1>

        <form class="auth-panel__form">
          <input type="text" placeholder="Имя и фамилия">
          <input type="email" placeholder="E-mail">
          <input type="tel" placeholder="Телефон">
          <input type="password" placeholder="Пароль">
          <button type="submit">Зарегистрироваться</button>
        </form>

        <p>
          Уже есть аккаунт?
          <NuxtLink to="/auth/login">Войдите</NuxtLink>
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
  width: min(48rem, 100%);
  padding: 3rem;
  background: #fff;
  border-radius: 3rem;
  box-shadow: 0 24px 60px rgba(28, 30, 32, 0.08);
}

.auth-panel__logo {
  display: inline-flex;
  margin-bottom: 2.6rem;

  img {
    width: min(24rem, 100%);
  }
}

.auth-panel__content {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;

  h1 {
    color: #2f2f2f;
    font-size: 3rem;
    font-weight: 800;
  }

  p {
    color: #7a7a7a;
    font-size: 1.7rem;

    a {
      color: $green;
    }
  }
}

.auth-panel__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  input {
    min-height: 5.4rem;
    padding: 0 1.8rem;
    border: 0;
    border-radius: 1.4rem;
    background: #f5f5f5;
    color: #2b2b2b;
    font-size: 1.6rem;
  }

  button {
    min-height: 5.4rem;
    border: 0;
    border-radius: 1.4rem;
    background: $linear-green;
    color: #fff;
    font-size: 1.75rem;
    font-weight: 600;
  }
}

@media (max-width: 767px) {
  .auth-page {
    padding: 1.8rem;
  }

  .auth-panel {
    width: min(34rem, 100%);
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

    input,
    button {
      min-height: 4.6rem;
      border-radius: 1.2rem;
      font-size: 1.4rem;
    }
  }
}
</style>
