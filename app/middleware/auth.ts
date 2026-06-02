import { useAuthStore } from "~~/stores/auth"

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    console.log('🔵 SSR: пропускаю middleware')
    return
  }

  const authStore = useAuthStore()
  
  if (authStore.isLoading) {
    await authStore.fetchUser()
  }

  const publicPages = ['/auth/login', '/auth/signin', '/']
  
  if (publicPages.includes(to.path)) return

  if (!authStore.isAuthenticated) {
    console.log('🚨 Редирект на /auth/login')
    return navigateTo('/auth/login')
  }

  const user = authStore.user
  
  if (to.path.startsWith('/admin') && !user?.permissions?.can_access_admin_panel) {
    console.log('🚫 Нет доступа к админ-панели')
    throw createError({ 
      statusCode: 404, 
      message: 'Страница не найдена',
      fatal: true 
    })
  }

  if (to.path.startsWith('/pvz') && !user?.permissions?.can_access_pvz_panel) {
    console.log('🚫 Нет доступа к PVZ-панели')
    throw createError({ 
      statusCode: 404, 
      message: 'Страница не найдена',
      fatal: true 
    })
  }

  if (to.path.startsWith('/driver') && !user?.permissions?.can_access_driver_app) {
    console.log('🚫 Нет доступа к Driver app')
    throw createError({ 
      statusCode: 404, 
      message: 'Страница не найдена',
      fatal: true 
    })
  }
})