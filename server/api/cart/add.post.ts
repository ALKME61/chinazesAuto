export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')

  if (!accessToken) {
    throw createError({ statusCode: 401, message: 'Требуется авторизация' })
  }

  const body = await readBody(event)

  try {
    const response = await $fetch('http://212.41.28.206/api/v1/cart/add/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: {
        supplier: body.supplier,
        article_nr: body.article_nr,
        brand: body.brand,
        price: body.price,
        quantity: body.quantity,
        supplier_data: body.supplier_data,
      },
    })
    return response
  } catch (error: any) {
    console.error('cart add error:', error?.response?.status, error?.data || error?.message)
    throw createError({
      statusCode: error?.response?.status || error?.statusCode || 500,
      message: error?.data?.detail || error?.data?.error || error?.message || 'Ошибка добавления в корзину',
    })
  }
})
