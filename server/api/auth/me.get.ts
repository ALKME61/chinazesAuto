// server/api/auth/me.get.ts
export default defineEventHandler(async (event) => {
  let accessToken = getCookie(event, 'access_token')

  console.log('🍪 access_token:', accessToken ? 'есть' : 'нет')

  if (!accessToken) {
    const refreshToken = getCookie(event, 'refresh_token')
    console.log('🍪 refresh_token:', refreshToken ? 'есть' : 'нет')
    
    if (!refreshToken) {
      throw createError({ statusCode: 401, message: 'Требуется авторизация' })
    }

    try {
      const response = await $fetch<{ access: string; refresh?: string }>(
        'http://212.41.28.206/api/v1/auth/token/refresh/',
        {
          method: 'POST',
          body: { refresh: refreshToken }
        }
      )

      setCookie(event, 'access_token', response.access, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 30,
        path: '/',
      })

      if (response.refresh) {
        setCookie(event, 'refresh_token', response.refresh, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
          path: '/api/auth',
        })
      }

      accessToken = response.access
      console.log('✅ access_token обновлён')
      
    } catch (e) {
      console.log('❌ refresh протух')
      deleteCookie(event, 'access_token')
      deleteCookie(event, 'refresh_token')
      throw createError({ statusCode: 401, message: 'Сессия истекла' })
    }
  }

  // Идём в Django за юзером
  try {
    console.log('📡 Запрос в Django...')
    const userData = await $fetch(
      'http://212.41.28.206/api/v1/auth/profile/',  // ← правильный эндпоинт
      {
        headers: {
          Authorization: `Bearer ${accessToken}`  // ← Bearer обязательно!
        }
      }
    )

    console.log('✅ Юзер получен:', userData.id, userData.email)
    return { user: userData }

  } catch (error: any) {
    console.log('❌ Ошибка от Django:', error.statusCode, error.data)
    throw createError({
      statusCode: error.statusCode || 401,
      message: 'Невалидный токен'
    })
  }
})