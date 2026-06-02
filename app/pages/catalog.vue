<script setup lang="ts">
import auth from '~/middleware/auth'
import ShopProductCard from '~/components/shop/productCard/ui/ShopProductCard.vue'
import type { CatalogSort } from '~/types/catalog'

definePageMeta({ middleware: auth })

interface SupplierOffer {
  supplier: string
  article_nr: string
  brand: string
  price: number
  quantity: number
  delivery_days_min: number | null
  delivery_days_max: number | null
  warehouse: string
  raw_data: Record<string, any>
  is_analog?: boolean
}

interface ProductAttribute {
  cri_id: number
  name: string
  unit: string
  value: string
}

interface ProductImage {
  file_name: string
  type: string
  width: number
  height: number
  sort: number
  url: string
}

interface CrossItem {
  art_id: number
  art_sup_id: number
  article_nr: string
  brand: string
  description?: string
  price?: string | null
  price_formatted?: string | null
}

interface ProductDetail {
  art_id: number
  art_sup_id: number
  article_nr: string
  brand: string
  art_des_id: number | null
  art_complete_des_id: number | null
  art_ctm: number
  art_replacement: number
  art_accessory: number
  price: string | null
  price_formatted: string | null
  description?: string
  attributes?: ProductAttribute[]
  images?: ProductImage[]
  crosses: CrossItem[]
  parts: any[]
  supplier_offers_exact: SupplierOffer[]
  supplier_offers_analogues: SupplierOffer[]
  supplier_offers: SupplierOffer[]
  supplier_summary: {
    total_exact: number
    total_analogues: number
    suppliers: Record<string, { min_price: number; count: number }>
  }
}

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

const productDetail = ref<ProductDetail | null>(null)
const productLoading = ref(false)
const productError = ref('')

const artId = computed(() => {
  const raw = route.query.art_id
  return Array.isArray(raw) ? raw[0] : raw
})
const supId = computed(() => {
  const raw = route.query.sup_id
  return Array.isArray(raw) ? raw[0] : raw
})
const hasProduct = computed(() => artId.value && supId.value)
const allOffers = computed(() => productDetail.value?.supplier_offers_exact ?? [])
const analogueOffers = computed(() => productDetail.value?.supplier_offers_analogues ?? [])
const crosses = computed(() => productDetail.value?.crosses ?? [])

const offerQuantities = reactive<Record<string, number>>({})

function getQty(key: string | number) { return offerQuantities[String(key)] ?? 1 }
function incQty(key: string | number) { offerQuantities[String(key)] = getQty(key) + 1 }
function decQty(key: string | number) { const v = getQty(key); if (v > 1) offerQuantities[String(key)] = v - 1 }
function offerName(offer: SupplierOffer) { return offer.raw_data?.description || offer.raw_data?.name || `${offer.brand} ${offer.article_nr}` }

async function fetchProductDetail() {
  if (!artId.value || !supId.value) return
  productLoading.value = true
  productError.value = ''
  productDetail.value = null

  try {
    const data = await $fetch<ProductDetail>(`/api/articles/${artId.value}/${supId.value}/`)
    productDetail.value = data
  } catch (e: any) {
    productError.value = e?.data?.message || e?.message || 'Ошибка загрузки товара'
  } finally {
    productLoading.value = false
  }
}

watch(() => [artId.value, supId.value], () => {
  if (hasProduct.value) fetchProductDetail()
}, { immediate: true })

function formatOfferPrice(price: number) {
  return `${price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}₽`
}

watch(showFilters, (v) => { if (import.meta.client && window.innerWidth <= 991) document.body.style.overflow = v ? 'hidden' : '' })
onBeforeUnmount(() => { if (import.meta.client) document.body.style.overflow = '' })
watch(() => route.fullPath, () => { showFilters.value = false })
</script>

