// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  // Очищаем обе куки с теми же параметрами, что и при установке
  deleteCookie(event, 'access_token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  
  deleteCookie(event, 'refresh_token', {
    path: '/api/auth',  // ← важно! тот же path, что при установке
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  return { ok: true }
})