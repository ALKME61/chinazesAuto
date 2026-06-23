export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const imageUrl = query.url?.toString()
  if (!imageUrl) throw createError({ statusCode: 400 })

  try {
    const response: any = await $fetch.raw(imageUrl, {
      headers: { Referer: 'https://chinazesauto.ru/' },
      responseType: 'arrayBuffer',
    })

    const contentType = response.headers?.get?.('content-type') || response.headers?.['content-type'] || 'image/gif'

    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    setHeader(event, 'Access-Control-Allow-Origin', '*')

    return response._data instanceof ArrayBuffer ? new Uint8Array(response._data) : response._data
  } catch (error: any) {
    console.error('image proxy error:', error?.statusCode || error?.statusCode, error?.message || error?.statusMessage)
    throw createError({ statusCode: 502 })
  }
})
