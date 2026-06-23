export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) throw createError({ statusCode: 401, message: 'Требуется авторизация' })

  const itemId = getRouterParam(event, 'item_id')

  try {
    const response = await $fetch(`http://212.41.28.206/api/v1/cart/item/${itemId}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    })
    return response
  } catch (error: any) {
    console.error('cart delete error:', error?.response?.status, error?.data || error?.message)
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: error?.data?.detail || error?.data?.error || error?.message || 'Ошибка удаления из корзины',
    })
  }
})
