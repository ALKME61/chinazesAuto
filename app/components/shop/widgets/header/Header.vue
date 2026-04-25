<script setup lang="ts">
import CatalogHeader from './ui/CatalogHeader.vue'
import DesktopHeader from './ui/DesktopHeader.vue'
import MobileHeader from './ui/MobileHeader.vue'

const route = useRoute()
const showCatalogMenu = ref(false)

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
