// server/api/debug/clear-tickets.get.ts
import { db } from '../../utils/database'

export default defineEventHandler(async () => {
  db.prepare('DELETE FROM ticket_messages').run()
  db.prepare('DELETE FROM ticket_attachments').run()
  db.prepare('DELETE FROM ticket_logs').run()
  db.prepare('DELETE FROM tickets').run()
  
  return { success: true, message: 'Все тикеты удалены' }
})