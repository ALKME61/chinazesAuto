<script setup>
import DriverLinksPvz from '~/components/driver/driverLinks/ui/DriverLinksPvz.vue';

    definePageMeta({
      layout: 'driver'
    })
</script>
<template>
  <main>
    <div class="main-header">
      <h1>Добрый день!</h1>
      <p>Выберите действие</p>
    </div>
    <div class="links-container">
      <DriverLinksPvz />
    </div>
  </main>

</template>



<style scoped lang="scss">
#app {
  background-color: #EBF0F4;

}
   main {
    border-radius: 1.2rem 1.2rem 0 0;
    margin-top: 0.8rem;
    background-color: #ffffff;
    height: 80vh;
    padding: 2.4rem;
    max-width: 900px;
    margin: 0.8rem auto;
    .main-header {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-bottom: 3.2rem;
      h1 {
        color: $orange;
        font-size: 2.4rem;
      }
      p {
        font-size: 1.6rem;
        color: $gray-text;
        font-weight: 300;
      }
    }
   }
</style>