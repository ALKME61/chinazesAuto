<script setup lang="ts">
import CatalogHeader from './CatalogHeader.vue'
import DesktopHeader from './DesktopHeader.vue'
import MobileHeader from './MobileHeader.vue'
import { useCartStore } from '~~/stores/cart'

const route = useRoute()
const showCatalogMenu = ref(false)

const cartStore = useCartStore()

if (import.meta.client) {
  cartStore.fetchCart()
}

function toggleCatalogMenu() {
  showCatalogMenu.value = !showCatalogMenu.value
}

function closeCatalogMenu() {
  showCatalogMenu.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeCatalogMenu()
  },
)

watch(showCatalogMenu, (value) => {
  if (import.meta.client) {
    document.body.style.overflow = value ? 'hidden' : ''
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <DesktopHeader @toggle-catalog="toggleCatalogMenu" />
  <MobileHeader @toggle-catalog="toggleCatalogMenu" />
  <CatalogHeader :show="showCatalogMenu" @close="closeCatalogMenu" />
</template>
