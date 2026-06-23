export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const query = getQuery(event)
  const vin = query.vin?.toString()

  if (!vin) throw createError({ statusCode: 400, message: 'vin обязателен' })

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  try {
    return await $fetch(`http://212.41.28.206/api/v1/articles/vin/tecdoc/?vin=${encodeURIComponent(vin)}`, { headers })
  } catch (error: any) {
    console.error('vin tecdoc error:', error?.response?.status, error?.data || error?.message)
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: error?.data?.detail || error?.data?.error || error?.message || 'Ошибка поиска по VIN',
    })
  }
})
