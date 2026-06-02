export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const response = await $fetch<{ access?: string; refresh?: string; user?: any; detail?: string }>('http://212.41.28.206/api/v1/auth/register/', {
      method: 'POST',
      body: { email: body.email, phone: body.phone, first_name: body.first_name, last_name: body.last_name, password: body.password, password_confirm: body.password_confirm, email_code: body.email_code },
    })
    if (response.access && response.refresh) {
      deleteCookie(event, 'access_token'); deleteCookie(event, 'refresh_token')
      setCookie(event, 'access_token', response.access, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60, path: '/' })
      setCookie(event, 'refresh_token', response.refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 60 * 60 * 24 * 7, path: '/api/auth' })
    }
    return { user: response.user }
  } catch (e: any) {
    const detail = e?.data?.detail || e?.data?.email?.[0] || e?.data?.password?.[0] || e?.data?.email_code?.[0] || e?.data?.phone?.[0] || 'Ошибка регистрации'
    throw createError({ statusCode: e?.statusCode || 400, message: typeof detail === 'string' ? detail : JSON.stringify(detail) })
  }
})
