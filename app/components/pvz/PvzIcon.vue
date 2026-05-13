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
  <svg v-if="name === 'qr'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_923_6556)">
      <path
        d="M0 0.75C0 0.551088 0.0790176 0.360322 0.21967 0.21967C0.360322 0.0790176 0.551088 0 0.75 0L5.25 0C5.44891 0 5.63968 0.0790176 5.78033 0.21967C5.92098 0.360322 6 0.551088 6 0.75C6 0.948912 5.92098 1.13968 5.78033 1.28033C5.63968 1.42098 5.44891 1.5 5.25 1.5H1.5V5.25C1.5 5.44891 1.42098 5.63968 1.28033 5.78033C1.13968 5.92098 0.948912 6 0.75 6C0.551088 6 0.360322 5.92098 0.21967 5.78033C0.0790176 5.63968 0 5.44891 0 5.25V0.75ZM18 0.75C18 0.551088 18.079 0.360322 18.2197 0.21967C18.3603 0.0790176 18.5511 0 18.75 0L23.25 0C23.4489 0 23.6397 0.0790176 23.7803 0.21967C23.921 0.360322 24 0.551088 24 0.75V5.25C24 5.44891 23.921 5.63968 23.7803 5.78033C23.6397 5.92098 23.4489 6 23.25 6C23.0511 6 22.8603 5.92098 22.7197 5.78033C22.579 5.63968 22.5 5.44891 22.5 5.25V1.5H18.75C18.5511 1.5 18.3603 1.42098 18.2197 1.28033C18.079 1.13968 18 0.948912 18 0.75ZM0.75 18C0.948912 18 1.13968 18.079 1.28033 18.2197C1.42098 18.3603 1.5 18.5511 1.5 18.75V22.5H5.25C5.44891 22.5 5.63968 22.579 5.78033 22.7197C5.92098 22.8603 6 23.0511 6 23.25C6 23.4489 5.92098 23.6397 5.78033 23.7803C5.63968 23.921 5.44891 24 5.25 24H0.75C0.551088 24 0.360322 23.921 0.21967 23.7803C0.0790176 23.6397 0 23.4489 0 23.25V18.75C0 18.5511 0.0790176 18.3603 0.21967 18.2197C0.360322 18.079 0.551088 18 0.75 18ZM23.25 18C23.4489 18 23.6397 18.079 23.7803 18.2197C23.921 18.3603 24 18.5511 24 18.75V23.25C24 23.4489 23.921 23.6397 23.7803 23.7803C23.6397 23.921 23.4489 24 23.25 24H18.75C18.5511 24 18.3603 23.921 18.2197 23.7803C18.079 23.6397 18 23.4489 18 23.25C18 23.0511 18.079 22.8603 18.2197 22.7197C18.3603 22.579 18.5511 22.5 18.75 22.5H22.5V18.75C22.5 18.5511 22.579 18.3603 22.7197 18.2197C22.8603 18.079 23.0511 18 23.25 18ZM6 6H7.5V7.5H6V6Z"
        fill="currentColor" />
      <path d="M10.5 3H3V10.5H10.5V3ZM4.5 4.5H9V9H4.5V4.5ZM7.5 16.5H6V18H7.5V16.5Z" fill="currentColor" />
      <path d="M10.5 13.5H3V21H10.5V13.5ZM4.5 15H9V19.5H4.5V15ZM16.5 6H18V7.5H16.5V6Z" fill="currentColor" />
      <path
        d="M13.5 3H21V10.5H13.5V3ZM15 4.5V9H19.5V4.5H15ZM12 12V15H13.5V16.5H12V18H15V15H16.5V18H18V16.5H21V15H16.5V12H12ZM15 15H13.5V13.5H15V15ZM21 18H19.5V19.5H16.5V21H21V18ZM15 21V19.5H12V21H15Z"
        fill="currentColor" />
      <path d="M18 13.5H21V12H18V13.5Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_923_6556">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>

  </svg>

  <svg v-else-if="name === 'phone'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="2.8" width="10" height="18.4" rx="2.8" stroke="currentColor" stroke-width="1.8" />
    <path d="M10 6H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M12 17.6H12.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
  </svg>

  <svg v-else-if="name === 'sms'" :width="size" :height="size" viewBox="0 0 24 24" fill="none">
    <path d="M7 12H17M7 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M3 20.29V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7.961C7.66123 17 7.36531 17.0675 7.09511 17.1973C6.82491 17.3271 6.58735 17.516 6.4 17.75L4.069 20.664C3.99143 20.7612 3.88556 20.8319 3.76604 20.8664C3.64652 20.9008 3.51926 20.8972 3.40186 20.8561C3.28446 20.815 3.18273 20.7385 3.11073 20.6371C3.03874 20.5357 3.00005 20.4144 3 20.29Z"
      stroke="currentColor" stroke-width="1.5" />
  </svg>

  <svg v-else-if="name === 'box'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 7.5L17 9.5M17 9.5L16.5 9.75L12 12M17 9.5V13M17 9.5L7.5 4.5M12 12L3 7.5M12 12V21.5M15.578 3.382L17.578 4.432C19.729 5.561 20.805 6.125 21.403 7.14C22 8.154 22 9.417 22 11.942V12.059C22 14.583 22 15.846 21.403 16.86C20.805 17.875 19.729 18.44 17.578 19.569L15.578 20.618C13.822 21.539 12.944 22 12 22C11.056 22 10.178 21.54 8.422 20.618L6.422 19.568C4.271 18.439 3.195 17.875 2.597 16.86C2 15.846 2 14.583 2 12.06V11.943C2 9.418 2 8.155 2.597 7.141C3.195 6.126 4.271 5.561 6.422 4.433L8.422 3.383C10.178 2.461 11.056 2 12 2C12.944 2 13.822 2.46 15.578 3.382Z"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  </svg>

  <svg v-else-if="name === 'history'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.636 18.364C7.10845 19.8365 9.04594 20.7528 11.1183 20.9568C13.1906 21.1608 15.2696 20.6399 17.0009 19.4828C18.7322 18.3257 20.0087 16.6041 20.6129 14.6113C21.217 12.6185 21.1115 10.4778 20.3142 8.55414C19.5169 6.63045 18.0772 5.04276 16.2404 4.06164C14.4037 3.08051 12.2835 2.76667 10.2413 3.17358C8.19909 3.58049 6.36116 4.68299 5.04073 6.29318C3.72031 7.90338 2.99909 9.92163 3 12.004V14"
        stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M1 12L3 14L5 12M11 8V13H16" stroke="black" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
  </svg>

  <svg v-else-if="name === 'cell'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2.8" stroke="currentColor" stroke-width="1.8" />
    <path d="M12 4V20" stroke="currentColor" stroke-width="1.8" />
    <path d="M4 12H20" stroke="currentColor" stroke-width="1.8" />
  </svg>

  <svg v-else-if="name === 'return'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 4L3 7L6.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
      stroke-linejoin="round" />
    <path d="M3 7H14.497C17.9385 7 20.861 9.81 20.995 13.25C21.137 16.885 18.1335 20 14.497 20H5.999"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg v-else-if="name === 'truck'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.207 16.455C9.207 17.86 8.095 19 6.724 19C5.353 19 4.241 17.86 4.241 16.454M9.207 16.455C9.207 15.05 8.095 13.909 6.724 13.909C5.353 13.909 4.241 15.049 4.241 16.454M9.207 16.455L14.793 16.454M4.241 16.454H3V6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H13.793C14.0582 5 14.3126 5.10536 14.5001 5.29289C14.6876 5.48043 14.793 5.73478 14.793 6V8.182M14.793 16.454H15.414M14.793 16.454V8.182M14.793 8.182H17.054C17.3207 8.18203 17.5847 8.23539 17.8304 8.33895C18.0762 8.4425 18.2987 8.59416 18.485 8.785L21 11.364V16.454H20.379M20.379 16.454C20.379 17.86 19.268 19 17.897 19C16.526 19 15.414 17.86 15.414 16.454M20.379 16.454C20.379 15.049 19.268 13.909 17.897 13.909C16.526 13.909 15.414 15.049 15.414 16.454"
      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg v-else-if="name === 'warning'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L20 18H4L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <path d="M12 9V13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M12 16.2H12.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
  </svg>

  <svg v-else-if="name === 'copy'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M15 1.25H10.944C9.106 1.25 7.65 1.25 6.511 1.403C5.339 1.561 4.39 1.893 3.641 2.641C2.893 3.39 2.561 4.339 2.403 5.511C2.25 6.651 2.25 8.106 2.25 9.944V16C2.24982 16.8935 2.56866 17.7577 3.1491 18.4369C3.72954 19.1162 4.53343 19.5659 5.416 19.705C5.553 20.469 5.818 21.121 6.348 21.652C6.95 22.254 7.708 22.512 8.608 22.634C9.475 22.75 10.578 22.75 11.945 22.75H15.055C16.422 22.75 17.525 22.75 18.392 22.634C19.292 22.512 20.05 22.254 20.652 21.652C21.254 21.05 21.512 20.292 21.634 19.392C21.75 18.525 21.75 17.422 21.75 16.055V10.945C21.75 9.578 21.75 8.475 21.634 7.608C21.512 6.708 21.254 5.95 20.652 5.348C20.121 4.818 19.469 4.553 18.705 4.416C18.5659 3.53343 18.1162 2.72954 17.4369 2.1491C16.7577 1.56866 15.8935 1.24982 15 1.25ZM17.13 4.271C16.9779 3.827 16.6908 3.44166 16.3089 3.16893C15.927 2.89619 15.4693 2.74971 15 2.75H11C9.093 2.75 7.739 2.752 6.71 2.89C5.705 3.025 5.125 3.279 4.702 3.702C4.279 4.125 4.025 4.705 3.89 5.71C3.752 6.739 3.75 8.093 3.75 10V16C3.74971 16.4693 3.89619 16.927 4.16892 17.3089C4.44166 17.6908 4.827 17.9779 5.271 18.13C5.25 17.52 5.25 16.83 5.25 16.055V10.945C5.25 9.578 5.25 8.475 5.367 7.608C5.487 6.708 5.747 5.95 6.348 5.348C6.95 4.746 7.708 4.488 8.608 4.367C9.475 4.25 10.578 4.25 11.945 4.25H15.055C15.83 4.25 16.52 4.25 17.13 4.271ZM7.408 6.41C7.685 6.133 8.073 5.953 8.808 5.854C9.562 5.753 10.564 5.751 11.999 5.751H14.999C16.434 5.751 17.435 5.753 18.191 5.854C18.925 5.953 19.313 6.134 19.59 6.41C19.867 6.687 20.047 7.075 20.146 7.81C20.247 8.564 20.249 9.566 20.249 11.001V16.001C20.249 17.436 20.247 18.437 20.146 19.193C20.047 19.927 19.866 20.315 19.59 20.592C19.313 20.869 18.925 21.049 18.19 21.148C17.435 21.249 16.434 21.251 14.999 21.251H11.999C10.564 21.251 9.562 21.249 8.807 21.148C8.073 21.049 7.685 20.868 7.408 20.592C7.131 20.315 6.951 19.927 6.852 19.192C6.751 18.437 6.749 17.436 6.749 16.001V11.001C6.749 9.566 6.751 8.564 6.852 7.809C6.951 7.075 7.132 6.687 7.408 6.41Z"
      fill="currentColor" />
  </svg>

  <svg v-else-if="name === 'print'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8V4H17V8" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <rect x="5" y="9" width="14" height="7" rx="2" stroke="currentColor" stroke-width="1.8" />
    <path d="M7 14H17V20H7V14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
  </svg>

  <svg v-else-if="name === 'camera'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 8H8L9.6 6H14.4L16 8H19C20.1 8 21 8.9 21 10V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V10C3 8.9 3.9 8 5 8Z"
      stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
    <circle cx="12" cy="13.5" r="3.2" stroke="currentColor" stroke-width="1.8" />
  </svg>

  <svg v-else-if="name === 'logout'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H9" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" />
    <path d="M13 8L17 12L13 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
      stroke-linejoin="round" />
    <path d="M10 12H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>

  <svg v-else-if="name === 'login'" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M15 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H15" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" />
    <path d="M11 8L7 12L11 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
      stroke-linejoin="round" />
    <path d="M7 12H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>
</template>
