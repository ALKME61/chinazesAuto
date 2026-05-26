
﻿export interface ProfileLink {
  id: string
  name: string
  icon: string
  to: string
}

export const profileLinks: ProfileLink[] = [
  {
    id: 'profile',
    name: 'Профиль',
    icon: '/icons/profile/profileIcon.svg',
    to: '/profile',
  },
  {
    id: 'garage',
    name: 'Гараж',
    icon: '/icons/profile/garageIcon.svg',
    to: '/profile/garage',
  },
  {
    id: 'orders',
    name: 'Заказы',
    icon: '/icons/profile/orderIcon.svg',
    to: '/profile/orders',
  },
  {
    id: 'balance',
    name: 'Баланс',
    icon: '/icons/profile/balanceIcon.svg',
    to: '/profile/balance',
  },
  {
    id: 'discount',
    name: 'Скидки',
    icon: '/icons/profile/discountIcon.svg',
    to: '/profile/discount',
  },
  {
    id: 'notifications',
    name: 'Уведомления',
    icon: '/icons/profile/notificationIcon.svg',
    to: '/profile/notifications',
  },
  {
    id: 'support',
    name: 'Поддержка',
    icon: '/icons/help.svg',
    to: '/profile/support',
  },
]