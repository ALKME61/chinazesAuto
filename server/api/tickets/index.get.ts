// server/api/tickets/index.get.ts
export default defineEventHandler(async (event) => {
  const user = await getUserFromToken(event)
  if (!user) throw createError({ statusCode: 401 })

  const query = getQuery(event)
  
  // ✅ Берем userId из токена, а не из query
  const userId = user.id?.toString() || user.pk?.toString()
  
  console.log('👤 Пользователь:', userId, '| роль:', user.role, '| права:', user.permissions)

  const result = getTickets({
    userId: user.permissions?.can_access_admin_panel ? (query.userId?.toString() || undefined) : userId,
    status: query.status as any,
    category: query.category as any,
    search: query.search?.toString(),
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 10
  })

  return result
})