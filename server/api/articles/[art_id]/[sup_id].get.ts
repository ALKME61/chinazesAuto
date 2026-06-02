export default defineEventHandler(async (event) => {
  const artId = getRouterParam(event, 'art_id')
  const supId = getRouterParam(event, 'sup_id')

  if (!artId || !supId) {
    throw createError({ statusCode: 400, message: 'art_id и sup_id обязательны' })
  }

  const accessToken = getCookie(event, 'access_token')

  const headers: Record<string, string> = { accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  try {
    const response = await $fetch(
      `http://212.41.28.206/api/v1/articles/${artId}/${supId}/`,
      { method: 'GET', headers }
    )
    return response
  } catch (error: any) {
    console.error('product detail error:', error?.response?.status, JSON.stringify(error?.data) || error?.message)
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: (typeof error?.data === 'object' ? error?.data?.detail : error?.data) || error?.message || 'Ошибка получения товара',
    })
  }
})
