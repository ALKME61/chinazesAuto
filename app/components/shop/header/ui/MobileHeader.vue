<script setup lang="ts">
import Search from '~/components/shop/search/ui/Search.vue'
import Icon from '~/shared/ui-kit/Icon/Icon.vue'
import { helpPhone, helpPhoneHref } from '~/shared/lib/navigation'

const emit = defineEmits<{
  (e: 'toggleCatalog'): void
}>()
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

        <NuxtLink to="/profile" class="mobile-store-header__profile" aria-label="Профиль">
          <Icon name="Login" width="30" height="30" />
        </NuxtLink>
      </div>

      <div class="mobile-store-header__search">
        <Search placeholder="Поиск по VIN, или артикулю"/>
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

  .mobile-store-header__address {
    gap: 0.55rem;
    font-size: 1.4rem;
  }
}
</style>
