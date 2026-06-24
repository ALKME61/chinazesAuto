<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({ middleware: auth })

type SearchMode = 'vin' | 'params'

const api = useAPI()
const route = useRoute()
const router = useRouter()
const activeMode = ref<SearchMode>(route.query.mode === 'params' ? 'params' : 'vin')

// VIN
const vin = ref('')
const vinLoading = ref(false)
const vinError = ref('')
const vinVehicle = ref<any>(null)
const vinSsd = ref('')
const vinVehicleId = ref('')
const vinBrowseLevels = ref<{ label: string; items: any[] }[]>([])
const vinCurrentItems = computed(() => vinBrowseLevels.value[vinBrowseLevels.value.length - 1]?.items || [])

async function searchVin() {
  if (!vin.value.trim()) return
  vinLoading.value = true; vinError.value = ''
  vinVehicle.value = null; vinSsd.value = ''; vinVehicleId.value = ''
  vinBrowseLevels.value = []
  try {
    const raw: any = await api(`/api/articles/vin/laximo?vin=${encodeURIComponent(vin.value.trim())}`)
    const list = raw?.results || raw
    const v = Array.isArray(list) ? list[0] : (list || {})
    vinVehicle.value = {
      brand: v.brand || v.manufacturer || v.make || '',
      name: v.name || v.model || '',
      catalog: v.catalog || v.catalogue || '',
    }
    vinSsd.value = v.ssd || ''
    vinVehicleId.value = v.vehicleId || v.id || ''
    const browse: any = await api(`/api/articles/vin/browse?vin=${encodeURIComponent(vin.value.trim())}`)
    const rawItems = browse?.categories || browse?.units || browse?.results || browse
    const cats = Array.isArray(rawItems) ? rawItems : []
    if (cats.length) {
      const allUnits: any[] = []
      const ids = cats.map((c: any) => getItemId(c)).filter(Boolean) as string[]
      for (let i = 0; i < Math.min(ids.length, 10); i++) {
        try {
          const d: any = await api(`/api/articles/vin/browse?vin=${encodeURIComponent(vin.value.trim())}&category_id=${ids[i]}`)
          const u = d?.units || d?.parts || d?.results || d
          if (Array.isArray(u)) {
            for (const item of u) {
              const uid = getItemId(item)
              if (uid && !allUnits.some((x: any) => getItemId(x) === uid)) allUnits.push(item)
            }
          }
        } catch {}
      }
      vinBrowseLevels.value = [{ label: `${vinVehicle.value.brand} ${vinVehicle.value.name}`.trim(), items: allUnits.length ? allUnits : cats }]
      router.push({ query: { mode: 'vin', vin: vin.value.trim() } })
    } else {
      vinError.value = 'Нет категорий для этого VIN'
    }
  } catch (e: any) { vinError.value = (e as any)?.data?.message || 'Ошибка поиска' }
  finally { vinLoading.value = false }
}

function getItemId(item: any): string | undefined {
  return item.unitId || item.UnitId || item.UNIT_ID || item.id || item.ID || item.categoryId || item.category_id
}

function getItemImg(item: any): string {
  return item.imageUrl || item.ImageUrl || item.IMAGE_URL || item.image || ''
}

function getItemOem(item: any): string {
  return item.OEM || item.oem || item.Oem || item.articul || item.article_nr || item.ARTICLE_NR || ''
}

async function openVinItem(item: any) {
  const id = getItemId(item)
  if (!id) return
  const oem = getItemOem(item)
  if (oem) { navigateTo(`/articles/search?article=${encodeURIComponent(oem)}`); return }
  const param = 'unit_id'
  vinLoading.value = true
  try {
    const data: any = await api(`/api/articles/vin/browse?vin=${encodeURIComponent(vin.value.trim())}&${param}=${id}`)
    const raw = data?.parts || data?.units || data?.categories || data?.results || data
    const next = Array.isArray(raw) ? raw : []
    if (next.length) {
      vinBrowseLevels.value.push({ label: getItemName(item) || id, items: next })
    } else { const o = getItemOem(item); if (o) navigateTo(`/articles/search?article=${encodeURIComponent(o)}`) }
  } catch {}
  finally { vinLoading.value = false }
}

