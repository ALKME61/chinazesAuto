export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) throw createError({ statusCode: 401 })

  const body = await readBody(event)

  try {
    const response = await $fetch('http://212.41.28.206/api/v1/orders/create/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body,
    })
    return response
  } catch (error: any) {
    console.error('order create error:', error?.response?.status, error?.data || error?.message)
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: error?.data?.detail || error?.data?.error || error?.message || 'Ошибка создания заказа',
    })
  }
})
