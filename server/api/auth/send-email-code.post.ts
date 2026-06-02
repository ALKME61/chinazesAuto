export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const response = await $fetch<{ detail?: string }>('http://212.41.28.206/api/v1/auth/send-email-code/', { method: 'POST', body: { email: body.email } })
    return response
  } catch (e: any) {
    throw createError({ statusCode: e?.statusCode || 400, message: e?.data?.detail || e?.data?.email?.[0] || 'Ошибка отправки кода' })
  }
})
