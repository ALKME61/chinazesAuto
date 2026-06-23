import { useAuthStore } from "~~/stores/auth"

function hasAccess(role: string | undefined, path: string): boolean {
  if (!role) return false
  if (role === 'super_admin') return true
  if (path.startsWith('/admin')) return role === 'admin' || role === 'super_admin'
  if (path.startsWith('/pvz')) return role === 'pvz_worker' || role === 'super_admin'
  if (path.startsWith('/driver')) return role === 'driver' || role === 'super_admin'
  return true
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  // Публичные страницы — пропускаем без проверки auth
  const publicPages = ['/auth/login', '/auth/signin', '/', '/policy']
  if (publicPages.includes(to.path)) return

  // Для всего остального — проверяем авторизацию
  const authStore = useAuthStore()

  if (authStore.isLoading) {
    await authStore.fetchUser()
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  // Ролевые панели
  const user = authStore.user
  const role: string | undefined = user?.role || user?.permissions?.role

  const isAdminPath = to.path.startsWith('/admin')
  const isPvzPath = to.path.startsWith('/pvz')
  const isDriverPath = to.path.startsWith('/driver')

  if ((isAdminPath || isPvzPath || isDriverPath) && !hasAccess(role, to.path)) {
    throw createError({ statusCode: 404, message: 'Страница не найдена', fatal: true })
  }
})
