import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { $fetch } from 'ofetch'
import { useAPI } from '~/composables/useAPI'

export const useAuthStore = defineStore('auth', () => {

    const user = ref<any | null>(null)
    const isLoading = ref(true)

    const isAuthenticated = computed(() => !!user.value)

    // stores/auth.ts
    async function fetchUser() {
        try {
            isLoading.value = true
            console.log('🔄 fetchUser: начинаю')

            const { user: userData } = await $fetch('/api/auth/me')

            user.value = userData
            console.log('✅ fetchUser: юзер получен', userData)
        } catch (e) {
            console.log('❌ fetchUser: ошибка', e)
            user.value = null
        } finally {
            isLoading.value = false
        }
    }

    async function login(credentials: { email: string; password: string }) {
        console.log('letsg')
        const api = useAPI()
        const { user: userData, error } = await api<{ user: any }>('/api/auth/login', {
            method: 'POST',
            body: credentials,
        })
        user.value = userData
        console.log(userData, error)
    }

    async function logout() {
        const api = useAPI()
        await api('/api/auth/logout', { method: 'POST' })
        user.value = null
    }

    return { user, isLoading, isAuthenticated, fetchUser, login, logout }
})