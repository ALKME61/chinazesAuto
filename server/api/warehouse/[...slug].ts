export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  const slug = getRouterParam(event, 'slug') || ''
  const method = event.method
  const query = getQuery(event)
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (accessToken) headers.authorization = `Bearer ${accessToken}`

  const slugClean = slug.replace(/\/+$/, '')
  const url = `http://212.41.28.206/api/v1/warehouse/${slugClean}/`

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
    const status = error?.response?.status || 500
    const data = error?.data || error?.response?._data || {}
    console.error(`warehouse ${slug} error [${status}]:`, JSON.stringify(data))
    throw createError({
      statusCode: status,
      statusMessage: data?.detail || data?.message || data?.error || 'Ошибка склада',
      message: data?.detail || data?.message || data?.error || `Ошибка склада (${status})`,
    })
  }
})
