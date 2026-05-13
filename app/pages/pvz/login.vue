<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'

definePageMeta({
  layout: false,
})
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

        <form class="pvz-login__form">
          <label>
            <span>Логин сотрудника</span>
            <input type="text" placeholder="Например, pvz-pushkina-01">
          </label>

          <label>
            <span>Пароль</span>
            <input type="password" placeholder="Введите пароль">
          </label>

          <label>
            <span>ПВЗ</span>
            <select>
              <option>МО, ул. Пушкина 3</option>
              <option>Ростов-на-Дону, ПВЗ №2</option>
            </select>
          </label>

          <NuxtLink class="pvz-login__submit" to="/pvz/issue">
            <PvzIcon name="login" :size="18" />
            <span>Открыть смену</span>
          </NuxtLink>
        </form>
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

  input,
  select {
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

.pvz-login__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
  min-height: 5.4rem;
  margin-top: 0.8rem;
  background: $linear-green;
  border-radius: 1.4rem;
  font-size: 1.55rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  span {
    color: #fff;
  }
}
</style>
