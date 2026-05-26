// server/api/captcha/generate.get.ts
export default defineEventHandler(async (event) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let text = ''
  for (let i = 0; i < 5; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  // Сохраняем в cookie вместо сессии
  setCookie(event, 'captcha_code', text, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 5, // 5 минут
    path: '/',
  })

  return { captcha: text }
})