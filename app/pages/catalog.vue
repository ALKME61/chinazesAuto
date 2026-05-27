<script setup lang="ts">
import auth from '~/middleware/auth'
import ShopProductCard from '~/components/shop/productCard/ui/ShopProductCard.vue'
import type { CatalogSort } from '~/types/catalog'

definePageMeta({ middleware: auth })

const { products, filters, sort, pagination, isLoading, hasMore, brandOptionsAll, applyFilters, loadMore, setSort, toggleBrand, setPriceRange } = useCatalog()

const showFilters = ref(false)
const brandSearch = ref('')
const priceMinInput = ref('')
const priceMaxInput = ref('')

const filteredBrandOptions = computed(() => {
  if (!brandSearch.value.trim()) return brandOptionsAll
  return brandOptionsAll.filter(b => b.toLowerCase().includes(brandSearch.value.toLowerCase()))
})

const hasActiveFilters = computed(() => filters.value.brands.length > 0 || filters.value.priceMin !== null || filters.value.priceMax !== null)

const sortOptions: { label: string; value: CatalogSort }[] = [
  { label: 'По убыванию', value: 'price_desc' }, { label: 'По возрастанию', value: 'price_asc' },
  { label: 'Популярные', value: 'popular' }, { label: 'Быстрее всего', value: 'fastest' },
]

let priceTimeout: ReturnType<typeof setTimeout> | null = null
const applyPrice = () => {
  if (priceTimeout) clearTimeout(priceTimeout)
  priceTimeout = setTimeout(() => {
    setPriceRange(priceMinInput.value ? Number(priceMinInput.value) : null, priceMaxInput.value ? Number(priceMaxInput.value) : null)
  }, 500)
}

const resetFilters = () => { brandSearch.value = ''; priceMinInput.value = ''; priceMaxInput.value = ''; filters.value.brands = []; applyFilters() }

const categoryTitles: Record<string, string> = { accessories: 'Аксессуары', tires: 'Шины и диски', akb: 'АКБ', chemistry: 'Автохимия', oil: 'Масла и техжидкости', tools: 'Инструменты' }
const formatPrice = (price: number) => `${price.toLocaleString()}₽`
const formatDiscount = (discount: number) => `${discount}%`

const route = useRoute()
const categoryName = computed(() => {
  const raw = Array.isArray(route.query.categoryName) ? route.query.categoryName[0] : route.query.categoryName
  if (!raw || typeof raw !== 'string') return 'АКБ'
  return categoryTitles[raw] ?? raw
})

watch(showFilters, (v) => { if (import.meta.client && window.innerWidth <= 991) document.body.style.overflow = v ? 'hidden' : '' })
onBeforeUnmount(() => { if (import.meta.client) document.body.style.overflow = '' })
watch(() => route.fullPath, () => { showFilters.value = false })
</script>

