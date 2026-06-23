import { useAuthStore } from "~~/stores/auth"

export default async function handleLogin(email: string, password: string) {
    const authStore = useAuthStore()
    try {
        await authStore.login({ email, password })

        const user = authStore.user
        if (user?.role === 'pvz_worker') {
            await navigateTo('/pvz/issue')
        } else if (user?.role === 'driver') {
            await navigateTo('/driver')
        } else {
            await navigateTo('/')
        }
    } catch (e) {
        throw e
    }
}
