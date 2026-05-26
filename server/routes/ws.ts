// server/routes/ws.ts
import { defineWebSocketHandler } from 'h3'

const rooms = new Map<string, Set<any>>()

export default defineWebSocketHandler({
  open(peer) {
    console.log('🔌 WebSocket подключён:', peer.id)
  },

  message(peer, message) {
    try {
      const data = JSON.parse(message.text())
      
      switch (data.type) {
        case 'join':
          const roomId = data.ticketId
          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set())
          }
          rooms.get(roomId)!.add(peer)
          console.log(`👤 ${data.userName} присоединился к тикету ${roomId}`)
          break

        case 'leave':
          const leaveRoom = data.ticketId
          if (rooms.has(leaveRoom)) {
            rooms.get(leaveRoom)!.delete(peer)
            console.log(`👤 Пользователь покинул тикет ${leaveRoom}`)
          }
          break

        case 'typing':
          const typingRoom = data.ticketId
          if (rooms.has(typingRoom)) {
            rooms.get(typingRoom)!.forEach((client: any) => {
              if (client !== peer) {
                client.send(JSON.stringify({
                  type: 'typing',
                  userId: data.userId,
                  userName: data.userName
                }))
              }
            })
          }
          break

        case 'new_message':
          const msgRoom = data.ticketId
          if (rooms.has(msgRoom)) {
            rooms.get(msgRoom)!.forEach((client: any) => {
              if (client !== peer) {
                client.send(JSON.stringify({
                  type: 'new_message',
                  ticketId: data.ticketId,
                  message: data.message
                }))
              }
            })
          }
          break
      }
    } catch (error) {
      console.error('WebSocket ошибка:', error)
    }
  },

  close(peer) {
    rooms.forEach((clients, roomId) => {
      clients.delete(peer)
      if (clients.size === 0) {
        rooms.delete(roomId)
      }
    })
    console.log('🔌 WebSocket отключён:', peer.id)
  }
})