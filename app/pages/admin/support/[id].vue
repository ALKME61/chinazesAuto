<script setup lang="ts">
import type { Ticket } from '~/types/ticket'
import { useAuthStore } from '~~/stores/auth'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const authStore = useAuthStore()
const ticket = ref<Ticket | null>(null)
const newMessage = ref('')
const isLoading = ref(true)
const isSending = ref(false)
const isUpdatingStatus = ref(false)
const isTyping = ref(false)
const typingUser = ref('')
const messagesContainer = ref<HTMLDivElement>()

const currentUserId = computed(() => authStore.user?.id?.toString() || '')

let ws: WebSocket | null = null
let typingTimeout: ReturnType<typeof setTimeout> | null = null

const statusConfig: Record<string, { label: string; class: string }> = {
  open: { label: 'Открыт', class: 'status--open' },
  waiting: { label: 'Ожидает', class: 'status--waiting' },
  in_progress: { label: 'В работе', class: 'status--in_progress' },
  resolved: { label: 'Решён', class: 'status--resolved' },
  closed: { label: 'Закрыт', class: 'status--closed' },
}

const statusActions = computed(() => {
  if (!ticket.value) return []
  const s = ticket.value.status
  const actions: { label: string; status: string; class: string }[] = []
  if (s === 'open') { actions.push({ label: 'Взять в работу', status: 'in_progress', class: 'btn--primary' }, { label: 'Ожидает', status: 'waiting', class: 'btn--secondary' }) }
  if (s === 'waiting' || s === 'in_progress') { actions.push({ label: 'Решён', status: 'resolved', class: 'btn--success' }, { label: 'Вернуть в работу', status: 'in_progress', class: 'btn--secondary' }) }
  if (s !== 'closed') actions.push({ label: 'Закрыть', status: 'closed', class: 'btn--danger' })
  return actions
})

const categoryLabels: Record<string, string> = { order: 'Заказ', payment: 'Оплата', delivery: 'Доставка', product: 'Товар', account: 'Аккаунт' }
const priorityLabels: Record<string, string> = { low: 'Низкий', medium: 'Средний', high: 'Высокий', urgent: 'Срочный' }

const formatDate = (date: string) => { if (!date) return '—'; try { const d = new Date(date); if (isNaN(d.getTime())) return '—'; return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) } catch { return '—' } }
const formatTime = (date: string) => { if (!date) return '—'; try { const d = new Date(date); if (isNaN(d.getTime())) return '—'; return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) } catch { return '—' } }
const getInitial = (name: string) => name?.charAt(0)?.toUpperCase() || '?'
const getFileIcon = (mimeType: string) => { if (mimeType?.startsWith('image/')) return '🖼️'; if (mimeType?.includes('pdf')) return '📄'; if (mimeType?.includes('word')) return '📝'; return '📎' }
const formatSize = (bytes: number) => { if (!bytes) return '0 B'; if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; return `${(bytes / (1024 * 1024)).toFixed(1)} MB` }

const scrollToBottom = () => { nextTick(() => { if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight }) }

const changeStatus = async (status: string) => {
  isUpdatingStatus.value = true
  try { await $fetch(`/api/tickets/${route.params.id}/status`, { method: 'PATCH', body: { status } }); if (ticket.value) ticket.value.status = status as Ticket['status'] }
  catch (e) { console.error('Ошибка смены статуса:', e) }
  finally { isUpdatingStatus.value = false }
}

const onTyping = () => {
  if (ws && ws.readyState === WebSocket.OPEN) { ws.send(JSON.stringify({ type: 'typing', ticketId: route.params.id, userId: currentUserId.value, userName: authStore.user?.full_name || 'Администратор' })) }
  if (typingTimeout) clearTimeout(typingTimeout); typingTimeout = setTimeout(() => { isTyping.value = false }, 2000)
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return; const messageText = newMessage.value.trim()
  try { isSending.value = true; newMessage.value = ''
    const response = await $fetch(`/api/tickets/${route.params.id}/messages`, { method: 'POST', body: { content: messageText } })
    const msg: any = response.message; const newMsg = { ...msg, userName: msg.userName || msg.user_name, userId: msg.userId || msg.user_id, userRole: msg.userRole || msg.user_role, isRead: true, createdAt: msg.createdAt || msg.created_at, attachments: [] }
    if (ticket.value) ticket.value.messages.push(newMsg)
    if (ws && ws.readyState === WebSocket.OPEN) { ws.send(JSON.stringify({ type: 'new_message', ticketId: route.params.id, message: newMsg })) }
    scrollToBottom()
  } catch (e) { console.error('Ошибка отправки:', e); newMessage.value = messageText }
  finally { isSending.value = false }
}

const connectWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'; const wsUrl = `${protocol}//${window.location.host}/ws`; ws = new WebSocket(wsUrl)
  ws.onopen = () => { ws?.send(JSON.stringify({ type: 'join', ticketId: route.params.id, userId: currentUserId.value, userName: authStore.user?.full_name || 'Администратор' })) }
  ws.onmessage = (event) => { try { const data = JSON.parse(event.data)
    if (data.type === 'typing' && data.userId !== currentUserId.value) { isTyping.value = true; typingUser.value = data.userName; if (typingTimeout) clearTimeout(typingTimeout); typingTimeout = setTimeout(() => { isTyping.value = false }, 2000) }
    if (data.type === 'new_message' && data.message.userId !== currentUserId.value) { if (ticket.value) { const msg = data.message; ticket.value.messages.push({ ...msg, userName: msg.userName || msg.user_name, userId: msg.userId || msg.user_id, userRole: msg.userRole || msg.user_role, createdAt: msg.createdAt || msg.created_at }); scrollToBottom() } }
  } catch (e) { console.error('WS error:', e) } }
  ws.onclose = () => { setTimeout(connectWebSocket, 3000) }
  ws.onerror = (e) => { console.error('WebSocket error:', e) }
}

const loadTicket = async () => { try { isLoading.value = true; const data = await $fetch<{ ticket: any }>(`/api/tickets/${route.params.id}`)
  if (data.ticket) { data.ticket.userName = data.ticket.user_name; data.ticket.userId = data.ticket.user_id; data.ticket.userEmail = data.ticket.user_email; data.ticket.createdAt = data.ticket.created_at; data.ticket.updatedAt = data.ticket.updated_at; data.ticket.closedAt = data.ticket.closed_at; data.ticket.messages?.forEach((msg: any) => { msg.userName = msg.user_name; msg.userId = msg.user_id; msg.userRole = msg.user_role; msg.createdAt = msg.created_at }) }
  ticket.value = data.ticket; scrollToBottom() } catch (e) { console.error('Load error:', e) } finally { isLoading.value = false } }

onMounted(() => { loadTicket(); connectWebSocket() })
onUnmounted(() => { if (ws) { ws.send(JSON.stringify({ type: 'leave', ticketId: route.params.id })); ws.close() }; if (typingTimeout) clearTimeout(typingTimeout) })
</script>

