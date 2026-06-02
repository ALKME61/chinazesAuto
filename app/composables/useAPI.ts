// composables/useAPI.ts
import { useAuthStore } from '~~/stores/auth'

export const useAPI = () => {
  const apiFetch = $fetch.create({
    // При любой ошибке ответа
    async onResponseError({ response, request, options }) {
      if (response.status === 401 && !request.toString().includes('/api/auth/login')) {
        try {
          await $fetch('/api/auth/refresh', { method: 'POST' })

          return $fetch(request, options)
        } catch {
          const authStore = useAuthStore()
          authStore.logout()
          await navigateTo('/auth/login')
        }
      }
    }
  })

  return apiFetch
}