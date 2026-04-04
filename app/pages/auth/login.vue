<script setup>
    definePageMeta({
      layout: '',
    })
</script>
<template>
  <div class="page-full-width">
    <div class="login__wrapper">
      <NuxtLink to="/">
        <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg"/>
      </NuxtLink>
      <div class="login__content">
        <h2>С возвращением</h2>
        <div class="login__form">
          <form action="" method="post">
            <input type="text" class="input" placeholder="Логин, телефон или E-mail">
            <input type="password" class="input" placeholder="Пароль">
            <button @click.prevent="" class="button" type="submit">Продолжить</button>
          </form>
          <p>Нет аккаунта? <span><NuxtLink to="/auth/signin">Зарегистрируйтесь</NuxtLink></span></p>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
  .page-full-width {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .login__wrapper {
      display: flex;
      flex-direction: column;
      gap:$spacing-xl;
      background-color: #fff;
      padding: 30px;
      height: 70vh;
      max-height: 900px;
      width: 30%;
      max-width: 600px;
      border-radius: $radius-xl;
      img {
        width: 55%;
      }
      .login__content {
        display: flex;
        flex-direction: column;
        gap: $spacing-xl;
        h2 {
          font-size: $font-size-h2;
          font-weight: 600;
          color: #292929;
        }
        .login__form {
          display: flex;
          flex-direction: column;
          gap: $spacing-sm;
          form {
            display: flex;
            flex-direction: column;
            gap: $spacing-md;
          }
          p {
            font-size: $font-size-p;
            font-weight: 300;
            color: #525465;
            span {
              a {
                color: #FF8800;
              }
            }
          }
        }
      }
    }
  }
</style>