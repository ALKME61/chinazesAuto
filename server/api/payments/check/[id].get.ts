// server/api/payments/check/[id].get.ts
export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const paymentId = getRouterParam(event, 'id')

  if (!accessToken) {
    throw createError({ statusCode: 401 })
  }

  try {
    const response = await $fetch(
      `http://212.41.28.206/api/v1/payments/check/${paymentId}/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    return response  // { status: 'paid', ... }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: 'Ошибка проверки платежа'
    })
  }
})