function goToVinLevel(idx: number) {
  vinBrowseLevels.value = vinBrowseLevels.value.slice(0, idx + 1)
  vinParts.value = []
}

function hasVinChildren(item: any) {
  return !!getItemId(item)
}

function getItemName(item: any): string {
  return item.name || item.Name || item.NAME || item.label || item.Label || ''
}

// Params
const brands = ref<any[]>([])
const brandsLoading = ref(false)
const models = ref<any[]>([])
const modelsLoading = ref(false)
const modifications = ref<any[]>([])
const modsLoading = ref(false)
const categories = ref<any[]>([])
const catsLoading = ref(false)
const catBreadcrumbs = ref<{ str_id: number; name: string }[]>([])
const vinParts = ref<any[]>([])
const carArticles = ref<any[]>([])
const articlesLoading = ref(false)
const articleError = ref('')

// V2 criteria
const criteria = ref<any[]>([])
const criteriaLoading = ref(false)
const selectedFilters = reactive<Record<number, string>>({})
const criteriaChanged = ref(false)
const articlesByBrand = computed(() => {
  const groups: Record<string, any[]> = {}
  for (const art of carArticles.value) {
    const brand = art.brand || 'Другое'
    if (!groups[brand]) groups[brand] = []
    groups[brand].push(art)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

function selectFilter(criId: number, value: string) {
  if (selectedFilters[criId] === value) delete selectedFilters[criId]
  else selectedFilters[criId] = value
  criteriaChanged.value = true
}

function isFilterSelected(criId: number, value: string): boolean {
  return selectedFilters[criId] === value
}

function clearFilters() {
  for (const k of Object.keys(selectedFilters)) delete selectedFilters[Number(k)]
  criteriaChanged.value = false
}

function applyFilters() {
  loadArticles()
}

// Search query refs for each step
const searchQ = reactive<Record<string, string>>({ brand: '', model: '', mod: '', cat: '' })

// URL params
const mfaId = computed(() => { const v = route.query.mfa_id; return v ? Number(v) : undefined })
const msId = computed(() => { const v = route.query.ms_id; return v ? Number(v) : undefined })
const pcId = computed(() => { const v = route.query.pc_id; return v ? Number(v) : undefined })
const ptId = computed(() => { const v = route.query.pt_id; return v ? Number(v) : undefined })
const brandName = computed(() => (route.query.brand as string) || '')
const modelName = computed(() => (route.query.model as string) || '')
const modName = computed(() => (route.query.mod as string) || '')
const catName = computed(() => (route.query.cat as string) || '')

// Filters
const filteredBrands = computed(() => {
  const q = searchQ.brand.toLowerCase().trim()
  if (!q) return brands.value
  return brands.value.filter((b: any) => b.brand.toLowerCase().includes(q))
})
const filteredModels = computed(() => {
  const q = searchQ.model.toLowerCase().trim()
  if (!q) return models.value
  return models.value.filter((m: any) => m.name.toLowerCase().includes(q))
})
const filteredMods = computed(() => {
  const q = searchQ.mod.toLowerCase().trim()
  if (!q) return modifications.value
  return modifications.value.filter((m: any) => `${m.name} ${fuelLabel(m)} ${m.body_type || ''}`.toLowerCase().includes(q))
})

function fuelLabel(m: any): string {
  const map: Record<string, string> = {
    'Электрическ. - дизельное топливо': 'Дизель/Электро', 'Бензин': 'Бензин',
    'Бензин/Электричество': 'Бензин/Электро', 'Дизель': 'Дизель',
  }
  return map[m.fuel_type] || m.fuel_type || ''
}

function navTo(params: Record<string, any>) {
  const clean: Record<string, string> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') clean[k] = String(v)
  }
  clean.mode = 'params'
  router.push({ query: clean })
}

// ───── Params loaders ─────
async function loadBrands() {
  brandsLoading.value = true
  try { brands.value = (await api('/api/articles/cars/brands'))?.results || [] }
  catch { brands.value = [] }
  finally { brandsLoading.value = false }

  if (mfaId.value) {
    const b = brands.value.find((x: any) => x.mfa_id === mfaId.value)
    if (b) await selectBrand(b, true)
  }
}

async function selectBrand(brand: any, fromUrl = false) {
  if (!fromUrl) navTo({ mfa_id: brand.mfa_id, brand: brand.brand })
  modelsLoading.value = true; models.value = []
  try { models.value = (await api(`/api/articles/cars/${brand.mfa_id}/models`))?.results || [] }
  catch { models.value = [] }
  finally { modelsLoading.value = false }

  if (fromUrl && msId.value) {
    const m = models.value.find((x: any) => x.ms_id === msId.value)
    if (m) await selectModel(m, true)
  }
}

async function selectModel(m: any, fromUrl = false) {
  if (!fromUrl) navTo({ mfa_id: mfaId.value, brand: brandName.value, ms_id: m.ms_id, model: m.name })
  modsLoading.value = true; modifications.value = []
  try { modifications.value = (await api(`/api/articles/cars/model/${m.ms_id}/modifications`))?.results || [] }
  catch { modifications.value = [] }
  finally { modsLoading.value = false }

  if (fromUrl && pcId.value) {
    const mod = modifications.value.find((x: any) => x.pc_id === pcId.value)
    if (mod) await selectModification(mod, true)
  }
}

async function selectModification(mod: any, fromUrl = false) {
  if (mod.pc_id) sessionStorage.setItem('pc_id', String(mod.pc_id))
  if (!fromUrl) navTo({ mfa_id: mfaId.value, brand: brandName.value, ms_id: msId.value, model: modelName.value, pc_id: mod.pc_id, mod: mod.name })
  catsLoading.value = true; categories.value = []; catBreadcrumbs.value = []
  try { categories.value = (await api(`/api/articles/cars/vehicle/${mod.pc_id}/categories`))?.results || [] }
  catch { categories.value = [] }
  finally { catsLoading.value = false }
}

function openCategory(cat: any) {
  if (cat.children?.length) {
    catBreadcrumbs.value.push({ str_id: cat.str_id, name: cat.name })
  } else if (cat.pt_ids?.length) {
    navTo({
      mfa_id: mfaId.value, brand: brandName.value,
      ms_id: msId.value, model: modelName.value,
      pc_id: pcId.value, mod: modName.value,
      pt_id: cat.pt_ids[0], cat: cat.name,
    })
  }
}

function goToCatBreadcrumb(idx: number) {
  catBreadcrumbs.value = catBreadcrumbs.value.slice(0, idx + 1)
}

function goBackToCategories() {
  catBreadcrumbs.value = []
  navTo({
    mfa_id: mfaId.value, brand: brandName.value,
    ms_id: msId.value, model: modelName.value,
    pc_id: pcId.value, mod: modName.value,
  })
}

function selectedCats(): any[] {
  let list = categories.value
  for (const bc of catBreadcrumbs.value) {
    const found = list.find(c => c.str_id === bc.str_id)
    if (found?.children) list = found.children
    else break
  }
  return list
}

function openArticle(art: any) {
  const supId = art.sup_id || art.art_sup_id
  if (art.art_id && supId) navigateTo(`/catalog?art_id=${art.art_id}&sup_id=${supId}`)
  else if (art.article_nr) navigateTo(`/articles/search?article=${encodeURIComponent(art.article_nr)}`)
}

onMounted(() => {
  if (route.query.mode === 'vin' && route.query.vin) {
    vin.value = route.query.vin as string
    activeMode.value = 'vin'
    searchVin()
  } else if (mfaId.value) {
    loadBrands()
  }
})

watch([pcId, ptId], async ([pc, pt]) => {
  if (pc && pt) {
    carArticles.value = []
    criteria.value = []
    for (const k of Object.keys(selectedFilters)) delete selectedFilters[Number(k)]
    articleError.value = ''

    criteriaLoading.value = true
    try {
      const data: any = await api(`/api/articles/cars/vehicle/${pc}/category/${pt}/filters`)
      criteria.value = data?.criteria || data?.results || data || []
    } catch { criteria.value = [] }
    finally { criteriaLoading.value = false }

    await loadArticles()
  }
}, { immediate: true })

async function loadArticles() {
  const pc = pcId.value
  const pt = ptId.value
  if (!pc || !pt) return
  carArticles.value = []
  articlesLoading.value = true
  articleError.value = ''
  try {
    const params = new URLSearchParams()
    for (const [criId, val] of Object.entries(selectedFilters)) {
      params.set(`cri_${criId}`, val)
    }
    const qs = params.toString()
    const url = `/api/articles/cars/vehicle/${pc}/category/${pt}/articles${qs ? `?${qs}` : ''}`
    const data: any = await api(url)
    carArticles.value = data?.results || data || []
  } catch (e: any) { articleError.value = (e as any)?.data?.message || 'Ошибка загрузки' }
  finally { articlesLoading.value = false; criteriaChanged.value = false }
}
</script>

<template>
  <main class="cs shop-page">
    <div class="cs__breadcrumbs">
      <NuxtLink to="/">Главная</NuxtLink> &gt; <NuxtLink to="/catalogs">Каталоги</NuxtLink> &gt; <span>Оригинальный каталог</span>
    </div>

    <div class="cs__card">
      <div class="cs__tabs">
        <button type="button" class="cs__tab" :class="{ 'cs__tab--active': activeMode === 'vin' }" @click="activeMode = 'vin'">По VIN</button>
        <button type="button" class="cs__tab" :class="{ 'cs__tab--active': activeMode === 'params' }" @click="activeMode = 'params'; loadBrands()">По параметрам</button>
      </div>

      <!-- ════════ VIN ════════ -->
      <div v-if="activeMode === 'vin'">
        <form class="cs__vin-form" @submit.prevent="searchVin">
          <input v-model="vin" type="text" placeholder="VIN / FRAME" class="cs__vin-input" maxlength="17" required />
          <button type="submit" class="cs__btn" :disabled="vinLoading || vin.trim().length < 17">{{ vinLoading ? 'Поиск...' : 'Найти' }}</button>
        </form>
        <p v-if="vinError" class="cs__error">{{ vinError }}</p>

        <template v-if="vinVehicle">
          <div class="vin-vehicle">
            <strong>{{ vinVehicle.brand }} {{ vinVehicle.name }}</strong>
            <span>Каталог: {{ vinVehicle.catalog }}</span>
          </div>

          <div class="cs__nav">
            <button v-for="(lvl, idx) in vinBrowseLevels" :key="idx" type="button" class="cs__chip" :class="{ 'cs__chip--active': idx === vinBrowseLevels.length - 1 }" @click="goToVinLevel(idx)">{{ lvl.label }}</button>
          </div>

          <div v-if="vinLoading" class="cs__center">Загрузка...</div>
          <div v-else-if="!vinCurrentItems.length && !vinLoading" class="cs__center">Нет данных</div>
          <div v-else class="cs__grid">
            <div v-for="(item, idx) in vinCurrentItems" :key="getItemId(item) || idx" class="cs__card-item cs__card-item--img" :class="{ 'cs__card-item--clickable': hasVinChildren(item) || getItemOem(item) }" @click="openVinItem(item)">
              <div v-if="getItemImg(item)" class="cs__card-img cs__card-img--lg"><img :src="`/api/image-proxy?url=${encodeURIComponent(getItemImg(item).replace('%size%', '200'))}`" alt="" loading="lazy" /></div>
              <div class="cs__card-body">
                <strong class="cs__card-title">{{ getItemName(item) }}</strong>
                <span v-if="item.code" class="cs__card-sub">{{ item.code }}</span>
                <span v-if="getItemOem(item)" class="cs__card-oem">OEM: <em>{{ getItemOem(item) }}</em></span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- ════════ ПАРАМЕТРЫ ════════ -->
      <div v-else class="pm">
        <!-- Track -->
        <div class="pm__track">
          <button type="button" class="pm__step" :class="{ 'pm__step--done': !!mfaId, 'pm__step--active': !mfaId }" @click="navTo({})">Марка{{ brandName ? `: ${brandName}` : '' }}</button>
          <span v-if="mfaId" class="pm__sep">›</span>
          <button v-if="mfaId" type="button" class="pm__step" :class="{ 'pm__step--done': !!msId, 'pm__step--active': !msId }" @click="navTo({ mfa_id: mfaId, brand: brandName })">Модель{{ modelName ? `: ${modelName}` : '' }}</button>
          <span v-if="msId" class="pm__sep">›</span>
          <button v-if="msId" type="button" class="pm__step" :class="{ 'pm__step--done': !!pcId, 'pm__step--active': !pcId }" @click="navTo({ mfa_id: mfaId, brand: brandName, ms_id: msId, model: modelName })">Двигатель{{ modName ? `: ${modName}` : '' }}</button>
          <span v-if="pcId" class="pm__sep">›</span>
          <button v-if="pcId" type="button" class="pm__step" :class="{ 'pm__step--done': !!ptId, 'pm__step--active': !ptId }" @click="goBackToCategories">{{ catName || 'Категория' }}</button>
        </div>

        <!-- Step 1: Brands -->
        <div v-if="!mfaId" class="pm__step-content">
          <div class="pm__search-wrap"><input v-model="searchQ.brand" type="text" placeholder="Введите марку..." class="pm__search" autofocus /><span v-if="brandsLoading" class="pm__spin" /></div>
          <div v-if="brandsLoading" class="pm__info">Загрузка марок...</div>
          <div v-else-if="!filteredBrands.length" class="pm__info">Марка не найдена</div>
          <div v-else class="pm__drop"><button v-for="b in filteredBrands" :key="b.mfa_id" type="button" class="pm__opt" @click="selectBrand(b)">{{ b.brand }}</button></div>
        </div>

        <!-- Step 2: Models -->
        <div v-else-if="!msId" class="pm__step-content">
          <div class="pm__search-wrap"><input v-model="searchQ.model" type="text" placeholder="Введите модель..." class="pm__search" autofocus /><span v-if="modelsLoading" class="pm__spin" /></div>
          <div v-if="modelsLoading" class="pm__info">Загрузка моделей...</div>
          <div v-else-if="!filteredModels.length" class="pm__info">Модель не найдена</div>
          <div v-else class="pm__drop"><button v-for="m in filteredModels" :key="m.ms_id" type="button" class="pm__opt" @click="selectModel(m)">
            <span class="pm__opt-name">{{ m.name }}</span>
            <span class="pm__opt-sub">{{ (m.year_from || '').slice(0, 4) }}{{ m.year_to ? `–${m.year_to.slice(0, 4)}` : '...' }}</span>
          </button></div>
        </div>

        <!-- Step 3: Modifications -->
        <div v-else-if="!pcId" class="pm__step-content">
          <div class="pm__search-wrap"><input v-model="searchQ.mod" type="text" placeholder="Введите модификацию..." class="pm__search" autofocus /><span v-if="modsLoading" class="pm__spin" /></div>
          <div v-if="modsLoading" class="pm__info">Загрузка модификаций...</div>
          <div v-else-if="!filteredMods.length" class="pm__info">Не найдено</div>
          <div v-else class="pm__drop"><button v-for="mod in filteredMods" :key="mod.pc_id" type="button" class="pm__opt" @click="selectModification(mod)">
            <span class="pm__opt-name">{{ mod.name }}</span>
            <span class="pm__opt-sub">{{ mod.power_kw }}kW · {{ fuelLabel(mod) }} · {{ mod.body_type }} · {{ mod.capacity_l }}L</span>
          </button></div>
        </div>

        <!-- Step 4: Category tree -->
        <div v-else-if="!ptId" class="pm__step-content">
          <div class="pm__search-wrap"><input v-model="searchQ.cat" type="text" placeholder="Поиск категории..." class="pm__search" autofocus /></div>
          <div v-if="catsLoading" class="pm__info">Загрузка категорий...</div>
          <div v-else-if="!selectedCats().length" class="pm__info">Нет категорий</div>
          <div v-else>
            <div class="pm__cat-track">
              <button type="button" class="pm__cat-chip" @click="catBreadcrumbs = []">Категории</button>
              <template v-for="(bc, i) in catBreadcrumbs" :key="bc.str_id">
                <span class="pm__sep">›</span>
                <button type="button" class="pm__cat-chip" @click="goToCatBreadcrumb(i)">{{ bc.name }}</button>
              </template>
            </div>
            <div class="pm__drop">
              <div v-for="cat in selectedCats().filter((c: any) => !searchQ.cat || c.name.toLowerCase().includes(searchQ.cat.toLowerCase()))" :key="cat.str_id" class="pm__cat-item">
                <button type="button" class="pm__opt" @click="openCategory(cat)">
                  <span class="pm__opt-name">{{ cat.name }}</span>
                  <span v-if="cat.children?.length" class="pm__opt-sub">{{ cat.children.length }} подкатегорий</span>
                  <span v-if="cat.pt_ids?.length" class="pm__opt-badge">детали</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Articles -->
        <div v-else>
          <div class="pm__sel">
            <strong>{{ brandName }} {{ modelName }}</strong>
            <span>{{ modName }} · {{ catName }}</span>
            <button type="button" class="pm__back-link" @click="goBackToCategories">← Другие категории</button>
          </div>

          <!-- Filters -->
          <div v-if="criteriaLoading" class="pm__info">Загрузка фильтров...</div>
          <div v-else-if="criteria.length" class="pm__filters">
            <div v-for="c in criteria" :key="c.cri_id" class="pm__filter-block">
              <h4 class="pm__filter-title">{{ c.name }}</h4>
              <div class="pm__filter-values" :class="{ 'pm__filter-values--scroll': c.values.length > 8 }">
                <button
                  v-for="v in c.values"
                  :key="v.value"
                  type="button"
                  class="pm__chip"
                  :class="{ 'pm__chip--active': isFilterSelected(c.cri_id, v.value) }"
                  @click="selectFilter(c.cri_id, v.value)"
                >{{ v.value }}</button>
              </div>
            </div>
            <div class="pm__filter-actions">
              <button type="button" class="pm__btn-apply" :disabled="!criteriaChanged" @click="applyFilters()">Применить фильтры</button>
              <button v-if="Object.keys(selectedFilters).length" type="button" class="pm__btn-clear" @click="clearFilters(); loadArticles()">Сбросить</button>
            </div>
          </div>

          <div v-if="Object.keys(selectedFilters).length && !articlesLoading" class="pm__applied">
            <span class="pm__applied-label">Фильтры:</span>
            <span v-for="(val, criId) in selectedFilters" :key="criId" class="pm__applied-chip">
              {{ criteria.find(c => c.cri_id === Number(criId))?.name || criId }}: {{ val }}
            </span>
          </div>

          <div v-if="articlesLoading" class="pm__info">Загрузка артикулов...</div>
          <div v-else-if="articleError" class="pm__info pm__info--err">{{ articleError }}</div>
          <div v-else-if="!carArticles.length" class="pm__info">Нет артикулов</div>
          <div v-else class="cs__brand-groups">
            <div v-for="[brand, arts] in articlesByBrand" :key="brand" class="cs__brand-group">
              <h3 class="cs__brand-title">{{ brand }}</h3>
              <div class="cs__grid">
                <div v-for="art in arts" :key="art.art_id" class="cs__card-item cs__card-item--clickable" @click="openArticle(art)">
                  <strong class="cs__card-title">{{ art.description || art.article_nr }}</strong>
                  <span class="cs__card-sub">{{ art.article_nr }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.shop-page { width: min(144rem, calc(100% - 4rem)); margin: 0 auto; }
.cs { padding: 3rem 0; display: flex; flex-direction: column; gap: 2rem; }
.cs__breadcrumbs { color: #ababab; font-size: 1.45rem; a { color: #ababab; text-decoration: none; &:hover { color: $green; } } span { color: #656565; } }
.cs__card { background: #fff; border-radius: 2.8rem; padding: 2.8rem; box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05); }
.cs__tabs { display: inline-flex; border-radius: 1rem; overflow: hidden; margin-bottom: 2.4rem; }
.cs__tab { min-width: 14rem; min-height: 4.8rem; padding: 0 2rem; border: 0; background: #1d1d1d; color: #fff; font-size: 1.5rem; font-weight: 600; cursor: pointer; transition: background 0.2s; &--active { background: $green; } }
.cs__vin-form { display: flex; gap: 1.2rem; align-items: center; flex-wrap: wrap; }
.cs__vin-input { flex: 1; min-width: 22rem; min-height: 4.8rem; padding: 0 1.6rem; border: 1px solid #d7d7d7; border-radius: 1.2rem; font-size: 1.6rem; text-transform: uppercase; letter-spacing: 0.1em; &::placeholder { text-transform: none; letter-spacing: normal; color: #ababab; } }
.cs__btn { min-height: 4.8rem; padding: 0 3rem; border: 0; border-radius: 1.2rem; background: $linear-green; color: #fff; font-size: 1.6rem; font-weight: 600; cursor: pointer; &:disabled { opacity: 0.6; cursor: not-allowed; } }
.cs__error { color: #c62828; text-align: center; padding: 1.6rem 0; font-size: 1.4rem; }
.cs__center { text-align: center; color: #999; padding: 2rem 0; font-size: 1.4rem; }
.cs__nav { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.6rem; }
.cs__chip { padding: 0.6rem 1.2rem; border: 1px solid #e0e0e0; border-radius: 2rem; background: #fff; color: #555; font-size: 1.3rem; cursor: pointer; &:hover { border-color: $green; color: $green; } &--active { background: $green; border-color: $green; color: #fff; } }
.cs__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(26rem, 1fr)); gap: 1.2rem; }
.cs__brand-groups { display: flex; flex-direction: column; gap: 2.4rem; margin-top: 1.6rem; }
.cs__brand-group { }
.cs__brand-title { font-size: 1.6rem; font-weight: 700; color: #333; margin-bottom: 0.8rem; padding-bottom: 0.4rem; border-bottom: 2px solid #e8f5e9; }
.cs__card-item { display: flex; flex-direction: column; gap: 0.6rem; padding: 1.4rem; background: #fafafa; border-radius: 1.4rem; transition: background 0.15s; &--clickable { cursor: pointer; &:hover { background: #f2f2f2; } } }
.cs__card-img { display: flex; align-items: center; justify-content: center; min-height: 7rem; background: #fff; border-radius: 1rem; overflow: hidden; img { height: 5rem; object-fit: contain; } }
.cs__card-img--lg { min-height: 14rem; img { height: 12rem; } }
.cs__card-body { display: flex; flex-direction: column; gap: 0.2rem; }
.cs__card-title { font-size: 1.35rem; font-weight: 600; color: #333; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.cs__card-sub { font-size: 1.2rem; color: #999; }
.cs__card-oem { font-size: 1.15rem; color: #888; em { font-style: normal; color: $green; font-weight: 600; } }

/* Params */
.vin-vehicle {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 1.6rem;
  padding: 1.2rem 1.4rem;
  background: #e8f5e9;
  border-radius: 1.2rem;
  strong { font-size: 1.5rem; color: $green; }
  span { font-size: 1.2rem; color: #888; }
}

.pm__track { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2rem; flex-wrap: wrap; }
.pm__sep { color: #ccc; font-size: 1.4rem; }
.pm__step { padding: 0.4rem 1rem; border: 0; border-radius: 2rem; font-size: 1.25rem; cursor: pointer; color: #bbb; background: #f5f5f5; transition: all 0.15s; &--active { background: #e8f5e9; color: $green; font-weight: 600; } &--done { background: $green; color: #fff; } }
.pm__step-content { display: flex; flex-direction: column; gap: 0.8rem; }
.pm__search-wrap { position: relative; display: flex; align-items: center; }
.pm__search { width: 100%; min-height: 4.8rem; padding: 0 1.6rem; border: 2px solid #e0e0e0; border-radius: 1.2rem; font-size: 1.5rem; outline: none; transition: border-color 0.15s; &:focus { border-color: $green; } &::placeholder { color: #bbb; } }
.pm__spin { position: absolute; right: 1.4rem; width: 1.8rem; height: 1.8rem; border: 2px solid #e0e0e0; border-top-color: $green; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.pm__info { text-align: center; color: #999; font-size: 1.4rem; padding: 1.6rem 0; &--err { color: #c62828; } }
.pm__drop { display: flex; flex-direction: column; gap: 0.4rem; max-height: 40rem; overflow-y: auto; border: 1px solid #eee; border-radius: 1.2rem; padding: 0.4rem; }
.pm__opt { display: flex; justify-content: space-between; align-items: center; gap: 0.8rem; padding: 1rem 1.2rem; border: 0; border-radius: 0.8rem; background: transparent; font-size: 1.4rem; text-align: left; cursor: pointer; transition: background 0.1s; &:hover { background: #f0f7f0; } }
.pm__opt-name { font-weight: 500; color: #333; }
.pm__opt-sub { font-size: 1.2rem; color: #999; white-space: nowrap; }
.pm__opt-badge { padding: 0.15rem 0.6rem; border-radius: 0.6rem; background: $green; color: #fff; font-size: 1rem; font-weight: 600; white-space: nowrap; }
.pm__cat-track { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; margin-bottom: 1rem; }
.pm__cat-chip { padding: 0.3rem 0.8rem; border: 1px solid #ddd; border-radius: 1.4rem; background: #fff; color: #555; font-size: 1.2rem; cursor: pointer; &:hover { border-color: $green; color: $green; } }
.pm__cat-item { border-bottom: 1px solid #f0f0f0; &:last-child { border-bottom: 0; } }
.pm__sel { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1.6rem; strong { font-size: 1.6rem; font-weight: 600; color: #333; } span { font-size: 1.3rem; color: #888; } }
.pm__back-link { display: inline-block; margin-top: 0.6rem; border: 0; background: none; color: $green; font-size: 1.25rem; cursor: pointer; &:hover { text-decoration: underline; } }

/* Filters */
.pm__filters { display: flex; flex-direction: column; gap: 1.4rem; margin: 1.6rem 0; padding: 1.6rem; background: #fafafa; border-radius: 1.4rem; }
.pm__filter-block { }
.pm__filter-title { font-size: 1.3rem; font-weight: 600; color: #333; margin-bottom: 0.6rem; }
.pm__filter-values { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.pm__filter-values--scroll { max-height: 18rem; overflow-y: auto; }
.pm__chip { padding: 0.5rem 1rem; border: 1px solid #e0e0e0; border-radius: 2rem; background: #fff; font-size: 1.2rem; cursor: pointer; transition: all 0.1s; color: #333; line-height: 1.4; &:hover { border-color: $green; color: $green; } &--active { border-color: $green; background: #e8f5e9; color: $green; font-weight: 600; } }
.pm__filter-actions { display: flex; gap: 0.8rem; align-items: center; margin-top: 0.4rem; }
.pm__btn-apply { min-height: 3.6rem; padding: 0 2rem; border: 0; border-radius: 1rem; background: $linear-green; color: #fff; font-size: 1.4rem; font-weight: 600; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } }
.pm__btn-clear { min-height: 3.6rem; padding: 0 1.4rem; border: 0; border-radius: 1rem; background: #e0e0e0; color: #555; font-size: 1.3rem; cursor: pointer; &:hover { background: #c62828; color: #fff; } }
.pm__applied { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; margin-bottom: 1rem; }
.pm__applied-label { font-size: 1.2rem; color: #888; }
.pm__applied-chip { padding: 0.2rem 0.6rem; background: #e8f5e9; border-radius: 0.6rem; font-size: 1.1rem; color: #2e7d32; white-space: nowrap; }

@media (max-width: 767px) {
  .shop-page { width: calc(100% - 1.6rem); }
  .cs { padding: 1.6rem 0; gap: 1.2rem; }
  .cs__card { padding: 1.6rem; border-radius: 2rem; }
  .cs__tabs { width: 100%; }
  .cs__tab { flex: 1; min-width: 0; font-size: 1.4rem; }
  .cs__vin-form { flex-direction: column; }
  .cs__vin-input { min-width: 0; width: 100%; font-size: 1.4rem; }
  .cs__btn { width: 100%; }
  .cs__grid { grid-template-columns: 1fr; }
  .cs__breadcrumbs { font-size: 1.2rem; }
  .pm__drop { max-height: 28rem; }
}
</style>
