<script setup lang="ts">
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

  <svg
    v-else-if="name === 'bell'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 10.2C7 7.33 9.24 5 12 5C14.76 5 17 7.33 17 10.2V13.05C17 13.66 17.2 14.26 17.56 14.75L18.6 16.18C19.13 16.92 18.61 18 17.73 18H6.27C5.39 18 4.87 16.92 5.4 16.18L6.44 14.75C6.8 14.26 7 13.66 7 13.05V10.2Z"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linejoin="round"
    />
    <path d="M10 19C10.42 20.17 11.54 21 12.8 21C14.06 21 15.18 20.17 15.6 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

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
  <svg
    v-else-if="name === 'clients'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.8" />
    <path d="M3.5 18.5C4.3 15.98 6.01 14.5 8 14.5C9.99 14.5 11.7 15.98 12.5 18.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <circle cx="16.5" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8" />
    <path d="M14.5 18.5H20.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'warehouse'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 20V8L12 4L20 8V20" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M9 20V13H15V20" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M8 9.5H8.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
    <path d="M16 9.5H16.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'store'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 9L6 4H18L19 9" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M4.5 9H19.5V12C19.5 13.38 18.38 14.5 17 14.5C15.62 14.5 14.5 13.38 14.5 12C14.5 13.38 13.38 14.5 12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 13.38 8.38 14.5 7 14.5C5.62 14.5 4.5 13.38 4.5 12V9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M6 14.5V20H18V14.5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="name === 'settings'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 8.5C10.07 8.5 8.5 10.07 8.5 12C8.5 13.93 10.07 15.5 12 15.5C13.93 15.5 15.5 13.93 15.5 12C15.5 10.07 13.93 8.5 12 8.5Z" stroke="currentColor" stroke-width="1.8" />
    <path d="M19 12C19 11.49 18.95 10.99 18.84 10.52L20.53 9.2L18.8 6.2L16.79 7.02C16.05 6.44 15.19 6 14.24 5.75L13.95 3.6H10.49L10.2 5.75C9.25 6 8.39 6.44 7.65 7.02L5.64 6.2L3.91 9.2L5.6 10.52C5.49 10.99 5.44 11.49 5.44 12C5.44 12.51 5.49 13.01 5.6 13.48L3.91 14.8L5.64 17.8L7.65 16.98C8.39 17.56 9.25 18 10.2 18.25L10.49 20.4H13.95L14.24 18.25C15.19 18 16.05 17.56 16.79 16.98L18.8 17.8L20.53 14.8L18.84 13.48C18.95 13.01 19 12.51 19 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
  </svg>

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

  <svg
    v-else-if="name === 'edit'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 16.8V20H7.2L17 10.2L13.8 7L4 16.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M12.8 8L16 4.8L19.2 8L16 11.2" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="name === 'print'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 8V4H17V8" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <rect x="5" y="9" width="14" height="7" rx="2" stroke="currentColor" stroke-width="1.8" />
    <path d="M7 14H17V20H7V14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M16 11.5H16.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'download'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 4V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M8.5 10.5L12 14L15.5 10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5 18.5H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

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

  <svg
    v-else-if="name === 'celebrate'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 18L10.5 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M10.5 13.5L13.5 10.5L16.5 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10.5 13.5L12.8 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M17.5 5.5L18.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M20 8L22 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M18.5 10.5L20 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M6 7L7 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

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

  <svg
    v-else-if="name === 'user-edit'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8.5" cy="7.5" r="3" stroke="currentColor" stroke-width="1.8" />
    <path d="M3.5 18.5C4.34 15.86 6.18 14.4 8.4 14.4C10.06 14.4 11.51 15.22 12.48 16.76" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M13.8 19.5L18.9 14.4L20.6 16.1L15.5 21.2H13.8V19.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
  </svg>
</template>
