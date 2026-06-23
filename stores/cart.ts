import { useAuthStore } from '~~/stores/auth'

export interface CartItem {
  id: string
  serverId?: string | number
  supplier: string
  article_nr: string
  brand: string
  price: number
  quantity: number
  supplier_data: Record<string, any>
  name?: string
  addedAt: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isLoading = ref(true)
  let loaded = false

  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }

  function parseServerItem(raw: any): CartItem {
    return {
      id: raw.id || generateId(),
      serverId: raw.id || raw.item_id || undefined,
      supplier: raw.supplier || '',
      article_nr: raw.article_nr || '',
      brand: raw.brand || '',
      price: Number(raw.price) || 0,
      quantity: Number(raw.quantity) || 1,
      supplier_data: raw.supplier_data || raw.raw_data || {},
      name: raw.name || raw.description || '',
      addedAt: Date.now(),
    }
  }

  async function fetchCart() {
    if (loaded) return
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      isLoading.value = false
      loaded = true
      return
    }
    const api = useAPI()
    isLoading.value = true
    try {
      const data: any = await api('/api/cart')
      const list: any[] = Array.isArray(data) ? data : (data?.items || data?.results || [])
      items.value = list.map(parseServerItem)
    } catch {
      items.value = []
    } finally {
      isLoading.value = false
      loaded = true
    }
  }

  async function addItem(payload: Omit<CartItem, 'id' | 'addedAt'>) {
    const api = useAPI()
    const id = generateId()

    const item: CartItem = { ...payload, id, addedAt: Date.now() }
    items.value.push(item)

    try {
      const res: any = await api('/api/cart/add', {
        method: 'POST',
        body: {
          supplier: payload.supplier,
          article_nr: payload.article_nr,
          brand: payload.brand,
          price: payload.price,
          quantity: payload.quantity,
          supplier_data: payload.supplier_data,
        },
      })
      const serverId = res?.id || res?.item_id
      if (serverId) {
        const match = items.value.find(i => i.id === id)
        if (match) match.serverId = serverId
      }
    } catch (e: any) {
      items.value = items.value.filter(i => i.id !== id)
      throw e
    }
  }

  async function removeItem(id: string) {
    const item = items.value.find(i => i.id === id)
    items.value = items.value.filter(i => i.id !== id)
    if (item?.serverId) {
      try {
        await useAPI()(`/api/cart/item/${item.serverId}`, { method: 'DELETE' })
      } catch {
        await fetchCart()
      }
    }
  }

  async function updateQty(id: string, qty: number) {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    const newQty = Math.max(1, qty)
    const prev = item.quantity
    item.quantity = newQty
    if (item.serverId) {
      try {
        await useAPI()(`/api/cart/item/${item.serverId}`, {
          method: 'PATCH',
          body: { quantity: newQty },
        })
      } catch {
        item.quantity = prev
      }
    }
  }

  const totalCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0))

  return { items, isLoading, fetchCart, addItem, removeItem, updateQty, totalCount, totalPrice }
})
