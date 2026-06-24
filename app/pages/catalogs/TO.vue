<script setup lang="ts">
import MainBlock from '~/components/shop/mainBlock/ui/MainBlock.vue'
import { useGarageStore } from '~~/stores/garage'

definePageMeta({ layout: 'default' })

const api = useAPI()
const route = useRoute()
const garageStore = useGarageStore()
const toData = ref<{ title: string; categories?: any[]; brands?: string[] } | null>(null)

onMounted(async () => {
  if (!garageStore.vehicles.length) await garageStore.fetchVehicles()
  try {
    const data: any = await api('/api/main/to-parts')
    toData.value = {
      title: data.title || 'Запчасти для ТО',
      categories: data.categories,
      brands: data.brands || [],
    }
  } catch {}
})

const pcId = computed(() => {
  const fromUrl = route.query.pc_id
  const urlPc = Array.isArray(fromUrl) ? fromUrl[0] : fromUrl
  if (urlPc) return urlPc
  const primary = garageStore.primaryVehicle
  return primary?.pc_id ? String(primary.pc_id) : null
})

const pcIdSource = computed(() => {
  if (route.query.pc_id) return 'url'
  if (garageStore.primaryVehicle?.pc_id) return 'garage'
  return null
})

function navigateCategory(ptId: number) {
  const url = `/articles/search?pt_id=${ptId}${pcId.value ? `&pc_id=${pcId.value}` : ''}`
  navigateTo(url)
}

function navigateBrand(brand: string) {
  const url = `/articles/search?brand=${encodeURIComponent(brand)}${pcId.value ? `&pc_id=${pcId.value}` : ''}`
  navigateTo(url)
}
</script>

<template>
  <main class="catalog-section shop-page">
    <div class="catalog-section__breadcrumbs">Главная страница > <NuxtLink to="/catalogs" style="color:#18b536;text-decoration:none;">Каталоги</NuxtLink> > Каталог для ТО</div>

    <div class="catalog-section__debug">
      pc_id: <strong>{{ pcId || 'null' }}</strong>
      <span v-if="pcIdSource === 'url'">(из URL)</span>
      <span v-else-if="pcIdSource === 'garage'">(из гаража)</span>
      <span v-else-if="pcIdSource === 'garage'">(из гаража)</span>
      <span v-else>(не выбран)</span>
    </div>

    <MainBlock
      v-if="toData"
      :title="toData.title"
      :categories="toData.categories"
      :brands="toData.brands"
      @category-click="navigateCategory"
      @brand-click="navigateBrand"
    />
  </main>
</template>

<style scoped lang="scss">
.shop-page {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.catalog-section {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.catalog-section__breadcrumbs {
  color: #ababab;
  font-size: 1.45rem;
}

.catalog-section__debug {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.2rem;
  background: #f0f7f1;
  border-radius: 1rem;
  font-size: 1.3rem;
  color: #2e7d32;

  strong { font-family: monospace; }
  span { color: #555; font-size: 1.2rem; }
}

@media (max-width: 767px) {
  .shop-page {
    width: calc(100% - 1.6rem);
  }

  .catalog-section {
    gap: 0.8rem;
  }

  .catalog-section__breadcrumbs {
    font-size: 1.2rem;
  }
}
</style>
