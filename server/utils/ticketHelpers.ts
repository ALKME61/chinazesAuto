import { db } from './database'
import type { Ticket, TicketMessage, TicketStatus, TicketCategory } from '~/types/ticket'
import { CATEGORY_PRIORITY } from '~/types/ticket'

// Убедись что generateId объявлена ДО её использования
function generateId(): string {
  return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// server/utils/ticketHelpers.ts
export function getTickets(filters?: {
  userId?: string
  status?: TicketStatus
  category?: TicketCategory
  search?: string
  page?: number
  limit?: number
}) {
  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const offset = (page - 1) * limit

  let query = 'SELECT * FROM tickets WHERE 1=1'
  const params: any[] = []

  // ✅ Проверяем userId
  if (filters?.userId) {
    query += ' AND user_id = ?'
    params.push(filters.userId)
    console.log('🔍 Фильтр по userId:', filters.userId)
  }

  if (filters?.status) {
    query += ' AND status = ?'
    params.push(filters.status)
  }

  if (filters?.category) {
    query += ' AND category = ?'
    params.push(filters.category)
  }

  if (filters?.search) {
    query += ' AND (subject LIKE ? OR id LIKE ?)'
    params.push(`%${filters.search}%`, `%${filters.search}%`)
  }

  // Общее количество
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total')
  const { total } = db.prepare(countQuery).get(...params) as any

  // Пагинация
  query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)

  const tickets = db.prepare(query).all(...params) as any[]

  const result = tickets.map(ticket => ({
    ...ticket,
    messages: getTicketMessages(ticket.id),
    logs: getTicketLogs(ticket.id)
  }))

  return {
    tickets: result,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

export function getTicketById(id: string): Ticket | undefined {
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id) as any
  if (!ticket) return undefined

  return {
    ...ticket,
    messages: getTicketMessages(id),
    logs: getTicketLogs(id)
  }
}

function getTicketMessages(ticketId: string): TicketMessage[] {
  const messages = db.prepare(
    'SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC'
  ).all(ticketId) as any[]

  return messages.map(msg => ({
    ...msg,
    isRead: Boolean(msg.is_read),
    attachments: getMessageAttachments(msg.id)
  }))
}

function getMessageAttachments(messageId: string) {
  return db.prepare(
    'SELECT * FROM ticket_attachments WHERE message_id = ?'
  ).all(messageId)
}

function getTicketLogs(ticketId: string) {
  return db.prepare(
    'SELECT * FROM ticket_logs WHERE ticket_id = ? ORDER BY created_at ASC'
  ).all(ticketId)
}

export function createTicket(data: {
  userId: string
  userName: string
  userEmail: string
  subject: string
  message: string
  category: TicketCategory
}): Ticket {
  const id = generateId()
  const priority = CATEGORY_PRIORITY[data.category]
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO tickets (id, user_id, user_name, user_email, subject, category, priority, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)
  `).run(id, data.userId, data.userName, data.userEmail, data.subject, data.category, priority, now, now)

  // Первое сообщение
  const messageId = `${id}-msg-1`
  db.prepare(`
    INSERT INTO ticket_messages (id, ticket_id, user_id, user_name, user_role, content, created_at)
    VALUES (?, ?, ?, ?, 'customer', ?, ?)
  `).run(messageId, id, data.userId, data.userName, data.message, now)

  // Лог создания
  addLog(id, data.userId, data.userName, 'created', null, 'open')

  return getTicketById(id)!
}

export function addMessage(ticketId: string, data: {
  userId: string
  userName: string
  userRole: string
  content: string
}): TicketMessage {
  const messageId = `${ticketId}-msg-${Date.now()}`
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO ticket_messages (id, ticket_id, user_id, user_name, user_role, content, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(messageId, ticketId, data.userId, data.userName, data.userRole, data.content, now)

  // Обновляем дату тикета
  db.prepare('UPDATE tickets SET updated_at = ? WHERE id = ?').run(now, ticketId)

  return db.prepare('SELECT * FROM ticket_messages WHERE id = ?').get(messageId) as any
}

export function updateTicketStatus(
  ticketId: string,
  newStatus: TicketStatus,
  userId: string,
  userName: string
) {
  const ticket = db.prepare('SELECT status FROM tickets WHERE id = ?').get(ticketId) as any
  if (!ticket) throw new Error('Тикет не найден')

  const now = new Date().toISOString()
  const updates: any = { status: newStatus, updated_at: now }

  if (newStatus === 'closed') {
    updates.closed_at = now
  }

  db.prepare(`
    UPDATE tickets SET status = ?, updated_at = ?, closed_at = ? WHERE id = ?
  `).run(newStatus, now, updates.closed_at || null, ticketId)

  // Логируем
  addLog(ticketId, userId, userName, 'status_change', ticket.status, newStatus)
}

export function saveAttachment(data: {
  messageId: string
  ticketId: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
}) {
  const id = generateId()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO ticket_attachments (id, message_id, ticket_id, file_name, file_path, file_size, mime_type, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, data.messageId, data.ticketId, data.fileName, data.filePath, data.fileSize, data.mimeType, now)

  return id
}

function addLog(
  ticketId: string,
  userId: string,
  userName: string,
  action: string,
  oldValue?: string | null,
  newValue?: string | null
) {
  const id = generateId()
  const now = new Date().toISOString()

  db.prepare(`
    INSERT INTO ticket_logs (id, ticket_id, user_id, user_name, action, old_value, new_value, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, ticketId, userId, userName, action, oldValue || null, newValue || null, now)
}