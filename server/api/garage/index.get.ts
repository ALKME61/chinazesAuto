export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) throw createError({ statusCode: 401 })

  const urls = [
    'http://212.41.28.206/api/v1/garage/vehicles/',
    'http://212.41.28.206/api/v1/garage/',
  ]

  for (const url of urls) {
    try {
      const response = await $fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
      })
      return response
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        throw createError({
          statusCode: error?.response?.status || error?.statusCode || 500,
          message: error?.data?.detail || error?.data?.error || error?.message || 'Ошибка загрузки гаража',
        })
      }
    }
  }

  throw createError({ statusCode: 404, message: 'Garage endpoint not available' })
})
