export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const mfaId = getRouterParam(event, 'mfa_id')
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  try {
    return await $fetch(`http://212.41.28.206/api/v1/articles/cars/${mfaId}/models/`, { headers })
  } catch (error: any) {
    console.error('models error:', error?.response?.status, error?.data || error?.message)
    throw createError({ statusCode: error?.response?.status || 500, message: error?.data?.detail || 'Ошибка загрузки моделей' })
  }
})
