export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) throw createError({ statusCode: 401 })

  const query = getQuery(event)
  const params = new URLSearchParams()
  if (query.vin) params.set('vin', query.vin.toString())
  if (query.category_id) params.set('category_id', query.category_id.toString())
  if (query.unit_id) params.set('unit_id', query.unit_id.toString())

  try {
    const url = `http://212.41.28.206/api/v1/articles/vin/browse/${params.toString() ? `?${params}` : ''}`
    const response = await $fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    })
    return response
  } catch (error: any) {
    console.error('vin browse error:', error?.response?.status, error?.data || error?.message)
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: error?.data?.detail || error?.data?.error || error?.message || 'Ошибка загрузки данных',
    })
  }
})
