import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '~~/stores/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()

  // НЕ вызываем fetchUser на сервере, если он зависает
  if (import.meta.server) {
    // На сервере не ждём — плагин просто заканчивается
    // Middleware сам разберётся
    return
  }

  // На клиенте спокойно ждём
  console.log('🔌 Плагин auth: запускаю fetchUser на КЛИЕНТЕ')
  await authStore.fetchUser()
  console.log('🔌 Плагин auth: завершён, user =', authStore.user)
})