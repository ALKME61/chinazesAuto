<script setup lang="ts">
import Search from '~/components/shop/search/ui/Search.vue'
import Icon from '~/shared/ui-kit/Icon/Icon.vue'
import { helpPhone, helpPhoneHref } from '~/shared/lib/navigation'
import { useAuthStore } from '~~/stores/auth'
import { useCartStore } from '~~/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const isMounted = ref(false)

const emit = defineEmits<{
  (e: 'toggleCatalog'): void
}>()

const searchQuery = ref('')
const showAuthPopup = ref(false)

function handleSearch(value: string) {
  if (!value.trim()) return
  if (!authStore.isAuthenticated) { showAuthPopup.value = true; return }
  navigateTo(`/articles/search?article=${encodeURIComponent(value.trim())}`)
}

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <header class="mobile-store-header">
    <div class="mobile-store-header__shell">
      <div class="mobile-store-header__top">
        <button
          type="button"
          class="mobile-store-header__burger"
          aria-label="Открыть каталог"
          @click="emit('toggleCatalog')"
        >
          <Icon name="burger-mobile" width="32" height="32" />
        </button>

        <NuxtLink to="/" class="mobile-store-header__logo" aria-label="На главную">
          <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип ЧиназесАвто" />
        </NuxtLink>

        <!-- Заглушка во время загрузки -->
        <div v-if="!isMounted" class="mobile-store-header__profile skeleton">
          <div class="skeleton-icon"></div>
        </div>

        <!-- Реальный контент после монтирования -->
        <NuxtLink 
          v-else-if="!authStore.isAuthenticated" 
          to="/auth/login" 
          class="mobile-store-header__profile" 
          aria-label="Войти"
        >
          <Icon name="Login" width="30" height="30" />
        </NuxtLink>

        <NuxtLink 
          v-else 
          to="/profile" 
          class="mobile-store-header__profile" 
          aria-label="Профиль"
        >
          <Icon name="profileIcon" width="30" height="30" />
        </NuxtLink>
      </div>

      <div class="mobile-store-header__quick">
        <NuxtLink to="/cart" class="mobile-store-header__cart-link" aria-label="Корзина">
          <Icon name="Cart" width="24" height="24" />
          <span v-if="cartStore.totalCount" class="mobile-store-header__cart-badge">{{ cartStore.totalCount }}</span>
        </NuxtLink>
      </div>

      <div class="mobile-store-header__search">
        <Search v-model="searchQuery" placeholder="Поиск по VIN, или артикулу" @submit="handleSearch" />
      </div>

      <div class="mobile-store-header__info">
        <a :href="helpPhoneHref" class="mobile-store-header__phone">{{ helpPhone }}</a>

        <button type="button" class="mobile-store-header__address">
          <Icon name="geo-pvz" width="19" height="24" />
          <span>Адреса ПВЗ</span>
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div v-if="showAuthPopup" class="shop-auth-popup" @click.self="showAuthPopup = false">
      <div class="shop-auth-popup__content">
        <h3>Авторизуйтесь, чтобы пользоваться поиском</h3>
        <p>Для поиска по VIN и артикулам необходимо войти в аккаунт</p>
        <div class="shop-auth-popup__actions">
          <NuxtLink class="shop-auth-popup__btn shop-auth-popup__btn--primary" to="/auth/login" @click="showAuthPopup = false">Войти</NuxtLink>
          <NuxtLink class="shop-auth-popup__btn shop-auth-popup__btn--ghost" to="/auth/signin" @click="showAuthPopup = false">Зарегистрироваться</NuxtLink>
        </div>
        <button type="button" class="shop-auth-popup__close" @click="showAuthPopup = false">Продолжить без авторизации</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.mobile-store-header {
  display: none;
  background-color: white;
  padding-top: env(safe-area-inset-top);
}

.mobile-store-header__shell {
  margin: 0 auto;
  padding: 1.2rem 1.6rem 1.1rem;
  background: #ffffff;
  border-radius: 0 0 1.8rem 1.8rem;
}

.mobile-store-header__top {
  display: grid;
  grid-template-columns: 3.2rem minmax(0, 1fr) 3.2rem;
  align-items: center;
  gap: 1.4rem;
}

.mobile-store-header__burger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.mobile-store-header__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-width: 31rem;
  }
}

.mobile-store-header__profile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  text-decoration: none;
  color: inherit;
  
  &.skeleton {
    .skeleton-icon {
      width: 30px;
      height: 30px;
      background: #e0e0e0;
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

.mobile-store-header__quick {
  display: flex;
  justify-content: flex-end;
  margin-top: -0.6rem;
}

.mobile-store-header__cart-link {
  position: relative;
  display: inline-flex;
  color: #5d5d5d;
}

.mobile-store-header__cart-badge {
  position: absolute;
  top: -0.3rem;
  right: -0.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6rem;
  height: 1.6rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: $orange;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.mobile-store-header__search {
  margin-top: 1.2rem;
}

.mobile-store-header__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4rem;
  margin-top: 1.8rem;
}

.mobile-store-header__phone {
  color: #727272;
  font-size: 1.7rem;
  line-height: 1.2;
  text-decoration: none;
}

.mobile-store-header__address {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: $orange;
  font-size: 1.6rem;
  line-height: 1.2;
  cursor: pointer;
}

@media (max-width: 991px) {
  .mobile-store-header {
    display: block;
  }
}

@media (max-width: 479px) {
  .mobile-store-header__shell {
    padding-left: 1.4rem;
    padding-right: 1.4rem;
  }

  .mobile-store-header__top {
    grid-template-columns: 2.8rem minmax(0, 1fr) 2.8rem;
    gap: 1.2rem;
  }

  .mobile-store-header__logo img {
    max-width: 26rem;
  }

  .mobile-store-header__info {
    margin-top: 1.7rem;
  }

  .mobile-store-header__phone {
    font-size: 1.45rem;
  }
}

.shop-auth-popup {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  padding: 2rem;
}

.shop-auth-popup__content {
  width: min(40rem, 100%);
  padding: 2.8rem 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  h3 { font-size: 2rem; font-weight: 700; color: #222; }
  p { font-size: 1.4rem; color: #777; line-height: 1.5; }
}

.shop-auth-popup__actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 0.6rem;
}

.shop-auth-popup__btn {
  display: block;
  min-height: 4.8rem;
  line-height: 4.8rem;
  border-radius: 1.2rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  &--primary { background: $linear-green; color: #fff; }
  &--ghost { background: #f0f7f1; color: $green; }
}

.shop-auth-popup__close {
  border: 0; background: none; font-size: 1.3rem; color: #999; cursor: pointer; padding: 0.6rem;
  &:hover { color: #666; }
}

  .mobile-store-header__address {
    gap: 0.55rem;
    font-size: 1.4rem;
  }

</style>