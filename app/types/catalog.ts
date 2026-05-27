export interface CatalogProduct {
  id: number
  article: string
  title: string
  brand: string
  price: number
  oldPrice?: number
  discount?: number
  stock: number
  stockText: string
  delivery: string
  deliveryHours: number
  image: string
  slug: string
  rating?: number
  reviews?: number
  category: string
}

export interface CatalogFilters {
  brands: string[]
  priceMin: number | null
  priceMax: number | null
  search: string
}

export type CatalogSort = 'default' | 'price_asc' | 'price_desc' | 'popular' | 'fastest'

export interface CatalogPagination {
  page: number
  limit: number
  total: number
}
