export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const pcId = getRouterParam(event, 'pc_id')
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  try {
    return await $fetch(`http://212.41.28.206/api/v1/articles/cars/vehicle/${pcId}/articles/`, { headers })
  } catch (error: any) {
    console.error('car articles error:', error?.response?.status, error?.data || error?.message)
    throw createError({ statusCode: error?.response?.status || 500, message: error?.data?.detail || 'Ошибка загрузки артикулов' })
  }
})