<template>
  <main class="catalog-page shop-page">
    <div class="catalog-page__breadcrumbs">Главная страница &gt; BMW V (E39) 2.0i &gt; {{ categoryName }}</div>
    <div class="catalog-page__layout">
      <Transition name="catalog-filters-fade">
        <div v-if="showFilters" class="catalog-page__mobile-backdrop" @click.self="showFilters = false">
          <aside class="catalog-page__filters catalog-page__filters--drawer">
            <div class="catalog-page__filters-head"><h2>Фильтры</h2><button type="button" @click="showFilters = false">&times;</button></div>
            <div class="catalog-page__filters-body">
              <section class="catalog-filter">
                <h3>Бренд</h3>
                <label class="catalog-filter__search"><NuxtImg src="/icons/search.svg" alt="" /><input v-model="brandSearch" type="text" placeholder="Поиск"></label>
                <label v-for="brand in filteredBrandOptions" :key="brand" class="catalog-filter__check">
                  <input type="checkbox" :checked="filters.brands.includes(brand)" @change="toggleBrand(brand)"><span /><em>{{ brand }}</em>
                </label>
                <button v-if="hasActiveFilters" type="button" class="catalog-filter__reset" @click="resetFilters">Сбросить фильтры</button>
              </section>
              <section class="catalog-filter">
                <h3>Цена</h3>
                <div class="catalog-filter__price-grid">
                  <input v-model="priceMinInput" type="text" placeholder="От" @input="applyPrice">
                  <input v-model="priceMaxInput" type="text" placeholder="До" @input="applyPrice">
                </div>
              </section>
            </div>
          </aside>
        </div>
      </Transition>
      <aside class="catalog-page__filters catalog-page__filters--desktop">
        <div class="catalog-page__filters-title"><span /><h2>Фильтры</h2></div>
        <section class="catalog-filter">
          <button type="button" class="catalog-filter__heading"><i /><strong>Бренд</strong></button>
          <label class="catalog-filter__search"><NuxtImg src="/icons/search.svg" alt="" /><input v-model="brandSearch" type="text" placeholder="Поиск"></label>
          <label v-for="brand in filteredBrandOptions" :key="brand" class="catalog-filter__check">
            <input type="checkbox" :checked="filters.brands.includes(brand)" @change="toggleBrand(brand)"><span /><em>{{ brand }}</em>
          </label>
          <button v-if="hasActiveFilters" type="button" class="catalog-filter__reset" @click="resetFilters">Сбросить фильтры</button>
        </section>
        <section class="catalog-filter">
          <button type="button" class="catalog-filter__heading"><i /><strong>Цена</strong></button>
          <div class="catalog-filter__price-grid">
            <input v-model="priceMinInput" type="text" placeholder="От 2349" @input="applyPrice">
            <input v-model="priceMaxInput" type="text" placeholder="До 23699" @input="applyPrice">
          </div>
        </section>
      </aside>
      <section class="catalog-page__results">
        <div class="catalog-page__fit"><span>Подходит на:</span><strong>BMW 5 IV седан (E39) 540 i</strong><button type="button">&times;</button></div>
        <div class="catalog-page__controls">
          <button type="button" class="catalog-page__filter-button" @click="showFilters = true"><NuxtImg src="/icons/filterIcon.svg" alt="" /></button>
          <div class="catalog-page__sorts">
            <button v-for="opt in sortOptions" :key="opt.value" type="button" class="catalog-page__sort" :class="{ 'catalog-page__sort--active': sort === opt.value }" @click="setSort(opt.value)">{{ opt.label }}</button>
          </div>
          <button type="button" class="catalog-page__mobile-sort">Сначала популярные</button>
        </div>
        <div v-if="isLoading && !products.length" class="catalog-page__loading">Загрузка товаров...</div>
        <div v-else class="catalog-page__grid">
          <ShopProductCard v-for="product in products" :key="product.id" :title="product.title" :stock="product.stockText" :delivery="product.delivery" :price="formatPrice(product.price)" :old-price="product.oldPrice ? formatPrice(product.oldPrice) : undefined" :discount="product.discount ? formatDiscount(product.discount) : undefined" :image="product.image" :to="product.slug" :show-button="true" />
        </div>
        <div v-if="!isLoading && !products.length" class="catalog-page__empty"><p>Товары не найдены</p><span>Попробуйте изменить параметры фильтрации</span></div>
        <div v-if="hasMore" class="catalog-page__more"><button type="button" class="catalog-page__more-btn" :disabled="isLoading" @click="loadMore">{{ isLoading ? 'Загрузка...' : `Показать ещё (${products.length} из ${pagination.total})` }}</button></div>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.shop-page {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.catalog-page {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.catalog-page__breadcrumbs {
  color: #ababab;
  font-size: 1.45rem;
}

.catalog-page__layout {
  display: grid;
  grid-template-columns: minmax(26rem, 30rem) minmax(0, 1fr);
  gap: 2rem;
}

.catalog-page__filters,
.catalog-page__results {
  background: #fff;
  border-radius: 2.8rem;
}

.catalog-page__filters--desktop {
  padding: 2.4rem 2rem;
  height: fit-content;
}

.catalog-page__filters-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  span {
    position: relative;
    width: 1.6rem;
    height: 1.2rem;

    &::before,
    &::after {
      position: absolute;
      left: 0;
      height: 0.2rem;
      border-radius: 999px;
      background: #8f8f8f;
      content: '';
    }

    &::before {
      top: 0.1rem;
      width: 100%;
    }

    &::after {
      top: 0.9rem;
      width: 0.9rem;
    }
  }

  h2 {
    color: #363636;
    font-size: 1.6rem;
    font-weight: 600;
  }
}

.catalog-filter {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  & + .catalog-filter {
    margin-top: 2rem;
  }

  h3,
  strong {
    color: #373737;
    font-size: 1.45rem;
    font-weight: 600;
  }
}

.catalog-filter__heading {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0;
  border: 0;
  background: transparent;

  i {
    width: 0.8rem;
    height: 0.8rem;
    border-right: 1.5px solid #888;
    border-bottom: 1.5px solid #888;
    transform: rotate(45deg);
  }
}

.catalog-filter__search {
  position: relative;
  display: flex;
  align-items: center;

  img {
    position: absolute;
    left: 1.4rem;
    width: 1.8rem;
    opacity: 0.35;
  }

  input {
    width: 100%;
    min-height: 4.6rem;
    padding: 0 1.6rem 0 4rem;
    border: 0;
    border-radius: 1.3rem;
    background: #f5f5f5;
    font-size: 1.4rem;
  }
}

.catalog-filter__check {
  display: flex; align-items: center; gap: 1rem; cursor: pointer;
  input { display: none; }
  span {
    width: 2rem; height: 2rem; border: 1px solid #c8c8c8; border-radius: 0.4rem; background: #fff; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; transition: background 0.15s, border-color 0.15s;
  }
  input:checked + span { background: $green; border-color: $green; &::after { content: '✓'; color: #fff; font-size: 1.2rem; font-weight: 700; line-height: 1; } }
  em { font-style: normal; color: #656565; font-size: 1.5rem; user-select: none; }
}

.catalog-filter__reset { margin-top: 0.6rem; padding: 0.8rem 0; border: 0; background: transparent; color: #c62828; font-size: 1.4rem; cursor: pointer; width: fit-content; &:hover { text-decoration: underline; } }

.catalog-filter__price-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  input {
    width: 100%;
    min-height: 4.8rem;
    padding: 0 1.4rem;
    border: 1px solid #d7d7d7;
    border-radius: 1.2rem;
    font-size: 1.45rem;
    background: #fff;
  }
}

.catalog-page__results {
  padding: 2.4rem;
}

.catalog-page__fit {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.2rem;

  span {
    color: #838383;
    font-size: 1.45rem;
  }

  strong {
    color: #242424;
    font-size: 1.8rem;
    font-weight: 500;
  }

  button {
    border: 0;
    background: transparent;
    color: #ff7a00;
    font-size: 2rem;
    cursor: pointer;
  }
}

.catalog-page__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  margin-bottom: 2.4rem;
}

.catalog-page__sorts {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.catalog-page__sort,
.catalog-page__mobile-sort,
.catalog-page__filter-button {
  min-height: 4.8rem;
  border: 0;
  border-radius: 1.4rem;
  font-size: 1.45rem;
}

.catalog-page__sort {
  padding: 0 1.8rem;
  background: #e9f8ee;
  color: $green;
}

.catalog-page__sort--active {
  background: $linear-green;
  color: #fff;
}

.catalog-page__filter-button,
.catalog-page__mobile-sort {
  display: none;
}

.catalog-page__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2.2rem 2rem;
}

.catalog-page__loading {
  min-height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.6rem;
}

.catalog-page__empty {
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

.catalog-page__more {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.catalog-page__more-btn {
  padding: 1.2rem 3rem;
  border: 1px solid $green;
  border-radius: 1.4rem;
  background: #fff;
  color: $green;
  font-size: 1.5rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: $green;
    color: #fff;
  }
}

.catalog-page__mobile-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: none;
  background: rgba(17, 17, 17, 0.48);
}

.catalog-page__filters--drawer {
  width: 100%;
  height: 100%;
  padding: 2rem 1.6rem;
  overflow-y: auto;
  border-radius: 0;
}

.catalog-page__filters-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;

  h2 {
    font-size: 2.4rem;
    font-weight: 700;
  }

  button {
    border: 0;
    background: transparent;
    font-size: 3.2rem;
    color: #444;
  }
}

.catalog-filters-fade-enter-active,
.catalog-filters-fade-leave-active {
  transition: opacity 0.2s ease;
}

.catalog-filters-fade-enter-from,
.catalog-filters-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1199px) {
  .catalog-page__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 991px) {
  .catalog-page__layout {
    grid-template-columns: 1fr;
  }
  .catalog-page__results {
    background-color: #fff;
  }
  .catalog-page__filters--desktop {
    display: none;
  }

  .catalog-page__mobile-backdrop {
    display: flex;
  }

  .catalog-page__filter-button,
  .catalog-page__mobile-sort {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .catalog-page__filter-button {
    width: 4.8rem;
    min-width: 4.8rem;
    background: #fff;
    box-shadow: inset 0 0 0 1px #ebebeb;

    img {
      width: 2.8rem;
    }
  }

  .catalog-page__sorts {
    display: none;
  }

  .catalog-page__mobile-sort {
    padding: 0 1.2rem;
    margin-left: auto;
    background: transparent;
    color: #7d7d7d;
  }

  .catalog-page__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .catalog-page__results {
    background-color: #fff;
  }
  .shop-page {
    width: calc(100% - 1.6rem);
  }

  .catalog-page {
    gap: 1.2rem;
  }

  .catalog-page__breadcrumbs {
    font-size: 1.2rem;
  }


  .catalog-page__fit {
    display: none;
  }

  .catalog-page__controls {
    margin-bottom: 1.6rem;
  }

  .catalog-page__mobile-sort {
    min-height: auto;
    font-size: 1.25rem;
  }

  .catalog-page__grid {
    gap: 2rem 1.2rem;
  }
}
</style>
