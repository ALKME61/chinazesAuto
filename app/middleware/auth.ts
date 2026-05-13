import { useAuthStore } from "~~/stores/auth"

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    console.log('🔵 SSR: пропускаю middleware')
    return
  }

  const authStore = useAuthStore()
  console.log('🟢 Клиент: isLoading =', authStore.isLoading, 'isAuthenticated =', authStore.isAuthenticated)

  if (authStore.isLoading) {
    console.log('⏳ Жду fetchUser...')
    await authStore.fetchUser()
    console.log('✅ fetchUser завершён, isAuthenticated =', authStore.isAuthenticated)
  }

  const publicPages = ['/auth/login', '/auth/signin', '/']
  if (publicPages.includes(to.path)) return

  if (!authStore.isAuthenticated) {
    console.log('🚨 Редирект на /auth/login')
    return navigateTo('/auth/login')
  }
})