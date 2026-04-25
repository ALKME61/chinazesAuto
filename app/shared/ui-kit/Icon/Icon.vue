<script setup lang="ts">
const iconPaths = {
  onPriceIcon: '/icons/admin/onPriceIcon.svg',
  onStockIcon: '/icons/admin/onStockIcon.svg',
  onSuppliersPrice: '/icons/admin/onSuppliersPrice.svg',
  burger: '/icons/burger.svg',
  Cart: '/icons/Cart.svg',
  checkbox: '/icons/checkbox.svg',
  delete: '/icons/delete.svg',
  eyeIcon: '/icons/eyeIcon.svg',
  filterIcon: '/icons/filterIcon.svg',
  Garage: '/icons/Garage.svg',
  'geo-pvz': '/icons/geo-pvz.svg',
  imageIcon: '/icons/imageIcon.svg',
  Login: '/icons/Login.svg',
  ChinazesAutoLogo: '/icons/logo/ChinazesAutoLogo.svg',
  icon: '/icons/logo/icon.svg',
  minus: '/icons/minus.svg',
  money: '/icons/money.svg',
  Orders: '/icons/Orders.svg',
  phone: '/icons/phone.svg',
  playIcon: '/icons/playIcon.svg',
  plus: '/icons/plus.svg',
  balanceIcon: '/icons/profile/balanceIcon.svg',
  discountIcon: '/icons/profile/discountIcon.svg',
  garageIcon: '/icons/profile/garageIcon.svg',
  notificationIcon: '/icons/profile/notificationIcon.svg',
  orderIcon: '/icons/profile/orderIcon.svg',
  profileIcon: '/icons/profile/profileIcon.svg',
  pvzIcon: '/icons/pvzIcon.svg',
  search: '/icons/search.svg',
  telegramIcon: '/icons/socialMedia/telegramIcon.svg',
  timeDurationIcon: '/icons/timeDurationIcon.svg',
  vkIcon: '/icons/socialMedia/vkIcon.svg',
  'burger-mobile': '/icons/burger-mobile.svg'
} as const

type IconName = keyof typeof iconPaths

const props = withDefaults(
  defineProps<{
    name: IconName | string
    size?: number | string
    width?: number | string
    height?: number | string
    alt?: string
  }>(),
  {
    size: 20,
    alt: '',
  },
)

const resolvedWidth = computed(() => props.width ?? props.size)
const resolvedHeight = computed(() => props.height ?? props.size)

const iconSrc = computed(() => {
  if (!props.name) {
    return ''
  }

  if (Object.prototype.hasOwnProperty.call(iconPaths, props.name)) {
    return iconPaths[props.name as IconName]
  }

  if (props.name.startsWith('/')) {
    return props.name
  }

  const normalizedName = props.name.endsWith('.svg')
    ? props.name
    : `${props.name}.svg`

  return normalizedName.startsWith('icons/')
    ? `/${normalizedName}`
    : `/icons/${normalizedName}`
})
</script>

<template>
  <NuxtImg
    v-if="iconSrc"
    :src="iconSrc"
    :alt="props.alt"
    :width="resolvedWidth"
    :height="resolvedHeight"
    class="ui-icon"
  />
</template>

<style scoped>
.ui-icon {
  display: block;
  flex-shrink: 0;
  object-fit: contain;
}
</style>
