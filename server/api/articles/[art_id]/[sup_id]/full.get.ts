export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const artId = getRouterParam(event, 'art_id')
  const supId = getRouterParam(event, 'sup_id')
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  try {
    return await $fetch(`http://212.41.28.206/api/v1/articles/${artId}/${supId}/full/`, { headers })
  } catch (error: any) {
    console.error('article full error:', error?.response?.status, error?.data || error?.message)
    throw createError({ statusCode: error?.response?.status || 500, message: error?.data?.detail || 'Ошибка загрузки деталей' })
  }
})
