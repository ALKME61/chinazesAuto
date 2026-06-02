<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({ middleware: auth })

interface ArticleResult {
  art_id: number
  art_sup_id: number
  article_nr: string
  brand: string
  art_des_id: number
  art_complete_des_id: number
  price: string
  price_formatted: string
  description?: string
}

interface ArticleResponse {
  count: number
  results: ArticleResult[]
}

const route = useRoute()
const api = useAPI()

const results = ref<ArticleResult[]>([])
const count = ref(0)
const isLoading = ref(true)
const error = ref('')

async function searchArticles(article: string, brand?: string) {
  isLoading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams({ article })
    if (brand) params.set('brand', brand)

    const data = await api<ArticleResponse>(`/api/articles/search?${params}`)
    results.value = data.results
    count.value = data.count
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Ошибка поиска'
    results.value = []
    count.value = 0
  } finally {
    isLoading.value = false
  }
}

const article = computed(() => {
  const raw = route.query.article
  return Array.isArray(raw) ? raw[0] : raw
})

watch(article, (val) => {
  if (val) searchArticles(val)
  else isLoading.value = false
}, { immediate: true })
</script>

<template>
  <main class="article-search shop-page">
    <div class="article-search__breadcrumbs">
      <NuxtLink to="/">Главная</NuxtLink>
      &gt; <span>Поиск по артикулу</span>
      <template v-if="article">
        &gt; <span>{{ article }}</span>
      </template>
    </div>

    <div v-if="isLoading" class="article-search__loading">Загрузка...</div>

    <div v-else-if="error" class="article-search__error">{{ error }}</div>

    <div v-else-if="!results.length" class="article-search__empty">
      <p>Ничего не найдено</p>
      <span>Попробуйте изменить артикул</span>
    </div>

    <div v-else class="article-search__results">
      <div class="article-search__count">Найдено: {{ count }}</div>
      <ul class="article-search__list">
        <li v-for="item in results" :key="item.art_id" class="article-search__item" @click="navigateTo(`/catalog?art_id=${item.art_id}&sup_id=${item.art_sup_id}`)">
          <span class="article-search__brand">{{ item.brand }}</span>
          <span class="article-search__desc">{{ item.description }}</span>
          <span class="article-search__article">{{ item.article_nr }}</span>
        </li>
      </ul>
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

  a {
    color: #ababab;
    text-decoration: none;

    &:hover {
      color: $green;
    }
  }

  span {
    color: #656565;
  }
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

  p {
    color: #363636;
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0;
  }

  span {
    color: #999;
    font-size: 1.4rem;
  }
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

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: #f9f9f9;
  }
}

.article-search__brand {
  color: #333;
  font-size: 1.5rem;
  font-weight: 500;
}

.article-search__desc {
  color: #9e9e9e;
  font-size: 1.4rem;
  font-weight: 300;
  text-align: center;
  padding: 0 1rem;
}

.article-search__article {
  color: #656565;
  font-size: 1.5rem;
  text-align: right;
}

@media (max-width: 767px) {
  .article-search {
    padding: 1.6rem 0;
  }

  .article-search__item {
    padding: 1rem 0.8rem;
  }
}
</style>
