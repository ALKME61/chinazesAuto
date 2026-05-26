// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { $fetch } from 'ofetch'
import { useAPI } from '~/composables/useAPI'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any | null>(null)
    const isLoading = ref(true)
    const isAuthenticated = computed(() => !!user.value)

    async function fetchUser() {
        try {
            isLoading.value = true
            const { user: userData } = await $fetch('/api/auth/me')
            user.value = userData
        } catch (e) {
            user.value = null
        } finally {
            isLoading.value = false
        }
    }

    // ✅ ДОБАВЛЯЕМ МЕТОД ОБНОВЛЕНИЯ БАЛАНСА
    async function refreshBalance() {
        try {
            const { user: userData } = await $fetch('/api/auth/me')
            if (user.value && userData) {
                user.value.balance = userData.balance
                user.value.monthly_turnover = userData.monthly_turnover
            }
        } catch (e) {
            console.error('Ошибка обновления баланса:', e)
        }
    }

    async function login(credentials: { email: string; password: string }) {
        const api = useAPI()
        const { user: userData } = await api<{ user: any }>('/api/auth/login', {
            method: 'POST',
            body: credentials,
        })
        user.value = userData
    }

    async function logout() {
        const api = useAPI()
        await api('/api/auth/logout', { method: 'POST' })
        user.value = null
    }

    return { 
        user, 
        isLoading, 
        isAuthenticated, 
        fetchUser, 
        refreshBalance,  // ✅ НЕ ЗАБУДЬ ДОБАВИТЬ
        login, 
        logout 
    }
})