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
    const userData = await $fetch<{ id: number; email: string; full_name?: string; role?: string; permissions?: Record<string, boolean>; balance?: string; monthly_turnover?: string; discount?: number }>(
      'http://212.41.28.206/api/v1/auth/profile/',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    console.log('✅ Юзер получен:', userData.id, userData.email)
    return { user: userData }

  } catch (error: any) {
    console.log('⚠️ Django профиль недоступен, декодирую JWT локально')
    
    const parts = accessToken.split('.')
    if (parts.length === 3) {
      try {
        const payload = JSON.parse(Buffer.from(parts[1]!, 'base64' as BufferEncoding).toString('utf8'))
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
          throw createError({ statusCode: 401, message: 'Токен истёк' })
        }
        return {
          user: {
            id: payload.user_id,
            email: payload.email || '',
            full_name: payload.full_name || '',
            role: payload.role || 'customer',
            permissions: payload.permissions || {},
            balance: '0',
            monthly_turnover: '0',
            discount: 0,
          }
        }
      } catch {
        throw createError({ statusCode: Number(error.statusCode) || 401, message: 'Невалидный токен' })
      }
    }
    throw createError({ statusCode: Number(error.statusCode) || 401, message: 'Невалидный токен' })
  }
})