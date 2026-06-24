export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const slugClean = slug.replace(/\/+$/, '')
  const url = `http://212.41.28.206/api/v1/main/${slugClean}/`
  const accessToken = getCookie(event, 'access_token')

  try {
    const response: any = await $fetch(url, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })
    return response
  } catch (error: any) {
    const status = error?.response?.status || 500
    const data = error?.data || error?.response?._data || {}
    throw createError({
      statusCode: status,
      statusMessage: data?.detail || data?.message || 'Ошибка',
      message: data?.detail || data?.message || `Ошибка (${status})`,
    })
  }
})
