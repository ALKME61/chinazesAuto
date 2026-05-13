import { describe, it, expect } from 'vitest'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price)
    .replace(/\u202F/g, ' ')
    .replace(/\u00A0/g, ' ')
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length !== 11) return phone
  return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`
}

function isValidVin(vin: string): boolean {
  const upper = vin.toUpperCase()
  if (upper.length !== 17) return false
  if (/[IOQ]/.test(upper)) return false
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(upper)
}

function getDiscountPercent(turnover: number): number {
  if (turnover >= 200000) return 7
  if (turnover >= 100000) return 5
  if (turnover >= 50000) return 3
  return 0
}

describe('formatPrice', () => {
  it('форматирует целое число в рубли', () => {
    expect(formatPrice(1500)).toBe('1 500 ₽')
  })

  it('форматирует крупную сумму с разделителями', () => {
    expect(formatPrice(125000)).toBe('125 000 ₽')
  })

  it('корректно отображает ноль', () => {
    expect(formatPrice(0)).toBe('0 ₽')
  })
})

describe('formatPhone', () => {
  it('форматирует 11-значный номер', () => {
    expect(formatPhone('79001234567')).toBe('+7 (900) 123-45-67')
  })

  it('возвращает исходную строку при некорректной длине', () => {
    expect(formatPhone('12345')).toBe('12345')
  })

  it('очищает номер от лишних символов', () => {
    expect(formatPhone('+7 (900) 123-45-67')).toBe('+7 (900) 123-45-67')
  })
})

describe('isValidVin', () => {
 

  it('отклоняет VIN длиной менее 17 символов', () => {
    expect(isValidVin('XW8ZZZ61Z')).toBe(false)
  })

  it('отклоняет VIN с запрещёнными символами I, O, Q', () => {
    expect(isValidVin('XW8ZZZ61ZEG0370I')).toBe(false)
  })

  it('отклоняет пустую строку', () => {
    expect(isValidVin('')).toBe(false)
  })
})

describe('getDiscountPercent', () => {
  it('возвращает 0% при обороте менее 50 000', () => {
    expect(getDiscountPercent(30000)).toBe(0)
  })

  it('возвращает 3% при обороте от 50 000', () => {
    expect(getDiscountPercent(75000)).toBe(3)
  })

  it('возвращает 5% при обороте от 100 000', () => {
    expect(getDiscountPercent(150000)).toBe(5)
  })

  it('возвращает 7% при обороте от 200 000', () => {
    expect(getDiscountPercent(250000)).toBe(7)
  })

  it('корректно отрабатывает на границе 50 000', () => {
    expect(getDiscountPercent(50000)).toBe(3)
  })
})