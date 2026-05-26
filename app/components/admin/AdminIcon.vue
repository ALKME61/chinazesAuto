<script setup lang="ts">
import { scrypt } from 'node:crypto';

withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  {
    size: 20,
  },
)
</script>

<template>
  <svg
    v-if="name === 'calendar'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="4.5" width="18" height="16.5" rx="3.5" stroke="currentColor" stroke-width="1.8" />
    <path d="M8 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M3 9.5H21" stroke="currentColor" stroke-width="1.8" />
    <path d="M8 13H8.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
    <path d="M12 13H12.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
    <path d="M16 13H16.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'search'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8" />
    <path d="M16 16L20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>


  <NuxtImg v-else-if="name === 'bell'" src="/icons/notificationAdminIcon.svg" :width="size" :height="size"></NuxtImg>
    <NuxtImg v-else-if="name === 'warehouse'" src="/icons/warehouseIcon.svg" :width="size" :height="size"></NuxtImg>
  <svg
    v-else-if="name === 'chevron-down'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <NuxtImg v-else-if="name === 'orders'" src="/icons/allOrdersIcon.svg" :width="size" :height="size"></NuxtImg>

  <NuxtImg v-else-if="name === 'newOrders'" src="/icons/newOrdersIcon.svg" :width="size" :height="size"></NuxtImg>

  <NuxtImg v-else-if="name === 'inProgress'" src="/icons/inProgressOrder.svg" :width="size" :height="size"></NuxtImg>

  <NuxtImg v-else-if="name === 'shippedOrders'" src="/icons/shippedOrdersIcon.svg" :width="size" :height="size"></NuxtImg>

  <NuxtImg v-else-if="name === 'clients'" src="/icons/clientsIcon.svg" :width="size" :height="size"></NuxtImg>

    <NuxtImg v-else-if="name === 'store'" src="/icons/pvzAdminIcon.svg" :width="size" :height="size"></NuxtImg>

    <NuxtImg v-else-if="name === 'settings'" src="/icons/settingsAdminIcon.svg" :width="size" :height="size"></NuxtImg>
  <svg
    v-else-if="name === 'message'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 18.5H5.5C4.67 18.5 4 17.83 4 17V6.5C4 5.67 4.67 5 5.5 5H18.5C19.33 5 20 5.67 20 6.5V17C20 17.83 19.33 18.5 18.5 18.5H11.5L8 21V18.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M8 9H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M8 12.5H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'package'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 3.8L19 7.5V16.5L12 20.2L5 16.5V7.5L12 3.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M12 12L19 7.5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M12 12V20.2" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M12 12L5 7.5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="name === 'close'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 5L19 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M19 5L5 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

  <NuxtImg v-else-if="name === 'print'" src="/icons/printIcon.svg" :width="size" :height="size"></NuxtImg>

<NuxtImg v-else-if="name === 'download'" src="/icons/excelIcon.svg" :width="size" :height="size"></NuxtImg>

  <svg
    v-else-if="name === 'check-square'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="16" height="16" rx="3" fill="currentColor" />
    <path d="M8 12.3L10.5 14.8L16 9.3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="name === 'square'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4.5" y="4.5" width="15" height="15" rx="3" stroke="currentColor" stroke-width="1.8" />
  </svg>

  <svg
    v-else-if="name === 'chevron-right'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <NuxtImg v-else-if="name === 'celebrate'" src="/icons/celebrateIcon.svg" :width="size" :height="size"></NuxtImg>

  <svg
    v-else-if="name === 'user-plus'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.8" />
    <path d="M3.5 18.5C4.34 15.86 6.18 14.4 8.4 14.4C10.62 14.4 12.46 15.86 13.3 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M17.5 7V13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M14.5 10H20.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'user-minus'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.8" />
    <path d="M3.5 18.5C4.34 15.86 6.18 14.4 8.4 14.4C10.62 14.4 12.46 15.86 13.3 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M14.5 10H20.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

<NuxtImg v-else-if="name === 'user-edit' || name === 'edit'" src="/icons/editIcon.svg" :width="size" :height="size"></NuxtImg>
</template>
