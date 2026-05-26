// middleware/auth.ts
import { useAuthStore } from "~~/stores/auth"

export default defineNuxtRouteMiddleware(async (to) => {
  // На сервере пропускаем (будем проверять отдельно или доверять клиенту)
  if (import.meta.server) {
    console.log('🔵 SSR: пропускаю middleware')
    return
  }

  const authStore = useAuthStore()
  
  if (authStore.isLoading) {
    await authStore.fetchUser()
  }

  const publicPages = ['/auth/login', '/auth/signin', '/']
  
  // Если страница публичная — пускаем
  if (publicPages.includes(to.path)) return

  // Если не авторизован — на логин
  if (!authStore.isAuthenticated) {
    console.log('🚨 Редирект на /auth/login')
    return navigateTo('/auth/login')
  }

  // Проверка прав доступа к защищенным разделам
  const user = authStore.user
  
  // Админ-панель
  if (to.path.startsWith('/admin') && !user?.permissions?.can_access_admin_panel) {
    console.log('🚫 Нет доступа к админ-панели')
    throw createError({ 
      statusCode: 404, 
      message: 'Страница не найдена',
      fatal: true 
    })
  }

  // PVZ-панель
  if (to.path.startsWith('/pvz') && !user?.permissions?.can_access_pvz_panel) {
    console.log('🚫 Нет доступа к PVZ-панели')
    throw createError({ 
      statusCode: 404, 
      message: 'Страница не найдена',
      fatal: true 
    })
  }

  // Driver app
  if (to.path.startsWith('/driver') && !user?.permissions?.can_access_driver_app) {
    console.log('🚫 Нет доступа к Driver app')
    throw createError({ 
      statusCode: 404, 
      message: 'Страница не найдена',
      fatal: true 
    })
  }
})