export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const article = query.article?.toString()
  const brand = query.brand?.toString()

  if (!article) {
    throw createError({ statusCode: 400, message: 'Артикул обязателен' })
  }

  const accessToken = getCookie(event, 'access_token')

  const url = new URL('http://212.41.28.206/api/v1/articles/search/')
  url.searchParams.set('article', article)
  if (brand) url.searchParams.set('brand', brand)

  const headers: Record<string, string> = { accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  try {
    const response = await $fetch(url.toString(), { method: 'GET', headers })
    return response
  } catch (error: any) {
    console.error('article search failed:', error?.response?.status, JSON.stringify(error?.data) || error?.message)

    if (!accessToken && error?.response?.status === 401) {
      console.error('search needs auth, but no token in cookie')
    }

    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: (typeof error?.data === 'object' ? error?.data?.detail : error?.data) || error?.message || 'Ошибка поиска по артикулу',
    })
  }
})
