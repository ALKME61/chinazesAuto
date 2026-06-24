<script setup lang="ts">
import MainBlock from '~/components/shop/mainBlock/ui/MainBlock.vue'
import { useGarageStore } from '~~/stores/garage'

definePageMeta({ layout: 'default' })
const route = useRoute()
const api = useAPI()

const section = computed(() => route.query.section as string | undefined)

const sections: Record<string, string> = {
  'accessories': 'Аксессуары',
  'tires-wheels': 'Шины и диски',
  'batteries': 'АКБ',
  'chemicals': 'Автохимия',
  'fluids': 'Масла и техжидкости',
  'tools': 'Инструменты',
}

const garageStore = useGarageStore()
const blockData = ref<{ title: string; categories?: any[]; brands?: string[] } | null>(null)
const loading = ref(false)

async function loadSection() {
  if (!section.value || !sections[section.value]) return
  loading.value = true
  try {
    const data: any = await api(`/api/main/${section.value}`)
    blockData.value = {
      title: data.title || sections[section.value],
      categories: data.categories,
      brands: data.brands || [...(data.brands_tires || []), ...(data.brands_wheels || [])],
    }
  } catch { blockData.value = null }
  finally { loading.value = false }
}

onMounted(async () => {
  if (!garageStore.vehicles.length) await garageStore.fetchVehicles()
  loadSection()
})

watch(section, loadSection)

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

const noPcSections = new Set(['fluids', 'chemicals', 'tools', 'accessories', 'tires-wheels'])

const effectivePcId = computed(() => noPcSections.has(section.value || '') ? null : pcId.value)

function navigateCategory(ptId: number) {
  const url = `/articles/search?pt_id=${ptId}${effectivePcId.value ? `&pc_id=${effectivePcId.value}` : ''}`
  navigateTo(url)
}
function navigateBrand(brand: string) {
  const url = `/articles/search?brand=${encodeURIComponent(brand)}${effectivePcId.value ? `&pc_id=${effectivePcId.value}` : ''}`
  navigateTo(url)
}

const pageTitle = computed(() => section.value ? sections[section.value] || 'Каталог' : 'Каталоги')

const categories = [
  { title: 'Оригинальный каталог', image: '/Categories/originalCatalogue.png', to: '/catalogs/original' },
  { title: 'Запчасти для ТО', image: '/Categories/partsForTO.png', to: '/catalogs/TO' },
  { title: 'Аксессуары', image: '/Categories/accessories.png', to: '/catalogs?section=accessories' },
  { title: 'Шины и диски', image: '/Categories/wheelsAndDisks.png', to: '/catalogs?section=tires-wheels' },
  { title: 'АКБ', image: '/Categories/accumulators.png', to: '/catalogs?section=batteries' },
  { title: 'Автохимия', image: '/Categories/autochemistry.png', to: '/catalogs?section=chemicals' },
  { title: 'Масла и техжидкости', image: '/Categories/oil.png', to: '/catalogs?section=fluids' },
  { title: 'Инструменты', image: '/Categories/tools.png', to: '/catalogs?section=tools' },
]
</script>

<template>
  <main class="catalog-home shop-page">
    <template v-if="!section">
      <section class="catalog-home__section">
        <div class="catalog-home__breadcrumbs">Главная страница > Каталоги</div>
        <h1>Каталоги</h1>
        <div class="catalog-home__grid">
          <NuxtLink v-for="category in categories" :key="category.title" :to="category.to" class="catalog-home__card">
            <NuxtImg :src="category.image" :alt="category.title" />
            <span>{{ category.title }}</span>
          </NuxtLink>
        </div>
      </section>
    </template>

    <template v-else>
      <div class="catalog-section__breadcrumbs">Главная страница > <NuxtLink to="/catalogs" style="color:#18b536;text-decoration:none;">Каталоги</NuxtLink> > {{ pageTitle }}</div>

      <div class="catalog-section__debug">
        pc_id: <strong>{{ pcId || 'null' }}</strong>
        <span v-if="pcIdSource === 'url'">(из URL)</span>
        <span v-else-if="pcIdSource === 'garage'">(из гаража)</span>
        <span v-else>(не выбран)</span>
        <span style="color:#999;font-size:1.1rem;">машин в гараже: {{ garageStore.vehicles.length }}, primary: {{ garageStore.primaryVehicle?.id }}, pc: {{ garageStore.primaryVehicle?.pc_id }}</span>
      </div>

      <MainBlock
        v-if="loading"
        title=""
        :loading="true"
      />

      <MainBlock
        v-else-if="blockData"
        :title="blockData.title"
        :categories="blockData.categories"
        :brands="blockData.brands"
        @category-click="navigateCategory"
        @brand-click="navigateBrand"
      />
    </template>
  </main>
</template>

<style scoped lang="scss">
.shop-page {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.catalog-home__section {
  padding: 3.2rem;
  background: #fff;
  border-radius: 2.8rem;
}

.catalog-home__breadcrumbs,
.catalog-section__breadcrumbs {
  margin-bottom: 2rem;
  color: #ababab;
  font-size: 1.45rem;
}

.catalog-home__section h1 {
  margin-bottom: 2.4rem;
  color: #292929;
  font-size: 4rem;
  font-weight: 800;
}

.catalog-home__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
}

.catalog-home__card {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 20rem;
  padding: 1.8rem;
  background: #fafafa;
  border-radius: 2rem;
  color: #464646;
  text-align: center;
  text-decoration: none;

  img {
    position: absolute;
    top: 1.8rem;
    width: 10.5rem;
  }

  span {
    max-width: 12rem;
    font-size: 1.8rem;
    line-height: 1.3;
  }
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

@media (max-width: 991px) {
  .catalog-home__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .shop-page {
    width: calc(100% - 1.6rem);
  }

  .catalog-home__section {
    padding: 1.6rem;
    border-radius: 2rem;
  }

  .catalog-home__breadcrumbs,
  .catalog-section__breadcrumbs {
    margin-bottom: 1.4rem;
    padding: 0 0.2rem;
    font-size: 1.2rem;
  }

  .catalog-home__section h1 {
    margin-bottom: 1.8rem;
    font-size: 1.8rem;
  }

  .catalog-home__grid {
    gap: 1.2rem;
  }

  .catalog-home__card {
    min-height: 13rem;
    border-radius: 1.6rem;

    img {
      top: 1rem;
      width: 6.8rem;
    }

    span {
      max-width: 10rem;
      font-size: 1.35rem;
    }
  }
}
</style>
