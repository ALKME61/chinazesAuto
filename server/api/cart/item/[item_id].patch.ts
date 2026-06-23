export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) throw createError({ statusCode: 401, message: 'Требуется авторизация' })

  const itemId = getRouterParam(event, 'item_id')
  const body = await readBody(event)

  try {
    const response = await $fetch(`http://212.41.28.206/api/v1/cart/item/${itemId}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    })
    return response
  } catch (error: any) {
    console.error('cart patch error:', error?.response?.status, error?.data || error?.message)
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: error?.data?.detail || error?.data?.error || error?.message || 'Ошибка обновления корзины',
    })
  }
})
