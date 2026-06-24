<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({ middleware: auth })

interface ArticleResult {
  art_id: number; art_sup_id: number; article_nr: string; brand: string
  art_des_id: number; art_complete_des_id: number
  price: string; price_formatted: string; description?: string
}

interface ArticleResponse { count: number; page: number; page_size: number; results: ArticleResult[] }

interface Criterion {
  cri_id: number; name: string; type: string
  values: (string | { value: string; count: number })[]
  values_count?: number
}

const route = useRoute()
const router = useRouter()
const api = useAPI()

const results = ref<ArticleResult[]>([])
const count = ref(0)
const pageSize = ref(20)
const currentPage = ref(0)
const isLoading = ref(true)
const error = ref('')

const criteria = ref<Criterion[]>([])
const criteriaLoading = ref(false)
const selectedCriteria = ref<Record<number, string>>({})

const article = computed(() => { const r = route.query.article; return Array.isArray(r) ? r[0] : r })
const ptId = computed(() => { const r = route.query.pt_id; return Array.isArray(r) ? r[0] : r })
const brand = computed(() => { const r = route.query.brand; return Array.isArray(r) ? r[0] : r })
const pcId = computed(() => { const r = route.query.pc_id; return Array.isArray(r) ? r[0] : r })

const hasCriteria = computed(() => criteria.value.length > 0)

async function fetchCriteria() {
  if (!ptId.value) return
  criteriaLoading.value = true
  try {
    if (pcId.value) {
      const data: any = await api(`/api/articles/cars/vehicle/${pcId.value}/category/${ptId.value}/criteria`)
      criteria.value = data?.results || data || []
    } else {
      try {
        const data: any = await api(`/api/main/category/${ptId.value}/criteria`)
        criteria.value = data?.results || data || []
      } catch {
        criteria.value = []
      }
    }
  } catch { criteria.value = [] }
  finally { criteriaLoading.value = false }
}

async function searchArticles() {
  const params: Record<string, string> = {}
  if (article.value) params.article = article.value
  if (brand.value) params.brand = brand.value
  if (ptId.value) params.pt_id = ptId.value
  if (pcId.value) params.pc_id = pcId.value
  if (currentPage.value) params.page = String(currentPage.value)
  if (!Object.keys(params).length) { isLoading.value = false; return }

  isLoading.value = true
  error.value = ''

  try {
    if (pcId.value && Object.keys(selectedCriteria.value).length) {
      const data: any = await api(`/api/articles/cars/vehicle/${pcId.value}/category/${ptId.value}/search`, {
        method: 'POST',
        body: { criteria: selectedCriteria.value },
      })
      results.value = data?.results || data || []
      count.value = data?.count || results.value.length
    } else {
      const qs = new URLSearchParams(params).toString()
      const data = await api<ArticleResponse>(`/api/articles/search?${qs}`)
      results.value = data.results
      count.value = data.count
      pageSize.value = data.page_size || 20
      currentPage.value = data.page || 0
    }
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Ошибка поиска'
    results.value = []; count.value = 0
  } finally { isLoading.value = false }
}

const searchLabel = computed(() => {
  if (brand.value && ptId.value) return `${brand.value} в категории`
  if (ptId.value) return 'Категория'
  if (brand.value) return `Бренд: ${brand.value}`
  if (article.value) return article.value
  return ''
})

const brandInput = ref('')
const availableBrands = ref<string[]>([])
const totalPages = computed(() => Math.ceil(count.value / pageSize.value) || 1)

const activeFilters = computed(() => {
  const f: { label: string; key: string }[] = []
  if (ptId.value) f.push({ label: `Категория #${ptId.value}`, key: 'pt_id' })
  if (brand.value) f.push({ label: `Бренд: ${brand.value}`, key: 'brand' })
  return f
})

function removeFilter(key: string) {
  const q = { ...route.query }; delete q[key]
  router.replace({ query: q })
}

function setBrand(b: string) {
  const q = { ...route.query, brand: b }
  router.replace({ query: q })
}

function addBrandInput() {
  const b = brandInput.value.trim()
  if (b) { setBrand(b); brandInput.value = '' }
}