<template>
  <section class="ticket-detail">
    <NuxtLink to="/admin/support" class="back-link"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>К списку обращений</span></NuxtLink>
    <div v-if="isLoading" class="loading-state">Загрузка обращения...</div>
    <template v-else-if="ticket">
      <div class="ticket-panels">
        <div class="ticket-chat">
          <div class="chat-header">
            <div class="ticket-info">
              <div class="ticket-info__top"><span class="ticket-id">{{ ticket.id }}</span><span class="ticket-status" :class="statusConfig[ticket.status]?.class">{{ statusConfig[ticket.status]?.label || ticket.status }}</span></div>
              <h2>{{ ticket.subject }}</h2>
              <div class="ticket-meta"><span>{{ categoryLabels[ticket.category] || ticket.category }}</span><span>•</span><span>{{ priorityLabels[ticket.priority] || ticket.priority }}</span><span>•</span><span>Создан: {{ formatDate(ticket.createdAt) }}</span><span v-if="ticket.closedAt">•</span><span v-if="ticket.closedAt">Закрыт: {{ formatDate(ticket.closedAt) }}</span></div>
            </div>
          </div>
          <div class="chat-messages" ref="messagesContainer">
            <div v-for="msg in ticket.messages" :key="msg.id" class="message" :class="{ 'message--mine': msg.userId === currentUserId }">
              <div class="message__avatar">{{ getInitial(msg.userName) }}</div>
              <div class="message__content">
                <div class="message__header"><span class="message__author">{{ msg.userName }}</span><span v-if="msg.userRole === 'admin'" class="message__role">Поддержка</span><span v-if="msg.userRole === 'customer'" class="message__role message__role--user">Клиент</span><span class="message__time">{{ formatTime(msg.createdAt) }}</span></div>
                <div class="message__text">{{ msg.content }}</div>
                <div v-if="msg.attachments?.length" class="message__attachments"><a v-for="att in msg.attachments" :key="att.id" :href="`/api/tickets/files/${att.fileName}`" target="_blank" class="attachment"><span class="attachment__icon">{{ getFileIcon(att.mimeType) }}</span><span class="attachment__name">{{ att.fileName }}</span><span class="attachment__size">{{ formatSize(att.fileSize) }}</span></a></div>
              </div>
            </div>
            <div v-if="isTyping" class="typing-indicator"><div class="typing-dots"><span/><span/><span/></div><span class="typing-text">{{ typingUser }} печатает...</span></div>
          </div>
          <div v-if="ticket.status !== 'closed'" class="chat-input"><textarea v-model="newMessage" placeholder="Введите ответ..." rows="2" class="chat-textarea" @keydown.enter.exact.prevent="sendMessage" @input="onTyping"/><button class="btn-send" :disabled="!newMessage.trim() || isSending" @click="sendMessage"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
          <div v-else class="chat-closed"><p>Тикет закрыт</p></div>
        </div>
        <aside class="ticket-sidebar">
          <div class="sidebar-block"><h3>Клиент</h3><div class="user-card"><div class="user-card__avatar">{{ getInitial(ticket.userName) }}</div><div class="user-card__info"><strong>{{ ticket.userName }}</strong><span>{{ ticket.userEmail }}</span></div></div></div>
          <div class="sidebar-block"><h3>Информация</h3><div class="info-list"><div class="info-row"><span>Категория</span><strong>{{ categoryLabels[ticket.category] || ticket.category }}</strong></div><div class="info-row"><span>Приоритет</span><strong>{{ priorityLabels[ticket.priority] || ticket.priority }}</strong></div><div class="info-row"><span>Создан</span><strong>{{ formatDate(ticket.createdAt) }}</strong></div><div class="info-row"><span>Сообщений</span><strong>{{ ticket.messages?.length || 0 }}</strong></div></div></div>
          <div v-if="statusActions.length" class="sidebar-block"><h3>Управление статусом</h3><div class="status-actions"><button v-for="action in statusActions" :key="action.status" :class="['btn-status', action.class]" :disabled="isUpdatingStatus" @click="changeStatus(action.status)">{{ action.label }}</button></div></div>
        </aside>
      </div>
    </template>
    <div v-else class="error-state"><p>Обращение не найдено</p><NuxtLink to="/admin/support">Вернуться к списку</NuxtLink></div>
  </section>
</template>

