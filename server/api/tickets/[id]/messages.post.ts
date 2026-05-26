// server/api/tickets/[id]/messages.post.ts
export default defineEventHandler(async (event) => {
  const user = await getUserFromToken(event)
  if (!user) throw createError({ statusCode: 401 })

  const ticketId = getRouterParam(event, 'id')
  if (!ticketId) throw createError({ statusCode: 400 })

  const ticket = getTicketById(ticketId)
  if (!ticket) {
    throw createError({ statusCode: 404, message: 'Тикет не найден' })
  }

  // Проверка прав
  if (!user.permissions?.can_access_admin_panel && ticket.userId !== user.id.toString()) {
    throw createError({ statusCode: 403 })
  }

  if (ticket.status === 'closed') {
    throw createError({ statusCode: 400, message: 'Тикет закрыт' })
  }

  const body = await readBody(event)
  
  if (!body.content || body.content.length < 2) {
    throw createError({ statusCode: 400, message: 'Сообщение слишком короткое' })
  }

  const message = addMessage(ticketId, {
    userId: user.id.toString(),
    userName: user.full_name || `${user.first_name} ${user.last_name}`,
    userRole: user.permissions?.can_access_admin_panel ? 'admin' : 'customer',
    content: body.content
  })

  // Если админ отвечает — меняем статус
  if (user.permissions?.can_access_admin_panel && ticket.status === 'open') {
    updateTicketStatus(ticketId, 'waiting', user.id.toString(), user.full_name)
  }

  // Если клиент отвечает на ответ админа
  if (!user.permissions?.can_access_admin_panel && ticket.status === 'waiting') {
    updateTicketStatus(ticketId, 'in_progress', user.id.toString(), user.full_name)
  }

  return { message }
})