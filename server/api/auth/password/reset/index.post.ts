export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    return await $fetch('http://212.41.28.206/api/v1/auth/password/reset/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: body.email },
    })
  } catch (error: any) {
    console.error('password reset error:', error?.data || error?.message)
    throw createError({
      statusCode: error?.statusCode || 400,
      message: error?.data?.message || error?.data?.detail || 'Ошибка отправки кода',
    })
  }
})
