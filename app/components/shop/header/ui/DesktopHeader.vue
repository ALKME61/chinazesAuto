<script setup lang="ts">
import Search from '~/components/shop/search/ui/Search.vue'
import Icon from '~/shared/ui-kit/Icon/Icon.vue'
import {
  helpPhone,
  helpPhoneHref,
  quickActionLinks,
  supportLinks,
} from '~/shared/lib/navigation'
import { useAuthStore } from '~~/stores/auth'

const authStore = useAuthStore()

const emit = defineEmits<{
  (e: 'toggleCatalog'): void
}>()

// Добавляем состояние для отслеживания монтирования
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <header class="shop-header shop-header--desktop">
    <div class="shop-header__shell">
      <div class="shop-header__top">
        <div class="shop-header__identity">
          <NuxtLink to="/" class="shop-header__logo" aria-label="На главную">
            <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип ЧиназесАвто" />
          </NuxtLink>

          <button type="button" class="shop-header__catalog" @click="emit('toggleCatalog')">
            <Icon name="burger" width="20" height="20" />
            <span>Каталог</span>
          </button>
        </div>

        <div class="shop-header__search-wrap">
          <Search placeholder="Поиск по VIN, или артикулу" />
        </div>
        <nav class="shop-header__actions" aria-label="Быстрые действия магазина">
          <NuxtLink v-for="action in quickActionLinks" :key="action.to" :to="action.to" class="shop-header__action">
            <Icon :name="action.icon" width="23" height="23" :alt="action.label" />
            <span>{{ action.label }}</span>
          </NuxtLink>
          
          <!-- Показываем заглушку во время загрузки -->
          <div v-if="!isMounted" class="shop-header__action shop-header__action--skeleton">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text"></div>
          </div>
          
          <template v-else>
            <template v-if="!authStore.isAuthenticated">
              <NuxtLink to="/auth/login" class="shop-header__action">
                <Icon name="Login" width="23" height="23" alt="Войти" />
                <span>Войти</span>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/profile" class="shop-header__action">
                <Icon name="profileIcon" width="23" height="23" alt="Профиль" />
                <span>Профиль</span>
              </NuxtLink>
            </template>
          </template>
        </nav>
      </div>

      <div class="shop-header__info">
        <div class="shop-header__links">
          <a v-for="link in supportLinks" :key="link.label" :href="link.href">
            {{ link.label }}
          </a>
        </div>

        <div class="shop-header__contact-row">
          <a :href="helpPhoneHref" class="shop-header__phone">{{ helpPhone }}</a>

          <button type="button" class="shop-header__address">
            <Icon name="geo-pvz" width="19" height="19" />
            <span>Адреса ПВЗ</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
// Добавляем стили для скелетона
.shop-header__action--skeleton {
  opacity: 0.6;
  pointer-events: none;
  
  .skeleton-icon {
    width: 23px;
    height: 23px;
    background: #e0e0e0;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  .skeleton-text {
    width: 40px;
    height: 13px;
    background: #e0e0e0;
    border-radius: 4px;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.shop-header--desktop {
  position: static;
  z-index: 30;
  padding: 0;
}

.shop-header__shell {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 1.8rem 2.4rem;
  background: #ffffff;
  border-radius: 0 0 2.4rem 2.4rem;
}

.shop-header__top {
  display: grid;
  grid-template-columns: auto minmax(34rem, 1fr) auto;
  gap: 1.8rem;
  align-items: center;
}

.shop-header__identity {
  display: flex;
  align-items: center;
  gap: 1.6rem;
}

.shop-header__logo {
  display: inline-flex;
  align-items: center;

  img {
    width: clamp(19rem, 17vw, 26rem);
  }
}

.shop-header__catalog {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  min-height: 4.8rem;
  padding: 0 1.8rem;
  border: 0;
  border-radius: 1.4rem;
  background: $linear-green;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
}

.shop-header__search-wrap {
  width: 100%;
}

.shop-header__actions {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 1.2vw, 2.4rem);
}

.shop-header__action {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  color: #5d5d5d;
  font-size: 1.3rem;
}

.shop-header__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.shop-header__links,
.shop-header__contact-row {
  display: flex;
  align-items: center;
  gap: 3.2rem;
}

.shop-header__links a,
.shop-header__phone {
  color: #656565;
  font-size: 1.35rem;
}

.shop-header__address {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  border: 0;
  background: transparent;
  color: $orange;
  cursor: pointer;
  font-size: 1.45rem;
}

@media (max-width: 1199px) {
  .shop-header__top {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .shop-header__actions {
    gap: 1.4rem;
  }
}

@media (max-width: 991px) {
  .shop-header--desktop {
    display: none;
  }
}
</style>
