// composables/usePayment.ts
import { useAuthStore } from '../../stores/auth'

export function usePayment() {
  const authStore = useAuthStore()
  const isPolling = ref(false)
  const pollInterval = ref<NodeJS.Timeout | null>(null)

  async function startPolling(paymentId: string) {
    isPolling.value = true
    
    pollInterval.value = setInterval(async () => {
      try {
        const api = useAPI()
        const response = await api(`/api/payments/check/${paymentId}`)
        
        if (response.status === 'paid' || response.status === 'success') {
          stopPolling()
          await authStore.refreshBalance()
        }
      } catch (error) {
        console.error('Ошибка проверки платежа:', error)
      }
    }, 3000) // Проверяем каждые 3 секунды

    // Останавливаем через 5 минут
    setTimeout(() => stopPolling(), 5 * 60 * 1000)
  }

  function stopPolling() {
    if (pollInterval.value) {
      clearInterval(pollInterval.value)
      pollInterval.value = null
    }
    isPolling.value = false
  }

  // Очистка при размонтировании
  onUnmounted(() => {
    stopPolling()
  })

  return {
    isPolling,
    startPolling,
    stopPolling
  }
}