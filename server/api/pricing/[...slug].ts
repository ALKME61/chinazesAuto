export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const slug = getRouterParam(event, 'slug') || ''
  const method = event.method
  const query = getQuery(event)
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  const url = `http://212.41.28.206/api/v1/pricing/${slug}${slug ? '/' : ''}`

  try {
    if (method === 'GET') {
      return await $fetch(url, { headers, query })
    }
    const body = await readBody(event)
    return await $fetch(url, {
      method,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body,
      query,
    })
  } catch (error: any) {
    console.error(`pricing ${slug} error:`, error?.response?.status, error?.data || error?.message)
    throw createError({
      statusCode: error?.response?.status || 500,
      message: error?.data?.detail || error?.data?.message || 'Ошибка сервера',
    })
  }
})