function toggleCriterion(criId: number, value: string) {
  if (selectedCriteria.value[criId] === value) {
    delete selectedCriteria.value[criId]
  } else {
    selectedCriteria.value[criId] = value
  }
  searchArticles()
}

function getCriterionValues(c: Criterion): { value: string; count?: number }[] {
  return c.values?.map((v: any) => typeof v === 'string' ? { value: v } : v) || []
}

function goToPage(page: number) {
  currentPage.value = page
  const q = { ...route.query, page: page > 0 ? String(page) : undefined }
  router.replace({ query: q })
  searchArticles()
}

watch([article, ptId, brand, pcId], () => {
  currentPage.value = 0; selectedCriteria.value = {}
  fetchCriteria()
  searchArticles()
}, { immediate: true })

watch(results, (r) => {
  const brands = new Set<string>()
  for (const item of r) if (item.brand) brands.add(item.brand)
  availableBrands.value = [...brands].slice(0, 20)
})
</script>

<template>
  <main class="article-search shop-page">
    <div class="article-search__breadcrumbs">
      <NuxtLink to="/">Главная</NuxtLink>
      &gt; <span>Поиск по артикулу</span>
      <template v-if="searchLabel">&gt; <span>{{ searchLabel }}</span></template>
    </div>

    <div v-if="criteriaLoading" class="article-search__loading">Загрузка параметров...</div>

    <template v-else-if="hasCriteria">
      <div class="article-search__criteria">
        <div v-for="c in criteria" :key="c.cri_id" class="article-search__criterion">
          <strong class="article-search__criterion-name">{{ c.name }}</strong>
          <div class="article-search__criterion-vals">
            <button
              v-for="v in getCriterionValues(c)"
              :key="v.value"
              type="button"
              class="article-search__criterion-btn"
              :class="{ 'article-search__criterion-btn--active': selectedCriteria[c.cri_id] === v.value }"
              @click="toggleCriterion(c.cri_id, v.value)"
            >
              {{ v.value }}
              <small v-if="v.count">{{ v.count }}</small>
            </button>
          </div>
        </div>
      </div>
    </template>

    <div v-if="isLoading" class="article-search__loading">Загрузка...</div>
    <div v-else-if="error" class="article-search__error">{{ error }}</div>

    <div v-else-if="!results.length && !error" class="article-search__empty">
      <p>Ничего не найдено</p>
      <span v-if="ptId">Попробуйте выбрать бренд или добавьте автомобиль в <NuxtLink to="/profile/garage" style="color:#18b536;text-decoration:none;">гараж</NuxtLink></span>
      <span v-else-if="brand">Попробуйте изменить бренд</span>
      <span v-else>Попробуйте изменить артикул</span>
    </div>

    <div v-else-if="results.length" class="article-search__results">
      <div class="article-search__filters">
        <div class="article-search__active-filters">
          <span v-for="f in activeFilters" :key="f.key" class="article-search__filter-chip">
            {{ f.label }}
            <button type="button" class="article-search__filter-remove" @click="removeFilter(f.key)">✕</button>
          </span>
        </div>
        <div v-if="ptId && !brand" class="article-search__brand-filter">
          <input v-model="brandInput" type="text" placeholder="Фильтр по бренду" @keydown.enter.prevent="addBrandInput">
          <button type="button" class="article-search__brand-apply" @click="addBrandInput">OK</button>
        </div>
        <div v-if="availableBrands.length && ptId && !brand" class="article-search__brand-chips">
          <button v-for="b in availableBrands" :key="b" type="button" class="article-search__brand-chip" @click="setBrand(b)">{{ b }}</button>
        </div>
      </div>

      <div class="article-search__count">Найдено: {{ count }}</div>
      <ul class="article-search__list">
        <li v-for="item in results" :key="item.art_id" class="article-search__item" @click="navigateTo(`/catalog?art_id=${item.art_id}&sup_id=${item.art_sup_id}`)">
          <span class="article-search__brand">{{ item.brand }}</span>
          <span class="article-search__desc">{{ item.description }}</span>
          <span class="article-search__article">{{ item.article_nr }}</span>
        </li>
      </ul>
      <div v-if="totalPages > 1" class="article-search__pagination">
        <button :disabled="currentPage === 0" @click="goToPage(currentPage - 1)">‹</button>
        <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button :disabled="currentPage + 1 >= totalPages" @click="goToPage(currentPage + 1)">›</button>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.article-search {
  padding: 3rem 0;
  width: 86.5vw;
  margin: 0 auto;
}

