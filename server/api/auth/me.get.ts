// server/api/auth/me.get.ts
export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  
  if (!accessToken) {
    throw createError({ statusCode: 401, message: 'Нет токена доступа' })
  }
  console.log('🍪 access_token:', accessToken ? 'есть' : 'нет')
  try {
    // Django возвращает сразу объект юзера
    const userData = await $fetch(
      'http://212.41.28.206/api/v1/auth/profile/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    return { user: userData }  // ← оборачиваем в { user } для клиента
    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: 'Невалидный токен'
    })
  }
})