<template>
  <main class="catalog-page shop-page">
    <div class="catalog-page__breadcrumbs">
      <NuxtLink to="/">Главная</NuxtLink>
      <template v-if="hasProduct && productDetail">
        &gt; <NuxtLink :to="`/articles/search?article=${productDetail.article_nr}`">Поиск по артикулу</NuxtLink>
        &gt; <span>{{ productDetail.brand }} {{ productDetail.article_nr }}</span>
      </template>
      <template v-else>
        &gt; <span>Каталог</span>
        &gt; <span>{{ categoryName }}</span>
      </template>
    </div>
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
        <template v-if="hasProduct">
          <div v-if="productLoading" class="catalog-page__loading">Загрузка товара...</div>
          <div v-else-if="productError" class="catalog-page__empty"><p>{{ productError }}</p></div>
          <div v-else-if="productDetail" class="product-detail">
            <div class="product-detail__header">
              <div v-if="productDetail.images?.length" class="product-detail__image">
                <NuxtImg :src="`http://212.41.28.206${productDetail.images[0]!.url}`" alt="" width="200" />
              </div>
              <div class="product-detail__info">
                <h2 class="product-detail__title">{{ productDetail.brand }} {{ productDetail.article_nr }}</h2>
                <p v-if="productDetail.description" class="product-detail__desc">{{ productDetail.description }}</p>
                <dl v-if="productDetail.attributes?.length" class="product-detail__attrs">
                  <div v-for="attr in productDetail.attributes" :key="attr.cri_id" class="attr-row">
                    <dt>{{ attr.name }}</dt>
                    <dd>{{ attr.value }}{{ attr.unit ? ` ${attr.unit}` : '' }}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div v-if="allOffers.length" class="product-detail__table-wrap">
              <table class="offer-table">
                <thead>
                  <tr>
                    <th>Артикул</th>
                    <th>Описание</th>
                    <th class="offer-table__center">Наличие</th>
                    <th class="offer-table__center">Кол-во</th>
                    <th class="offer-table__center">Цена</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(offer, idx) in allOffers" :key="idx">
                    <td class="offer-table__article">{{ offer.article_nr }}</td>
                    <td class="offer-table__name">{{ offerName(offer) }}</td>
                    <td class="offer-table__center offer-table__stock">{{ offer.quantity }} шт.</td>
                    <td class="offer-table__center">
                      <div class="qty-picker">
                        <button type="button" class="qty-picker__btn" @click="decQty(idx)">−</button>
                        <span class="qty-picker__val">{{ getQty(idx) }}</span>
                        <button type="button" class="qty-picker__btn" @click="incQty(idx)">+</button>
                      </div>
                    </td>
                    <td class="offer-table__center offer-table__price">{{ formatOfferPrice(offer.price) }}</td>
                    <td class="offer-table__action">
                      <button type="button" class="offer-table__cart" title="В корзину">
                        <NuxtImg src="/icons/Cart.svg" alt="" width="22" height="22" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="catalog-page__empty"><p>Нет предложений</p></div>

            <template v-if="crosses.length">
              <h3 class="product-detail__section-title">Кросы</h3>
              <ul class="crosses-list">
                <li v-for="cross in crosses" :key="cross.art_id" class="crosses-list__item" @click="navigateTo(`/catalog?art_id=${cross.art_id}&sup_id=${cross.art_sup_id}`)">
                  <span class="crosses-list__brand">{{ cross.brand }}</span>
                  <span class="crosses-list__desc">{{ cross.description }}</span>
                  <span class="crosses-list__article">{{ cross.article_nr }}</span>
                </li>
              </ul>
            </template>

            <template v-if="analogueOffers.length">
              <h3 class="product-detail__section-title">Аналоги</h3>
              <div class="product-detail__table-wrap">
                <table class="offer-table">
                  <thead><tr><th>Артикул</th><th>Описание</th><th class="offer-table__center">Наличие</th><th class="offer-table__center">Кол-во</th><th class="offer-table__center">Цена</th><th></th></tr></thead>
                  <tbody>
                    <tr v-for="(offer, idx) in analogueOffers" :key="'a'+idx">
                      <td class="offer-table__article">{{ offer.article_nr }}</td>
                      <td class="offer-table__name">{{ offerName(offer) }}</td>
                      <td class="offer-table__center offer-table__stock">{{ offer.quantity }} шт.</td>
                      <td class="offer-table__center">
                        <div class="qty-picker">
                          <button type="button" class="qty-picker__btn" @click="decQty('a'+idx)">−</button>
                          <span class="qty-picker__val">{{ getQty('a'+idx) }}</span>
                          <button type="button" class="qty-picker__btn" @click="incQty('a'+idx)">+</button>
                        </div>
                      </td>
                      <td class="offer-table__center offer-table__price">{{ formatOfferPrice(offer.price) }}</td>
                      <td class="offer-table__action"><button type="button" class="offer-table__cart" title="В корзину"><NuxtImg src="/icons/Cart.svg" alt="" width="22" height="22" /></button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </template>
        <template v-else>
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
        </template>
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

