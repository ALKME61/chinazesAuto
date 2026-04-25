export type NavLink = {
  label: string
  to: string
}

export type ExternalLink = {
  label: string
  href: string
}

export type ActionLink = NavLink & {
  icon: string
}

export const categoryLinks: NavLink[] = [
  { label: 'Оригинальный каталог', to: '/catalogs/original' },
  { label: 'Запчасти для ТО', to: '/catalogs/TO' },
  { label: 'Аксессуары', to: '/catalogs' },
  { label: 'Шины и диски', to: '/catalogs' },
  { label: 'АКБ', to: '/catalog?categoryName=akb' },
  { label: 'Автохимия', to: '/catalogs' },
  { label: 'Масла и техжидкости', to: '/catalogs' },
  { label: 'Инструменты', to: '/catalogs' },
]

export const profileLinks: NavLink[] = [
  { label: 'Личный кабинет', to: '/profile' },
  { label: 'Заказы', to: '/profile/orders' },
  { label: 'Корзина', to: '/cart' },
  { label: 'Гараж', to: '/profile/garage' },
  { label: 'Баланс', to: '/profile/balance' },
]

export const quickActionLinks: ActionLink[] = [
  { label: 'Корзина', to: '/cart', icon: 'Cart' },
  { label: 'Заказы', to: '/profile/orders', icon: 'Orders' },
  { label: 'Гараж', to: '/profile/garage', icon: 'Garage' },
  { label: 'Войти', to: '/auth/login', icon: 'Login' },
]

export const searchLinks: NavLink[] = [
  { label: 'Запчасти для ТО', to: '/catalogs/TO' },
  { label: 'Поиск по VIN', to: '/catalogs/original' },
]

export const supportLinks: ExternalLink[] = [
  { label: 'Помощь специалиста', href: '#' },
  { label: 'Информация для клиентов', href: '#' },
]

export const legalLinks: NavLink[] = [
  { label: 'Политика конфиденциальности', to: '/' },
]

export const supportContactLinks: ExternalLink[] = [
  { label: '8 (123) 456-78-90 - Помощь с подбором', href: 'tel:+71234567890' },
  { label: '8 (123) 456-78-90 - Жалобы и предложения', href: 'tel:+71234567890' },
]

export const helpPhone = '8 (123) 456-78-90'
export const helpPhoneHref = 'tel:+71234567890'
