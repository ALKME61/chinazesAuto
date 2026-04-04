<script setup lang="ts">

</script>

<template>
  <div class="car-search">
    <CarSearch></CarSearch>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.car-search {
  width: $content-width;
  margin: 0 auto;
  margin-bottom: min(50%, 800px);
}
</style>