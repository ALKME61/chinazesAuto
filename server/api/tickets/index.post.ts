// server/api/tickets/index.post.ts
import { createTicket } from '../../utils/ticketHelpers'

export default defineEventHandler(async (event) => {
  const user = await getUserFromToken(event)
  if (!user) throw createError({ statusCode: 401 })

  const body = await readBody(event)
  
  // Валидация
  if (!body.subject || !body.message || !body.category) {
    throw createError({ statusCode: 400, message: 'Заполните все обязательные поля' })
  }

  if (body.subject.length < 5) {
    throw createError({ statusCode: 400, message: 'Тема должна быть не менее 5 символов' })
  }

  if (body.message.length < 10) {
    throw createError({ statusCode: 400, message: 'Сообщение должно быть не менее 10 символов' })
  }

  const validCategories = ['order', 'payment', 'delivery', 'product', 'account']
  if (!validCategories.includes(body.category)) {
    throw createError({ statusCode: 400, message: 'Неверная категория' })
  }

  const ticket = createTicket({
    userId: user.id.toString(),
    userName: user.full_name || `${user.first_name} ${user.last_name}`,
    userEmail: user.email,
    subject: body.subject,
    message: body.message,
    category: body.category
  })

  console.log('✅ Тикет создан:', ticket.id)

  return { ticket }
})