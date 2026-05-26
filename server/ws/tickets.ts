// server/routes/ws/tickets.ts
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Заглушка для WebSocket (надо настроить nitro WebSocket)
  return 'WebSocket endpoint'
})