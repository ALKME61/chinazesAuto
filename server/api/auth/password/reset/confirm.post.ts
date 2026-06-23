export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    return await $fetch('http://212.41.28.206/api/v1/auth/password/reset/confirm/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: body.email,
        code: body.code,
        new_password: body.new_password,
      },
    })
  } catch (error: any) {
    console.error('password confirm error:', error?.data || error?.message)
    throw createError({
      statusCode: error?.statusCode || 400,
      message: error?.data?.message || error?.data?.detail || 'Ошибка подтверждения',
    })
  }
})
