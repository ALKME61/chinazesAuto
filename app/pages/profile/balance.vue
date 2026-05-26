<script setup>
import Balance from '~/components/shop/balance/ui/Balance.vue';

import auth from '~/middleware/auth'

definePageMeta({
  middleware: auth
})
</script>
<template>
  <Balance></Balance>
</template>


<style scoped></style>