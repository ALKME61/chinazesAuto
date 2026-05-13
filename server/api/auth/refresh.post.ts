// server/api/auth/refresh.post.ts
export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'No refresh token' })
  }
  console.log(refreshToken)
  try {
    const response = await $fetch<{ access: string; refresh: string }>(
      'http://212.41.28.206/api/v1/auth/token/refresh/',
      {
        method: 'POST',
        body: { refresh: refreshToken },
      }
    )

        setCookie(event, 'access_token', response.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60,
            path: '/',
        })

    return { ok: true }
  } catch (error) {
    // Рефреш протух — сносим куки
    deleteCookie(event, 'access_token')
    deleteCookie(event, 'refresh_token')
    throw createError({ statusCode: 401, message: 'Session expired' })
  }
})