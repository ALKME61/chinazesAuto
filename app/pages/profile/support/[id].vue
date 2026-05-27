<!-- pages/profile/support/[id].vue -->
<template>
    <div class="ticket-chat">
        <!-- Загрузка -->
        <div v-if="isLoading" class="chat-loading">
            <div class="spinner"></div>
            <p>Загрузка тикета...</p>
        </div>

        <!-- Контент -->
        <template v-else-if="ticket">
            <!-- Шапка -->
            <div class="chat-header">
                <NuxtLink to="/profile/support" class="back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#666" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    <span>Назад</span>
                </NuxtLink>

                <div class="ticket-info">
                    <div class="ticket-info__header">
                        <span class="ticket-id">{{ ticket.id }}</span>
                        <span class="ticket-status" :class="`status--${ticket.status}`">
                            {{ statusLabels[ticket.status] }}
                        </span>
                    </div>
                    <h2>{{ ticket.subject }}</h2>
                    <div class="ticket-meta">
                        <span>{{ categoryLabels[ticket.category] }}</span>
                        <span>•</span>
                        <span>{{ priorityLabels[ticket.priority] }}</span>
                        <span>•</span>
                        <span>Создан: {{ formatDate(ticket.createdAt) }}</span>
                    </div>
                </div>

                <!-- Кнопка закрытия -->
                <button v-if="ticket.status !== 'closed'" class="btn-close" @click="closeTicket" :disabled="isClosing">
                    {{ isClosing ? '...' : 'Закрыть тикет' }}
                </button>
            </div>

            <!-- Сообщения -->
            <div class="chat-messages" ref="messagesContainer">
                <div v-for="msg in ticket.messages" :key="msg.id" class="message"
                    :class="{ 'message--mine': msg.userId === currentUserId }">
                    <div class="message__avatar">
                        {{ getInitial(msg.userName) }}
                    </div>
                    <div class="message__content">
                        <div class="message__header">
                            <span class="message__author">{{ msg.userName }}</span>
                            <span class="message__role" v-if="msg.userRole === 'admin'">Поддержка</span>
                            <span class="message__time">{{ formatTime(msg.createdAt) }}</span>
                        </div>
                        <div class="message__text">{{ msg.content }}</div>

                        <!-- Вложения -->
                        <div v-if="msg.attachments?.length" class="message__attachments">
                            <a v-for="att in msg.attachments" :key="att.id" :href="`/api/tickets/files/${att.fileName}`"
                                target="_blank" class="attachment">
                                <span class="attachment__icon">{{ getFileIcon(att.mimeType) }}</span>
                                <span class="attachment__name">{{ att.fileName }}</span>
                                <span class="attachment__size">{{ formatSize(att.fileSize) }}</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div v-if="isTyping" class="typing-indicator">
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span class="typing-text">{{ typingUser }} печатает...</span>
                </div>
            </div>

            <!-- Форма отправки -->
            <div v-if="ticket.status !== 'closed'" class="chat-input">
                <textarea v-model="newMessage" placeholder="Введите сообщение..." rows="2"
                    @keydown.enter.exact.prevent="sendMessage" @input="onTyping" class="chat-textarea"></textarea>
                <button @click="sendMessage" :disabled="!newMessage.trim() || isSending" class="btn-send">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>

            <!-- Тикет закрыт -->
            <div v-else class="chat-closed">
                <p>Тикет закрыт. Создайте новое обращение, если проблема осталась.</p>
            </div>
        </template>

        <!-- Ошибка -->
        <div v-else class="chat-error">
            <p>Тикет не найден</p>
            <NuxtLink to="/profile/support">Вернуться к списку</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Ticket } from '~/types/ticket'
import { useAuthStore } from '~~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const ticket = ref<Ticket | null>(null)
const newMessage = ref('')
const isLoading = ref(true)
const isSending = ref(false)
const isClosing = ref(false)
const isTyping = ref(false)
const typingUser = ref('')
const messagesContainer = ref<HTMLDivElement>()

const currentUserId = computed(() => authStore.user?.id?.toString() || '')
let ws: WebSocket | null = null
let typingTimeout: NodeJS.Timeout | null = null

const statusLabels: Record<string, string> = {
  open: 'Открыт',
  waiting: 'Ожидает',
  in_progress: 'В работе',
  resolved: 'Решён',
  closed: 'Закрыт'
}


const categoryLabels: Record<string, string> = {
  order: 'Заказ',
  payment: 'Оплата',
  delivery: 'Доставка',
  product: 'Товар',
  account: 'Аккаунт'
}

const priorityLabels: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочный'
}

const formatDate = (date: string) => {
  if (!date) return '—'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return '—'
  }
}

const formatTime = (date: string) => {
  if (!date) return '—'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '—'
  }
}

const getInitial = (name: string) => {
  return name?.charAt(0)?.toUpperCase() || '?'
}

