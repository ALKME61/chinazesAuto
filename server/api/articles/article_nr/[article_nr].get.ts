export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')

  const articleNr = getRouterParam(event, 'article_nr')
  if (!articleNr) throw createError({ statusCode: 400, message: 'article_nr обязателен' })

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  try {
    const response = await $fetch(`http://212.41.28.206/api/v1/articles/article_nr/${encodeURIComponent(articleNr)}/`, {
      method: 'GET',
      headers,
    })
    return response
  } catch (error: any) {
    console.error('article_nr search error:', error?.response?.status, error?.data || error?.message)
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: error?.data?.detail || error?.data?.error || error?.message || 'Ошибка поиска по артикулу',
    })
  }
})
