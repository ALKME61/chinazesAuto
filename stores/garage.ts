export interface GarageVehicle {
  id: number
  vin: string
  brand?: string
  model?: string
  year?: number
  is_primary?: boolean
  title?: string
}

export const useGarageStore = defineStore('garage', () => {
  const vehicles = ref<GarageVehicle[]>([])
  const isLoading = ref(true)

  function parseVehicle(v: any): GarageVehicle {
    return {
      id: v.id,
      vin: v.vin || '',
      brand: v.brand || v.manufacturer || '',
      model: v.model || v.model_name || '',
      year: v.year || v.model_year || null,
      is_primary: v.is_primary || v.is_main || false,
      title: v.title || v.name || `${v.brand || v.manufacturer || ''} ${v.model || v.model_name || ''}`.trim() || v.vin,
    }
  }

  async function fetchVehicles() {
    const api = useAPI()
    isLoading.value = true
    try {
      const data: any = await api('/api/garage')
      vehicles.value = (Array.isArray(data) ? data : data?.results || data?.vehicles || []).map(parseVehicle)
    } catch {
      vehicles.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function addVehicle(payload: { vin: string; brand?: string; model?: string; year?: number }) {
    const api = useAPI()
    const res: any = await api('/api/garage/add', {
      method: 'POST',
      body: payload,
    })
    const parsed = parseVehicle(res)
    vehicles.value.push(parsed)
    return parsed
  }

  async function removeVehicle(id: number) {
    vehicles.value = vehicles.value.filter(v => v.id !== id)
    const api = useAPI()
    try {
      await api(`/api/garage/${id}`, { method: 'DELETE' })
    } catch {
      await fetchVehicles()
    }
  }

  async function setPrimary(id: number) {
    const api = useAPI()
    await api(`/api/garage/${id}/set-primary`, { method: 'POST' })
    vehicles.value.forEach(v => { v.is_primary = v.id === id })
  }

  return { vehicles, isLoading, fetchVehicles, addVehicle, removeVehicle, setPrimary }
})