<style scoped lang="scss">
.ticket-detail { display: flex; flex-direction: column; gap: 1.6rem; }
.back-link { display: inline-flex; align-items: center; gap: 0.6rem; color: #666; text-decoration: none; font-size: 1.4rem; width: fit-content; &:hover { color: $green; } }
.loading-state, .error-state { padding: 4rem 0; text-align: center; color: #9a9a9a; font-size: 1.5rem; a { color: $green; font-size: 1.4rem; } }
.ticket-panels { display: grid; grid-template-columns: minmax(0, 1fr) 28rem; gap: 1.4rem; align-items: start; }
.ticket-chat { background: #fff; border-radius: 1.8rem; display: flex; flex-direction: column; min-height: calc(100vh - 22rem); max-height: calc(100vh - 22rem); }
.chat-header { padding: 1.8rem 2rem; border-bottom: 1px solid #f0f0f0; }
.ticket-info__top { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.6rem; }
.ticket-id { font-size: 1.3rem; font-weight: 600; color: #666; font-family: monospace; background: #f5f5f5; padding: 0.3rem 0.8rem; border-radius: 0.6rem; }
.ticket-status { padding: 0.3rem 1rem; border-radius: 2rem; font-size: 1.2rem; font-weight: 500; &.status--open { background: #fff3e0; color: #e65100; } &.status--waiting { background: #e3f2fd; color: #1565c0; } &.status--in_progress { background: #f3e5f5; color: #7b1fa2; } &.status--resolved { background: #e8f5e9; color: #2e7d32; } &.status--closed { background: #f5f5f5; color: #616161; } }
.ticket-info h2 { font-size: 1.7rem; font-weight: 600; color: #2d2d2d; margin-bottom: 0.4rem; }
.ticket-meta { display: flex; align-items: center; gap: 0.6rem; font-size: 1.3rem; color: #b0b0b0; flex-wrap: wrap; }
.chat-messages { flex: 1; overflow-y: auto; padding: 1.6rem 2rem; display: flex; flex-direction: column; gap: 1.2rem; }
.message { display: flex; gap: 1rem; max-width: 80%; &--mine { align-self: flex-end; flex-direction: row-reverse; .message__content { background: $green; } .message__author { color: rgba(255,255,255,0.8); } .message__role { background: rgba(255,255,255,0.2); color: #fff; } .message__time { color: rgba(255,255,255,0.7); } .message__text { color: #fff; } .message__avatar { background: $green; color: #fff; } } }
.message__avatar { width: 3.6rem; height: 3.6rem; border-radius: 50%; background: #f0f0f0; color: #666; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.4rem; flex-shrink: 0; }
.message__content { background: #f8f9fa; padding: 1rem 1.4rem; border-radius: 1.4rem; min-width: 0; }
.message__header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; flex-wrap: wrap; }
.message__author { font-size: 1.3rem; font-weight: 600; color: #2d2d2d; }
.message__role { font-size: 1.1rem; padding: 0.15rem 0.6rem; border-radius: 0.4rem; font-weight: 500; background: #e3f2fd; color: #1565c0; &--user { background: #fff3e0; color: #e65100; } }
.message__time { font-size: 1.1rem; color: #b0b0b0; margin-left: auto; }
.message__text { font-size: 1.4rem; color: #2d2d2d; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
.message__attachments { margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.4rem; }
.attachment { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1rem; background: #fff; border-radius: 0.6rem; text-decoration: none; font-size: 1.2rem; &:hover { background: #f0f0f0; } }
.attachment__icon { font-size: 1.4rem; } .attachment__name { color: #2d2d2d; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .attachment__size { color: #b0b0b0; font-size: 1.1rem; }
.typing-indicator { display: flex; align-items: center; gap: 0.8rem; padding: 0.4rem 0; } .typing-dots { display: flex; gap: 0.3rem; span { width: 0.6rem; height: 0.6rem; border-radius: 50%; background: #b0b0b0; animation: typing 1.4s infinite; &:nth-child(2) { animation-delay: 0.2s; } &:nth-child(3) { animation-delay: 0.4s; } } }
@keyframes typing { 0%,60%,100% { opacity: 0.3; } 30% { opacity: 1; } } .typing-text { font-size: 1.2rem; color: #b0b0b0; font-style: italic; }
.chat-input { padding: 1.4rem 2rem; border-top: 1px solid #f0f0f0; display: flex; gap: 1rem; align-items: flex-end; } .chat-textarea { flex: 1; padding: 0.8rem 1.2rem; border: 2px solid #e0e0e0; border-radius: 1rem; font-size: 1.4rem; color: #2d2d2d; font-family: inherit; resize: none; min-height: 4rem; &:focus { outline: none; border-color: $green; } }
.btn-send { width: 4rem; height: 4rem; border: none; background: $green; color: #fff; border-radius: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; &:hover:not(:disabled) { background: darken($green, 5%); } &:disabled { opacity: 0.4; cursor: not-allowed; } }
.chat-closed { padding: 1.6rem 2rem; text-align: center; border-top: 1px solid #f0f0f0; p { color: #9a9a9a; font-size: 1.4rem; } }
.ticket-sidebar { display: flex; flex-direction: column; gap: 1.4rem; } .sidebar-block { background: #fff; border-radius: 1.4rem; padding: 1.6rem; } .sidebar-block h3 { font-size: 1.3rem; font-weight: 600; color: #8f8f8f; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.2rem; }
.user-card { display: flex; align-items: center; gap: 1rem; } .user-card__avatar { width: 4.4rem; height: 4.4rem; border-radius: 50%; background: #e8f5e9; color: #2e7d32; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.8rem; flex-shrink: 0; }
.user-card__info { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; strong { font-size: 1.5rem; color: #2d2d2d; } span { font-size: 1.3rem; color: #9a9a9a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }
.info-list { display: flex; flex-direction: column; gap: 0.8rem; } .info-row { display: flex; justify-content: space-between; align-items: center; span { font-size: 1.4rem; color: #9a9a9a; } strong { font-size: 1.4rem; color: #4a4a4a; } }
.status-actions { display: flex; flex-direction: column; gap: 0.6rem; } .btn-status { width: 100%; padding: 0.8rem 1.2rem; border: none; border-radius: 0.8rem; font-size: 1.4rem; font-weight: 500; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } &.btn--primary { background: $green; color: #fff; } &.btn--success { background: #e8f5e9; color: #2e7d32; } &.btn--secondary { background: #e3f2fd; color: #1565c0; } &.btn--danger { background: #ffebee; color: #c62828; } &:hover:not(:disabled) { filter: brightness(0.95); } }
@media (max-width: 1024px) { .ticket-panels { grid-template-columns: 1fr; } .ticket-sidebar { order: -1; } .message { max-width: 90%; } }
</style>