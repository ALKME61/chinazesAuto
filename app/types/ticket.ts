// types/ticket.ts
export type TicketCategory = 'order' | 'payment' | 'delivery' | 'product' | 'account'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'waiting' | 'in_progress' | 'resolved' | 'closed'

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  order: 'Проблемы с заказом',
  payment: 'Оплата и возвраты',
  delivery: 'Доставка',
  product: 'Товары и наличие',
  account: 'Аккаунт и доступ'
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочный'
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Открыт',
  waiting: 'Ожидает ответа',
  in_progress: 'В работе',
  resolved: 'Решён',
  closed: 'Закрыт'
}

// Авто-приоритеты по категориям
export const CATEGORY_PRIORITY: Record<TicketCategory, TicketPriority> = {
  order: 'high',
  payment: 'high',
  delivery: 'medium',
  account: 'medium',
  product: 'low'
}

export interface TicketAttachment {
  id: string
  messageId: string
  ticketId: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  createdAt: string
}

export interface TicketMessage {
  id: string
  ticketId: string
  userId: string
  userName: string
  userRole: string
  content: string
  attachments?: TicketAttachment[]
  isRead: boolean
  createdAt: string
}

export interface TicketLog {
  id: string
  ticketId: string
  userId: string
  userName: string
  action: string
  oldValue?: string
  newValue?: string
  createdAt: string
}

export interface Ticket {
  id: string
  userId: string
  userName: string
  userEmail: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  messages: TicketMessage[]
  logs: TicketLog[]
  createdAt: string
  updatedAt: string
  closedAt?: string
}

export interface CreateTicketDTO {
  subject: string
  message: string
  category: TicketCategory
  files?: File[]
}