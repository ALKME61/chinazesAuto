export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) throw createError({ statusCode: 401 })

  const vehicleId = getRouterParam(event, 'vehicle_id')
  const unitId = getRouterParam(event, 'unit_id')

  try {
    const response = await $fetch(`http://212.41.28.206/api/v1/garage/${vehicleId}/units/${unitId}/parts/`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    })
    return response
  } catch (error: any) {
    console.error('garage parts error:', error?.response?.status, error?.data || error?.message)
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: error?.data?.detail || error?.data?.error || error?.message || 'Ошибка загрузки деталей',
    })
  }
})
