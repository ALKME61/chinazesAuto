import type { CatalogProduct, CatalogFilters, CatalogSort, CatalogPagination } from '~/types/catalog'

function generateMockProducts(): CatalogProduct[] {
  const brands = ['BOSCH', 'Zekkert', 'Stellox', 'Hiki-Lo', 'Electro', 'Mann-Filter', 'SACHS']
  const category = 'АКБ'
  const images = ['/productExample.png', '/money.png', '/productExample.png']

  const productTemplates = [
    { titleBase: 'Аккумулятор', models: ['S5','S4','Mega Power','Silver','Black Series','AGM','EFB','Dynamic'], capacities: [60,74,75,80,90,95,100,110], basePrice: 12499 },
    { titleBase: 'Стартер', models: ['ST','ST-R','Pro','Eco'], capacities: [1200,1400,1600,1800,2000,2200], basePrice: 8900 },
    { titleBase: 'Генератор', models: ['GEN','GEN-P','Premium','Standard'], capacities: [90,120,140,150,180], basePrice: 15900 },
    { titleBase: 'Тормозные колодки', models: ['BP','BP-C','Ceramic','Sport'], capacities: [1,2,3,4], basePrice: 3200 },
    { titleBase: 'Масляный фильтр', models: ['OF','OF-X','Eco','LongLife'], capacities: [1,2,3], basePrice: 1200 },
    { titleBase: 'Свеча зажигания', models: ['SP','SP-I','Iridium','Platinum'], capacities: [1,4,8], basePrice: 800 },
    { titleBase: 'Катушка зажигания', models: ['IC','IC-P','Pro'], capacities: [1,2,4], basePrice: 4500 },
    { titleBase: 'Амортизатор', models: ['AS','AS-R','Sport','Comfort'], capacities: [1,2], basePrice: 7800 },
  ]

  const products: CatalogProduct[] = []
  for (let i = 0; i < 48; i++) {
    const template = productTemplates[i % productTemplates.length]!
    const brand = brands[i % brands.length]!
    const capacity = template.capacities[i % template.capacities.length]!
    const model = template.models[Math.floor(i / productTemplates.length) % template.models.length]!
    const titleRaw = `${brand} ${template.titleBase} ${model} ${capacity}${i % 3 === 0 ? ' Pro' : i % 3 === 1 ? ' Plus' : ''}`
    const title = titleRaw.length > 60 ? titleRaw.slice(0, 57) + '...' : titleRaw

    const price = Math.round(template.basePrice * (0.85 + Math.random() * 0.3) / 100) * 100
    const stockCount = [0, 2, 5, 8, 12, 0, 4, 1, 7, 15][i % 10]!
    const deliveryHours = [2, 24, 48, 72, 4, 6, 24, 12][i % 8]!

    const hasDiscount = i % 5 === 0
    const oldPrice = hasDiscount ? Math.round(price * 1.2 / 100) * 100 : undefined
    const discount = hasDiscount ? -Math.round((1 - price / oldPrice!) * 100) : undefined

    products.push({
      id: i + 1, article: `${brand.substring(0, 2)}-${String(i + 1).padStart(4, '0')}`, title, brand, price, oldPrice, discount,
      stock: stockCount,
      stockText: stockCount > 0 ? (stockCount >= 5 ? 'В наличии много' : `В наличии ${stockCount} шт`) : 'Нет в наличии',
      delivery: deliveryHours <= 4 ? 'Доставка сегодня' : deliveryHours <= 24 ? 'Доставка 24 часа' : 'Доставка 2-3 рабочих дня',
      deliveryHours,
      image: images[i % images.length]!,
      slug: `/product/${title.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      rating: +(3.5 + Math.random() * 2).toFixed(1),
      reviews: Math.floor(100 + Math.random() * 5000),
      category,
    })
  }
  return products
}

const allProducts = generateMockProducts()
const availableBrands = [...new Set(allProducts.map(p => p.brand))]

export const useCatalog = () => {
  const filters = ref<CatalogFilters>({ brands: [], priceMin: null, priceMax: null, search: '' })
  const sort = ref<CatalogSort>('default')
  const pagination = ref<CatalogPagination>({ page: 1, limit: 12, total: 0 })
  const isLoading = ref(false)
  const products = ref<CatalogProduct[]>([])
  const hasMore = ref(true)

  const filterAndSort = (items: CatalogProduct[]): CatalogProduct[] => {
    let result = [...items]
    if (filters.value.brands.length > 0) result = result.filter(p => filters.value.brands.includes(p.brand))
    if (filters.value.priceMin !== null) result = result.filter(p => p.price >= filters.value.priceMin!)
    if (filters.value.priceMax !== null) result = result.filter(p => p.price <= filters.value.priceMax!)
    if (filters.value.search.trim()) {
      const q = filters.value.search.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.article.toLowerCase().includes(q))
    }
    switch (sort.value) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result.sort((a, b) => b.price - a.price); break
      case 'popular': result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); break
      case 'fastest': result.sort((a, b) => a.deliveryHours - b.deliveryHours); break
    }
    return result
  }

  const fetchProducts = async () => {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 300))
    const filtered = filterAndSort(allProducts)
    pagination.value.total = filtered.length
    const start = (pagination.value.page - 1) * pagination.value.limit
    const pageItems = filtered.slice(start, start + pagination.value.limit)
    if (pagination.value.page === 1) products.value = pageItems
    else products.value.push(...pageItems)
    hasMore.value = products.value.length < filtered.length
    isLoading.value = false
  }

  const applyFilters = () => { pagination.value.page = 1; products.value = []; fetchProducts() }
  const loadMore = () => { if (!hasMore.value || isLoading.value) return; pagination.value.page++; fetchProducts() }
  const setSort = (s: CatalogSort) => { sort.value = s; pagination.value.page = 1; products.value = []; fetchProducts() }
  const toggleBrand = (b: string) => { const i = filters.value.brands.indexOf(b); i >= 0 ? filters.value.brands.splice(i, 1) : filters.value.brands.push(b); applyFilters() }
  const setPriceRange = (min: number | null, max: number | null) => { filters.value.priceMin = min; filters.value.priceMax = max; applyFilters() }
  const setSearch = (v: string) => { filters.value.search = v; applyFilters() }

  fetchProducts()

  return { products, filters, sort, pagination, isLoading, hasMore, brandOptionsAll: availableBrands, applyFilters, loadMore, setSort, toggleBrand, setPriceRange, setSearch }
}
