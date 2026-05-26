// server/api/debug/tickets.get.ts
import { db } from '../../utils/database'

export default defineEventHandler(async () => {
  try {
    const tickets = db.prepare('SELECT id, user_id, subject, category, status FROM tickets').all()
    const messages = db.prepare('SELECT * FROM ticket_messages').all()
    
    return { 
      success: true,
      ticketsCount: tickets.length,
      tickets,
      messagesCount: messages.length,
      messages
    }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    }
  }
})