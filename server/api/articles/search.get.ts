export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (!query.article && !query.brand && !query.pt_id) {
    throw createError({ statusCode: 400, message: 'Укажите артикул, бренд или категорию' })
  }

  const accessToken = getCookie(event, 'access_token')

  const url = new URL('http://212.41.28.206/api/v1/articles/search/')
  for (const [key, val] of Object.entries(query)) {
    if (val) url.searchParams.set(key, String(val))
  }

  const headers: Record<string, string> = { accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  try {
    const response = await $fetch(url.toString(), { method: 'GET', headers })
    return response
  } catch (error: any) {
    console.error('article search failed:', error?.response?.status, JSON.stringify(error?.data) || error?.message)

    const errData = error?.data || error?.response?._data || {}
    const errDetail = typeof errData === 'object' ? (errData?.detail || errData?.message || JSON.stringify(errData)) : errData
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: errDetail || error?.message || 'Ошибка поиска',
    })
  }
})
