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
    v-if="name === 'qr'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" />
    <path d="M6.5 6.5H6.51" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
    <path d="M17.5 6.5H17.51" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
    <path d="M6.5 17.5H6.51" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
    <path d="M14 14H17V17H14V14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M20 14V20H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="name === 'phone'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="7" y="2.8" width="10" height="18.4" rx="2.8" stroke="currentColor" stroke-width="1.8" />
    <path d="M10 6H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M12 17.6H12.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'sms'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 6H19C20.1 6 21 6.9 21 8V16C21 17.1 20.1 18 19 18H8L4 21V8C4 6.9 4.9 6 6 6H5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M7.5 10H16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M7.5 13.5H13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'box'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 3.8L19 7.4V16.6L12 20.2L5 16.6V7.4L12 3.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M12 12L19 7.4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M12 12V20.2" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M12 12L5 7.4" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="name === 'history'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M4 4V8H8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M12 8V12.2L14.8 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="name === 'cell'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="16" height="16" rx="2.8" stroke="currentColor" stroke-width="1.8" />
    <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" />
    <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" />
  </svg>

  <svg
    v-else-if="name === 'return'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 7H18C19.1 7 20 7.9 20 9V15C20 16.1 19.1 17 18 17H8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M10 4L5 9L10 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="name === 'truck'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 6H14V15H3V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M14 9H18L21 12V15H14V9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <circle cx="7" cy="17.5" r="1.8" stroke="currentColor" stroke-width="1.8" />
    <circle cx="18" cy="17.5" r="1.8" stroke="currentColor" stroke-width="1.8" />
  </svg>

  <svg
    v-else-if="name === 'warning'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 4L20 18H4L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M12 9V13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M12 16.2H12.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'copy'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="8" y="7" width="11" height="13" rx="2.4" stroke="currentColor" stroke-width="1.8" />
    <path d="M5 16V6.4C5 5.63 5.63 5 6.4 5H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
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
  </svg>

  <svg
    v-else-if="name === 'camera'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 8H8L9.6 6H14.4L16 8H19C20.1 8 21 8.9 21 10V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V10C3 8.9 3.9 8 5 8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <circle cx="12" cy="13.5" r="3.2" stroke="currentColor" stroke-width="1.8" />
  </svg>

  <svg
    v-else-if="name === 'logout'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M13 8L17 12L13 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10 12H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'login'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M11 8L7 12L11 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M7 12H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>
</template>
