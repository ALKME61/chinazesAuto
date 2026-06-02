// server/utils/getUser.ts
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = Buffer.from(parts[1]!, 'base64' as BufferEncoding).toString('utf8')
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export async function getUserFromToken(event: any) {
  const accessToken = getCookie(event, 'access_token')

  if (!accessToken) return null

  try {
    const payload = decodeJwtPayload(accessToken)
    if (!payload) return null

    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) return null

    return {
      id: payload.user_id,
      pk: payload.user_id,
      email: payload.email || '',
      role: payload.role || 'customer',
      permissions: payload.permissions || {},
      full_name: payload.full_name || '',
    }
  } catch {
    return null
  }
}