.product-detail__header {
  display: flex;
  gap: 2.4rem;
  margin-bottom: 2.4rem;
}

.product-detail__image {
  flex-shrink: 0;
  width: 20rem;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 2rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.product-detail__info {
  flex: 1;
  min-width: 0;
}

.product-detail__title {
  font-size: 2.4rem;
  font-weight: 600;
  color: #333;
}

.product-detail__desc {
  margin-top: 1rem;
  font-size: 1.5rem;
  color: #555;
  line-height: 1.5;
}

.product-detail__attrs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 0.8rem 2rem;
  margin-top: 1.6rem;
}

.attr-row {
  display: flex;
  gap: 0.6rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f0f0f0;

  dt {
    color: #999;
    font-size: 1.3rem;
    white-space: nowrap;
  }

  dd {
    color: #333;
    font-size: 1.3rem;
    font-weight: 500;
    margin: 0;
  }
}

.product-detail__table-wrap {
  overflow-x: auto;
}

.product-detail__section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 2.4rem 0 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid $green;
}

.crosses-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.crosses-list__item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.15s;

  &:last-child { border-bottom: 0; }
  &:hover { background: #f9faf9; }
}

.crosses-list__brand {
  color: #333;
  font-size: 1.5rem;
  font-weight: 500;
}

.crosses-list__desc {
  color: #9e9e9e;
  font-size: 1.4rem;
  font-weight: 300;
  text-align: center;
  padding: 0 1rem;
}

.crosses-list__article {
  color: #656565;
  font-size: 1.5rem;
  text-align: right;
}

.offer-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 1.2rem 1.6rem;
    color: #838383;
    font-size: 1.3rem;
    font-weight: 500;
    border-bottom: 2px solid #efefef;
    white-space: nowrap;
  }

  td {
    padding: 1.4rem 1.6rem;
    font-size: 1.5rem;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
    vertical-align: middle;
  }

  tbody tr:hover td {
    background: #f9faf9;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
}

.offer-table__center {
  text-align: center;
}

.offer-table__article {
  font-weight: 500;
  white-space: nowrap;
}

.offer-table__name {
  max-width: 30rem;
}

.offer-table__stock {
  font-weight: 500;
  color: $green;
}

.offer-table__price {
  font-weight: 700;
  font-size: 1.6rem;
  white-space: nowrap;
}

.qty-picker {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.qty-picker__btn {
  width: 3.2rem;
  height: 3.2rem;
  border: 0;
  background: #f5f5f5;
  color: #555;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e8e8e8;
  }
}

.qty-picker__val {
  width: 3.6rem;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 500;
  background: #fff;
  line-height: 3.2rem;
}

.offer-table__cart {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4.4rem;
  height: 4.4rem;
  border: 0;
  border-radius: 1.2rem;
  background: $linear-green;
  cursor: pointer;

  img {
    width: 2rem;
    height: 2rem;
    filter: brightness(0) invert(1);
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

  .product-detail__title {
    font-size: 1.8rem;
  }

  .product-detail__header {
    flex-direction: column;
    gap: 1.6rem;
  }

  .product-detail__image {
    width: 100%;
    height: 16rem;
  }

  .product-detail__attrs {
    grid-template-columns: 1fr;
  }

  .offer-table {
    th, td {
      padding: 1rem 1.2rem;
      font-size: 1.3rem;
    }
  }

  .qty-picker__btn {
    width: 2.8rem;
    height: 2.8rem;
    font-size: 1.4rem;
  }

  .qty-picker__val {
    width: 3rem;
    font-size: 1.3rem;
    line-height: 2.8rem;
  }

  .offer-table__cart {
    width: 3.8rem;
    height: 3.8rem;
  }

  .crosses-list__item {
    grid-template-columns: 1fr 1fr;
    padding: 1rem 0.8rem;
  }

  .crosses-list__desc {
    display: none;
  }

  .product-detail__section-title {
    font-size: 1.5rem;
  }
}
</style>