.article-search__breadcrumbs {
  color: #ababab;
  font-size: 1.45rem;
  margin-bottom: 2rem;
  a { color: #ababab; text-decoration: none; &:hover { color: $green; } }
  span { color: #656565; }
}

.article-search__loading {
  min-height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.6rem;
}

.article-search__error {
  padding: 1rem 1.4rem;
  background: #fff0f0;
  color: #c62828;
  font-size: 1.4rem;
  border-radius: 1rem;
}

.article-search__empty {
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  p { color: #363636; font-size: 1.8rem; font-weight: 600; margin: 0; }
  span { color: #999; font-size: 1.4rem; }
}

.article-search__criteria {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  margin-bottom: 1.6rem;
  padding: 2rem;
  background: #fff;
  border-radius: 2.8rem;
}

.article-search__criterion-name {
  display: block;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  color: #555;
}

.article-search__criterion-vals {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.article-search__criterion-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 3.4rem;
  padding: 0 1.2rem;
  background: #f4f7f4;
  border: 1px solid transparent;
  border-radius: 1rem;
  color: #3c3c3c;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: #e8f0e9; }
  small { color: #999; font-size: 1.1rem; }
}

.article-search__criterion-btn--active {
  background: #18b536;
  color: #fff;
  border-color: #18b536;
  small { color: rgba(255,255,255,0.7); }
}

.article-search__results {
  background: #fff;
  border-radius: 2.8rem;
  padding: 2.4rem;
}

.article-search__count {
  color: #838383;
  font-size: 1.45rem;
  margin-bottom: 1.6rem;
}

.article-search__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.article-search__item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s;
  &:last-child { border-bottom: 0; }
  &:hover { background: #f9f9f9; }
}

.article-search__brand { color: #333; font-size: 1.5rem; font-weight: 500; }
.article-search__desc { color: #9e9e9e; font-size: 1.4rem; font-weight: 300; text-align: center; padding: 0 1rem; }
.article-search__article { color: #656565; font-size: 1.5rem; text-align: right; }

.article-search__filters {
  margin-bottom: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-search__active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.article-search__filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 1rem;
  background: #e8f5e9;
  border-radius: 999px;
  font-size: 1.3rem;
  color: #2e7d32;
}

.article-search__filter-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  border: 0;
  background: transparent;
  color: #2e7d32;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
}

.article-search__brand-filter {
  display: flex;
  gap: 0.6rem;
  input {
    flex: 1;
    max-width: 24rem;
    height: 4rem;
    padding: 0 1.2rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1rem;
    font-size: 1.35rem;
    color: #444;
  }
}

.article-search__brand-apply {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 4rem;
  padding: 0 1.4rem;
  background: $linear-green;
  border: 0;
  border-radius: 1rem;
  color: #fff;
  font-size: 1.35rem;
  cursor: pointer;
}

.article-search__brand-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.article-search__brand-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.2rem;
  padding: 0 1.2rem;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  color: #18b536;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: #18b536; color: #fff; border-color: #18b536; }
}

.article-search__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 2rem;
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem; height: 4rem;
    border: 1px solid #e0e0e0;
    border-radius: 1rem;
    background: #fff; color: #333;
    font-size: 2rem; cursor: pointer;
    &:disabled { opacity: 0.3; cursor: not-allowed; }
    &:hover:not(:disabled) { background: #f0f7f1; }
  }
  span { font-size: 1.4rem; color: #666; }
}

@media (max-width: 767px) {
  .article-search { padding: 1.6rem 0; }
  .article-search__item { padding: 1rem 0.8rem; }
}
</style>