const getFileIcon = (mimeType: string) => {
  if (mimeType?.startsWith('image/')) return '🖼️'
  if (mimeType?.includes('pdf')) return '📄'
  if (mimeType?.includes('word')) return '📝'
  return '📎'
}

const formatSize = (bytes: number) => {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const onTyping = () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'typing',
      ticketId: route.params.id,
      userId: currentUserId.value,
      userName: authStore.user?.full_name || 'Пользователь'
    }))
  }

  clearTimeout(typingTimeout!)
  typingTimeout = setTimeout(() => {
    isTyping.value = false
  }, 2000)
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return

  const messageText = newMessage.value.trim()

  try {
    isSending.value = true
    newMessage.value = ''

    const response = await $fetch(`/api/tickets/${route.params.id}/messages`, {
      method: 'POST',
      body: { content: messageText }
    })

    const msg: any = response.message
    const newMsg = {
      ...msg,
      userName: msg.userName || msg.user_name,
      userId: msg.userId || msg.user_id,
      userRole: msg.userRole || msg.user_role,
      isRead: true,
      createdAt: msg.createdAt || msg.created_at,
      attachments: []
    }

    if (ticket.value) {
      ticket.value.messages.push(newMsg)
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'new_message',
        ticketId: route.params.id,
        message: newMsg
      }))
    }

    scrollToBottom()
  } catch (error) {
    console.error('Ошибка отправки:', error)
    newMessage.value = messageText
  } finally {
    isSending.value = false
  }
}

const closeTicket = async () => {
  if (!confirm('Вы уверены, что хотите закрыть тикет?')) return

  try {
    isClosing.value = true
    await $fetch(`/api/tickets/${route.params.id}/status`, {
      method: 'PATCH',
      body: { status: 'closed' }
    })

    if (ticket.value) {
      ticket.value.status = 'closed'
      ticket.value.closedAt = new Date().toISOString()
    }
  } catch (error) {
    console.error('Ошибка закрытия:', error)
  } finally {
    isClosing.value = false
  }
}

const connectWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${window.location.host}/ws`

  ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    ws?.send(JSON.stringify({
      type: 'join',
      ticketId: route.params.id,
      userId: currentUserId.value,
      userName: authStore.user?.full_name || 'Пользователь'
    }))
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      if (data.type === 'typing' && data.userId !== currentUserId.value) {
        isTyping.value = true
        typingUser.value = data.userName
        clearTimeout(typingTimeout!)
        typingTimeout = setTimeout(() => {
          isTyping.value = false
        }, 2000)
      }

      if (data.type === 'new_message' && data.message.userId !== currentUserId.value) {
        if (ticket.value) {
          const msg = data.message
          ticket.value.messages.push({
            ...msg,
            userName: msg.userName || msg.user_name,
            userId: msg.userId || msg.user_id,
            userRole: msg.userRole || msg.user_role,
            createdAt: msg.createdAt || msg.created_at,
          })
          scrollToBottom()
        }
      }
    } catch (error) {
      console.error('Ошибка обработки сообщения:', error)
    }
  }

  ws.onclose = () => {
    setTimeout(connectWebSocket, 3000)
  }

  ws.onerror = (error) => {
    console.error('WebSocket ошибка:', error)
  }
}

const loadTicket = async () => {
  try {
    isLoading.value = true
    const data = await $fetch<{ ticket: any }>(`/api/tickets/${route.params.id}`)

    if (data.ticket) {
      data.ticket.userName = data.ticket.user_name; data.ticket.userId = data.ticket.user_id; data.ticket.userEmail = data.ticket.user_email
      data.ticket.createdAt = data.ticket.created_at; data.ticket.updatedAt = data.ticket.updated_at; data.ticket.closedAt = data.ticket.closed_at
      data.ticket.messages?.forEach((msg: any) => { msg.userName = msg.user_name; msg.userId = msg.user_id; msg.userRole = msg.user_role; msg.createdAt = msg.created_at })
    }

    ticket.value = data.ticket
    scrollToBottom()
  } catch (error) {
    console.error('Ошибка загрузки:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTicket()
  connectWebSocket()
})

onUnmounted(() => {
  if (ws) {
    ws.send(JSON.stringify({
      type: 'leave',
      ticketId: route.params.id
    }))
    ws.close()
  }
  clearTimeout(typingTimeout!)
})
</script>

<style scoped lang="scss">
.ticket-chat {
    background: #fff;
    border-radius: 2.4rem;
    box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
    min-height: 500px;
}

.chat-header {
    padding: 2rem 2.4rem;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: flex-start;
    gap: 1.6rem;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #666;
    text-decoration: none;
    font-size: 1.3rem;
    white-space: nowrap;
    padding-top: 0.4rem;

    &:hover {
        color: #2d2d2d;
    }
}

.ticket-info {
    flex: 1;
}

.ticket-info__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.8rem;
}

.ticket-id {
    font-size: 1.3rem;
    font-weight: 600;
    color: #666;
    font-family: monospace;
    background: #f5f5f5;
    padding: 0.3rem 0.8rem;
    border-radius: 0.6rem;
}

.ticket-status {
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    font-size: 1.2rem;
    font-weight: 500;

    &.status--open {
        background: #fff3e0;
        color: #e65100;
    }

    &.status--waiting {
        background: #e3f2fd;
        color: #1565c0;
    }

    &.status--in_progress {
        background: #f3e5f5;
        color: #7b1fa2;
    }

    &.status--resolved {
        background: #e8f5e9;
        color: #2e7d32;
    }

    &.status--closed {
        background: #f5f5f5;
        color: #616161;
    }
}

.ticket-info h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #2d2d2d;
    margin-bottom: 0.6rem;
}

.ticket-meta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.3rem;
    color: #b0b0b0;
}

.btn-close {
    padding: 0.8rem 1.6rem;
    border: 1px solid #ffcccc;
    background: #fff;
    color: #ff4d4d;
    border-radius: 1rem;
    font-size: 1.3rem;
    cursor: pointer;
    white-space: nowrap;

    &:hover:not(:disabled) {
        background: #fff0f0;
    }

    &:disabled {
        opacity: 0.5;
    }
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 2rem 2.4rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
}

.message {
    display: flex;
    gap: 1.2rem;
    max-width: 80%;

    &--mine {
        align-self: flex-end;
        flex-direction: row-reverse;

        .message__content {
            background: $green;

            .message__author {
                color: rgba(255, 255, 255, 0.8);
            }

            .message__role {
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
            }

            .message__time {
                color: rgba(255, 255, 255, 0.7);
            }

            .message__text {
                color: #fff;
            }
        }

        .message__avatar {
            background: $green;
            color: #fff;
        }
    }
}

.message__avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: #f0f0f0;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.6rem;
    flex-shrink: 0;
}

.message__content {
    background: #f8f9fa;
    padding: 1.2rem 1.6rem;
    border-radius: 1.6rem;
    min-width: 0;
}

.message__header {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 0.6rem;
}

.message__author {
    font-size: 1.3rem;
    font-weight: 600;
    color: #2d2d2d;
}

.message__role {
    font-size: 1.1rem;
    padding: 0.2rem 0.6rem;
    background: #e3f2fd;
    color: #1565c0;
    border-radius: 0.4rem;
    font-weight: 500;
}

.message__time {
    font-size: 1.1rem;
    color: #b0b0b0;
    margin-left: auto;
}

.message__text {
    font-size: 1.4rem;
    color: #2d2d2d;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
}

.message__attachments {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.attachment {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem 1.2rem;
    background: #fff;
    border-radius: 0.8rem;
    text-decoration: none;
    font-size: 1.3rem;

    &:hover {
        background: #f0f0f0;
    }
}

.attachment__icon {
    font-size: 1.6rem;
}

.attachment__name {
    color: #2d2d2d;
    flex: 1;
}

.attachment__size {
    color: #b0b0b0;
    font-size: 1.2rem;
}

.typing-indicator {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem 0;
}

.typing-dots {
    display: flex;
    gap: 0.3rem;

    span {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background: #b0b0b0;
        animation: typing 1.4s infinite;

        &:nth-child(2) {
            animation-delay: 0.2s;
        }

        &:nth-child(3) {
            animation-delay: 0.4s;
        }
    }
}

@keyframes typing {

    0%,
    60%,
    100% {
        opacity: 0.3;
    }

    30% {
        opacity: 1;
    }
}

.typing-text {
    font-size: 1.3rem;
    color: #b0b0b0;
    font-style: italic;
}

.chat-input {
    padding: 1.6rem 2.4rem;
    border-top: 1px solid #f0f0f0;
    display: flex;
    gap: 1.2rem;
    align-items: flex-end;
}

.chat-textarea {
    flex: 1;
    padding: 1rem 1.4rem;
    border: 2px solid #e0e0e0;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    color: #2d2d2d;
    font-family: inherit;
    resize: none;
    min-height: 4.4rem;

    &:focus {
        outline: none;
        border-color: $green;
    }
}

.btn-send {
    width: 4.4rem;
    height: 4.4rem;
    border: none;
    background: $green;
    color: #fff;
    border-radius: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &:hover:not(:disabled) {
        background: darken($green, 5%);
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
}

.chat-closed {
    padding: 2rem 2.4rem;
    text-align: center;
    border-top: 1px solid #f0f0f0;

    p {
        color: #9a9a9a;
        font-size: 1.4rem;
    }
}

.chat-loading {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.6rem;

    .spinner {
        width: 4rem;
        height: 4rem;
        border: 3px solid #e0e0e0;
        border-top-color: $green;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    p {
        color: #9a9a9a;
        font-size: 1.4rem;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.chat-error {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.6rem;

    p {
        font-size: 1.6rem;
        color: #666;
    }

    a {
        color: $green;
        font-size: 1.4rem;
    }
}

@media (max-width: 768px) {
    .ticket-chat {
        height: calc(100vh - 120px);
    }

    .message {
        max-width: 90%;
    }

    .chat-header {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>