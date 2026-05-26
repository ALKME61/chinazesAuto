// server/api/tickets/[id].get.ts
export default defineEventHandler(async (event) => {
  const user = await getUserFromToken(event)
  if (!user) throw createError({ statusCode: 401 })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400 })

  const ticket = getTicketById(id)
  if (!ticket) {
    throw createError({ statusCode: 404, message: 'Тикет не найден' })
  }

  // Клиент может видеть только свои тикеты
  if (!user.permissions?.can_access_admin_panel && ticket.userId !== user.id.toString()) {
    throw createError({ statusCode: 403, message: 'Доступ запрещён' })
  }

  // Отмечаем сообщения как прочитанные
  db.prepare(`
    UPDATE ticket_messages 
    SET is_read = 1 
    WHERE ticket_id = ? AND user_id != ?
  `).run(id, user.id.toString())

  return { ticket }
})