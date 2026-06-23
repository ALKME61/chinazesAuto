export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  try {
    return await $fetch('http://212.41.28.206/api/v1/articles/cars/brands/', { headers })
  } catch (error: any) {
    console.error('brands error:', error?.response?.status, error?.data || error?.message)
    throw createError({ statusCode: error?.response?.status || 500, message: error?.data?.detail || 'Ошибка загрузки марок' })
  }
})
