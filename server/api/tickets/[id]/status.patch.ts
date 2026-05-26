// server/api/tickets/[id]/status.patch.ts
export default defineEventHandler(async (event) => {
  const user = await getUserFromToken(event)
  if (!user) throw createError({ statusCode: 401 })

  const ticketId = getRouterParam(event, 'id')
  if (!ticketId) throw createError({ statusCode: 400 })

  const { status } = await readBody(event)
  
  const validStatuses = ['open', 'waiting', 'in_progress', 'resolved', 'closed']
  if (!validStatuses.includes(status)) {
    throw createError({ statusCode: 400, message: 'Неверный статус' })
  }

  const ticket = getTicketById(ticketId)
  if (!ticket) {
    throw createError({ statusCode: 404, message: 'Тикет не найден' })
  }

  // Админ может менять на любой статус
  // Клиент может только закрыть
  if (!user.permissions?.can_access_admin_panel) {
    if (status !== 'closed' || ticket.userId !== user.id.toString()) {
      throw createError({ statusCode: 403 })
    }
  }

  updateTicketStatus(
    ticketId, 
    status, 
    user.id.toString(), 
    user.full_name || `${user.first_name} ${user.last_name}`
  )

  return { success: true, status }
})