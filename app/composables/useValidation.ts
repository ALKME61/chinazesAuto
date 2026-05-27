export function validatePassword(password: string): string | null {
  if (!password) return 'Введите пароль'
  if (password.length < 8) return 'Минимум 8 символов'
  if (!/[A-ZА-Я]/.test(password)) return 'Нужна хотя бы одна заглавная буква'
  if (!/[0-9]/.test(password)) return 'Нужна хотя бы одна цифра'
  if (!/[!@#$%^&*()_\-+=[\]{}|;:'",.<>/?\\`~]/.test(password)) return 'Нужен хотя бы один спецсимвол'
  return null
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Введите e-mail'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный e-mail'
  return null
}

export function validatePhone(phone: string): string | null {
  if (!phone) return 'Введите номер телефона'
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 11) return 'Номер должен содержать 11 цифр'
  if (!digits.startsWith('7')) return 'Номер должен начинаться на +7'
  return null
}

export function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 0 && digits[0] === '8') digits = '7' + digits.slice(1)
  if (digits.length === 0) return ''
  if (digits.length === 1 && digits[0] !== '7') digits = '7' + digits
  let formatted = '+7'
  if (digits.length > 1) formatted += ' (' + digits.slice(1, Math.min(digits.length, 4))
  if (digits.length >= 5) formatted += ') ' + digits.slice(4, Math.min(digits.length, 7))
  if (digits.length >= 8) formatted += '-' + digits.slice(7, Math.min(digits.length, 9))
  if (digits.length >= 10) formatted += '-' + digits.slice(9, 11)
  return formatted
}
