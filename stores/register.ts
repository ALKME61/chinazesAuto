import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export interface RegisterForm {
  first_name: string
  last_name: string
  phone: string
  email: string
  password: string
  password_confirm: string
}

export const useRegisterStore = defineStore('register', () => {
  const form = ref<RegisterForm>({ first_name: '', last_name: '', phone: '', email: '', password: '', password_confirm: '' })
  const codeSent = ref(false)
  const isSendingCode = ref(false)
  const isRegistering = ref(false)
  const emailCode = ref('')
  const error = ref<string | null>(null)

  function setForm(data: Partial<RegisterForm>) { form.value = { ...form.value, ...data }; error.value = null }

  async function sendEmailCode() {
    if (!form.value.email || isSendingCode.value) return
    isSendingCode.value = true; error.value = null
    try { await $fetch('/api/auth/send-email-code', { method: 'POST', body: { email: form.value.email } }); codeSent.value = true }
    catch (e: any) { error.value = e?.data?.message || e?.message || 'Не удалось отправить код'; throw e }
    finally { isSendingCode.value = false }
  }

  async function register() {
    if (!emailCode.value || isRegistering.value) return
    isRegistering.value = true; error.value = null
    try {
      const { user } = await $fetch<{ user: any }>('/api/auth/register', { method: 'POST', body: { ...form.value, email_code: emailCode.value } })
      const authStore = useAuthStore(); authStore.user = user
      await navigateTo('/'); return user
    }
    catch (e: any) { error.value = e?.data?.message || e?.message || 'Ошибка регистрации'; throw e }
    finally { isRegistering.value = false }
  }

  function reset() { form.value = { first_name: '', last_name: '', phone: '', email: '', password: '', password_confirm: '' }; codeSent.value = false; emailCode.value = ''; error.value = null }

  return { form, codeSent, isSendingCode, isRegistering, emailCode, error, setForm, sendEmailCode, register, reset }
})
