import { useAuthStore } from "~~/stores/auth"

export default async function handleLogin(email: string, password: string) {
    const authStore = useAuthStore()
    try {
        await authStore.login({
            email,
            password
        })
        
        await navigateTo('/')
    } catch (e) { 
        console.log()
        console.error('Не получилось')
    }
}