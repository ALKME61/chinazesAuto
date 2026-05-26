// server/utils/getUser.ts
export async function getUserFromToken(event: any) {
  const accessToken = getCookie(event, 'access_token')
  console.log('🔑 accessToken:', accessToken ? 'есть' : 'НЕТ')
  
  if (!accessToken) return null

  try {
    const userData = await $fetch('http://212.41.28.206/api/v1/auth/profile/', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    console.log('👤 Пользователь:', userData.id, userData.email)
    return userData
  } catch (error) {
    console.log('❌ Ошибка получения пользователя:', error)
    return null
  }
}