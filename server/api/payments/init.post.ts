// server/api/payments/init.post.ts
export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const body = await readBody(event)

  if (!accessToken) {
    throw createError({ statusCode: 401 })
  }

  try {
    const response = await $fetch(
      'http://212.41.28.206/api/v1/payments/init/',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: body  // { amount: 1000 } или что ждёт Django
      }
    )

    return response  // { payment_url, payment_id, ... }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.detail || 'Ошибка инициализации платежа'
    })
  }
})