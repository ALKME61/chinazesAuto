export interface ProfileLink {
    id: string,
    name: string,
    icon: string,
    to: string
}

export const profileLinks: ProfileLink[] = [
    {
        id: 'Профиль',
        name: 'Профиль',
        icon: '/icons/profile/profileIcon.svg',
        to: '/profile'
    },
    {
        id: 'Гараж',
        name: 'Гараж',
        icon: '/icons/profile/garageIcon.svg',
        to: '/profile/garage'
    },
    {
        id: 'Заказы',
        name: 'Заказы',
        icon: '/icons/profile/orderIcon.svg',
        to: '/profile/orders'
    }, 
    {
        id: 'Баланс',
        name: 'Баланс',
        icon: '/icons/profile/balanceIcon.svg',
        to: '/profile/balance'
    },
    {
        id: 'Скидки',
        name: 'Скидки',
        icon: '/icons/profile/discountIcon.svg',
        to: '/profile/discount'
    },
    {
        id: 'Уведомления',
        name: 'Уведомления',
        icon: '/icons/profile/notificationIcon.svg',
        to: '/profile/notifications'
    }
] 