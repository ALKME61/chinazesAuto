<script setup lang="ts">
import Button from '~/components/shared/ui/Button/ui/Button.vue'
import UInput from '../../ui/input/ui/UInput.vue'
import { useRegisterStore } from '~~/stores/register'
import { validatePassword, validateEmail, validatePhone, formatPhone } from '~/composables/useValidation'

const registerStore = useRegisterStore()
const signupStep = ref<'form' | 'code'>('form')
const formError = ref('')
const policyAccepted = ref(false)

const fieldErrors = reactive({ phone: '', email: '', password: '', passwordConfirm: '' })

function clearErrors() { formError.value = ''; fieldErrors.phone = ''; fieldErrors.email = ''; fieldErrors.password = ''; fieldErrors.passwordConfirm = '' }

const passwordRules = [
  { label: 'Минимум 8 символов', test: (p: string) => p.length >= 8 },
  { label: 'Хотя бы одна заглавная буква', test: (p: string) => /[A-ZА-Я]/.test(p) },
  { label: 'Хотя бы одна цифра', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Хотя бы один спецсимвол', test: (p: string) => /[!@#$%^&*()_\-+=[\]{}|;:'",.<>/?\\`~]/.test(p) },
]

const phoneDisplay = computed({ get: () => registerStore.form.phone, set: (val: string) => { registerStore.form.phone = formatPhone(val) } })

function validateForm(): boolean {
  clearErrors(); let valid = true; const f = registerStore.form
  if (!f.first_name.trim()) { formError.value = 'Введите имя'; return false }
  if (!f.last_name.trim()) { formError.value = 'Введите фамилию'; return false }
  const phoneErr = validatePhone(f.phone); if (phoneErr) { fieldErrors.phone = phoneErr; valid = false }
  const emailErr = validateEmail(f.email); if (emailErr) { fieldErrors.email = emailErr; valid = false }
  const passErr = validatePassword(f.password); if (passErr) { fieldErrors.password = passErr; valid = false }
  if (f.password !== f.password_confirm) { fieldErrors.passwordConfirm = 'Пароли не совпадают'; valid = false }
  if (!policyAccepted.value) { formError.value = 'Необходимо согласие на обработку персональных данных'; valid = false }
  return valid
}

async function handleRequestCode() { if (!validateForm()) return; try { await registerStore.sendEmailCode(); signupStep.value = 'code' } catch { formError.value = registerStore.error || 'Не удалось отправить код' } }
async function handleRegister() { formError.value = ''; try { await registerStore.register() } catch { formError.value = registerStore.error || 'Неверный код или ошибка регистрации' } }
function handleBack() { signupStep.value = 'form'; registerStore.emailCode = ''; formError.value = ''; registerStore.error = null }
onUnmounted(() => { registerStore.reset() })
</script>

<template>
  <main class="auth-page"><section class="auth-panel">
    <NuxtLink to="/" class="auth-panel__logo"><NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип ЧиназесАвто" /></NuxtLink>
    <div class="auth-panel__content">
      <template v-if="signupStep === 'form'">
        <h1>Добро пожаловать!</h1>
        <p class="auth-panel__footer">Уже есть аккаунт? <NuxtLink to="/auth/login">Войти</NuxtLink></p>
        <form class="auth-panel__form" @submit.prevent="handleRequestCode">
          <UInput v-model="registerStore.form.first_name" type="text" placeholder="Имя" />
          <UInput v-model="registerStore.form.last_name" type="text" placeholder="Фамилия" />
          <div class="auth-field"><UInput v-model="phoneDisplay" type="text" placeholder="Номер телефона" /><p v-if="fieldErrors.phone" class="auth-field__error">{{ fieldErrors.phone }}</p></div>
          <div class="auth-field"><UInput v-model="registerStore.form.email" type="text" placeholder="E-mail" /><p v-if="fieldErrors.email" class="auth-field__error">{{ fieldErrors.email }}</p></div>
          <div class="auth-field"><UInput v-model="registerStore.form.password" type="password" placeholder="Пароль" /><p v-if="fieldErrors.password && registerStore.form.password.length > 0" class="auth-field__error">{{ fieldErrors.password }}</p></div>
          <div class="auth-field"><UInput v-model="registerStore.form.password_confirm" type="password" placeholder="Повторите пароль" /><p v-if="fieldErrors.passwordConfirm" class="auth-field__error">{{ fieldErrors.passwordConfirm }}</p></div>
          <ul v-if="registerStore.form.password.length > 0" class="auth-password-rules"><li v-for="rule in passwordRules" :key="rule.label" :class="{ 'auth-password-rules__item--ok': rule.test(registerStore.form.password) }">{{ rule.label }}</li></ul>
          <label class="auth-checkbox"><input v-model="policyAccepted" type="checkbox" /><span class="auth-checkbox__box" /><span class="auth-checkbox__text">Я согласен на <NuxtLink to="/policy" target="_blank">обработку персональных данных</NuxtLink></span></label>
          <p v-if="formError" class="auth-panel__error">{{ formError }}</p>
          <button type="submit" class="auth-panel__submit" :disabled="registerStore.isSendingCode" :class="{ 'auth-panel__submit--loading': registerStore.isSendingCode }"><span v-if="registerStore.isSendingCode" class="spinner" /><template v-else>Продолжить</template></button>
        </form>
      </template>
      <template v-else>
        <button type="button" class="auth-panel__back" @click="handleBack"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg><span>Назад</span></button>
        <div class="auth-panel__code-step">
          <h1>Код подтверждения</h1><p class="auth-panel__code-hint">Отправлен на <strong>{{ registerStore.form.email }}</strong></p>
          <UInput v-model="registerStore.emailCode" type="text" placeholder="Введите код из письма" />
          <p v-if="formError" class="auth-panel__error">{{ formError }}</p>
          <button type="button" class="auth-panel__submit" :disabled="registerStore.emailCode.length < 4 || registerStore.isRegistering" :class="{ 'auth-panel__submit--loading': registerStore.isRegistering }" @click="handleRegister"><span v-if="registerStore.isRegistering" class="spinner" /><template v-else>Зарегистрироваться</template></button>
          <button type="button" class="auth-panel__resend" :disabled="registerStore.isSendingCode" @click="registerStore.sendEmailCode()">Отправить код повторно</button>
        </div>
      </template>
    </div>
  </section></main>
</template>

<style scoped lang="scss">
.auth-page { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 3rem 2rem; }
.auth-panel { width: min(50em, 100%); min-height: 60vh; padding: 3rem; background: #fff; border-radius: 3rem; }
.auth-panel__logo { display: inline-flex; margin-bottom: 3rem; width: 100%; img { width: 50%; } }
.auth-panel__content { display: flex; flex-direction: column; gap: 1.8rem; h1 { font-size: 3.2rem; font-weight: 600; color: #333333; } }
.auth-panel__form { display: flex; flex-direction: column; gap: 1.5rem; }
.auth-field { display: flex; flex-direction: column; gap: 0.4rem; }
.auth-field__error { margin: 0; font-size: 1.2rem; color: #c62828; padding-left: 0.4rem; }
.auth-password-rules { list-style: none; margin: 0; padding: 0.4rem 0 0 0.4rem; display: flex; flex-direction: column; gap: 0.2rem;
  li { font-size: 1.2rem; color: #b0b0b0; &::before { content: '• '; } }
}
.auth-password-rules__item--ok { color: $green; &::before { content: '✓ '; } }
.auth-checkbox { display: flex; align-items: flex-start; gap: 0.8rem; cursor: pointer; input { display: none; } }
.auth-checkbox__box { width: 2rem; height: 2rem; border: 1px solid #c8c8c8; border-radius: 0.4rem; background: #fff; flex-shrink: 0; margin-top: 0.1rem; display: flex; align-items: center; justify-content: center;
  .auth-checkbox input:checked + & { background: $green; border-color: $green; &::after { content: '✓'; color: #fff; font-size: 1.2rem; font-weight: 700; line-height: 1; } }
}
.auth-checkbox__text { color: #7a7a7a; font-size: 1.35rem; line-height: 1.4; a { color: $orange; text-decoration: underline; } }
.auth-panel__error { margin: 0; padding: 1rem 1.4rem; background: #fff0f0; color: #c62828; font-size: 1.4rem; border-radius: 1rem; line-height: 1.4; }
.auth-panel__submit { display: flex; align-items: center; justify-content: center; height: 5.4rem; border: 0; border-radius: 1.2rem; background: $linear-green; color: #fff; font-size: 1.8rem; font-weight: 600; cursor: pointer; &:disabled { opacity: 0.7; cursor: not-allowed; } }
.auth-panel__submit--loading { opacity: 0.8; }
.auth-panel__footer { color: #7a7a7a; font-size: 1.7rem; font-weight: 300; a { color: $orange; } }
.auth-panel__back { display: inline-flex; align-items: center; gap: 0.6rem; border: 0; background: transparent; color: #666; font-size: 1.4rem; cursor: pointer; padding: 0; width: fit-content; &:hover { color: $green; } }
.auth-panel__code-step { display: flex; flex-direction: column; gap: 1.5rem; }
.auth-panel__code-hint { margin: 0; color: #7a7a7a; font-size: 1.6rem; line-height: 1.4; strong { color: #333; font-weight: 600; } }
.auth-panel__resend { border: 0; background: transparent; color: $green; font-size: 1.5rem; cursor: pointer; padding: 0.6rem 0; width: fit-content; &:hover { text-decoration: underline; } &:disabled { opacity: 0.4; cursor: not-allowed; } }
.spinner { width: 2rem; height: 2rem; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 767px) { .auth-page { padding: 1.8rem; } .auth-panel { width: min(54rem, 100%); padding: 2rem 1.8rem 2.2rem; border-radius: 2.4rem; } .auth-panel__logo { margin-bottom: 2rem; img { width: 18rem; } } .auth-panel__content { gap: 1.4rem; h1 { font-size: 1.8rem; } } .auth-panel__form { gap: 1.2rem; } .auth-panel__submit { font-size: 1.6rem; } .auth-panel__footer { font-size: 1.35rem; } }
</style>
