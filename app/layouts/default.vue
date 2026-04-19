<script setup lang="ts">
import Search from '~/components/search.vue'
import MobileProfileNav from '~/components/shop/MobileProfileNav.vue'
import MobileStoreHeader from '~/components/shop/MobileStoreHeader.vue'

const route = useRoute()
const showCatalogMenu = ref(false)

const isProfileRoute = computed(() => route.path.startsWith('/profile'))

const categoryLinks = [
  { label: 'Оригинальный каталог', to: '/catalogs/original' },
  { label: 'Запчасти для ТО', to: '/catalogs/TO' },
  { label: 'Аксессуары', to: '/catalogs' },
  { label: 'Шины и диски', to: '/catalogs' },
  { label: 'АКБ', to: '/catalog?categoryName=akb' },
  { label: 'Автохимия', to: '/catalogs' },
  { label: 'Масла и техжидкости', to: '/catalogs' },
  { label: 'Инструменты', to: '/catalogs' },
]

const profileLinks = [
  { label: 'Личный кабинет', to: '/profile' },
  { label: 'Заказы', to: '/profile/orders' },
  { label: 'Корзина', to: '/cart' },
  { label: 'Гараж', to: '/profile/garage' },
  { label: 'Баланс', to: '/profile/balance' },
]

function toggleCatalogMenu() {
  showCatalogMenu.value = !showCatalogMenu.value
}

function closeCatalogMenu() {
  showCatalogMenu.value = false
}

watch(
  () => route.fullPath,
  () => {
    showCatalogMenu.value = false
  },
)

watch(showCatalogMenu, (value) => {
  if (import.meta.client) {
    document.body.style.overflow = value ? 'hidden' : ''
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="shop-layout" :class="{ 'shop-layout--profile': isProfileRoute }">
    <header class="shop-header shop-header--desktop">
      <div class="shop-header__shell">
        <div class="shop-header__top">
          <div class="shop-header__identity">
            <button type="button" class="shop-header__burger" aria-label="Открыть каталог" @click="toggleCatalogMenu">
              <span />
              <span />
              <span />
            </button>

            <NuxtLink to="/" class="shop-header__logo" aria-label="На главную">
              <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип ЧиназесАвто" />
            </NuxtLink>

            <button type="button" class="shop-header__catalog" @click="toggleCatalogMenu">
              <NuxtImg src="/icons/burger.svg" alt="" />
              <span>Каталог</span>
            </button>
          </div>

          <div class="shop-header__search-wrap">
            <Search />
          </div>

          <nav class="shop-header__actions" aria-label="Быстрые действия магазина">
            <NuxtLink to="/cart" class="shop-header__action">
              <NuxtImg src="/icons/Cart.svg" alt="Корзина" />
              <span>Корзина</span>
            </NuxtLink>
            <NuxtLink to="/profile/orders" class="shop-header__action">
              <NuxtImg src="/icons/Orders.svg" alt="Заказы" />
              <span>Заказы</span>
            </NuxtLink>
            <NuxtLink to="/profile/garage" class="shop-header__action">
              <NuxtImg src="/icons/Garage.svg" alt="Гараж" />
              <span>Гараж</span>
            </NuxtLink>
            <NuxtLink to="/auth/login" class="shop-header__action">
              <NuxtImg src="/icons/Login.svg" alt="Профиль" />
              <span>Войти</span>
            </NuxtLink>
          </nav>

          <NuxtLink to="/profile" class="shop-header__mobile-profile" aria-label="Профиль">
            <NuxtImg src="/icons/Login.svg" alt="" />
          </NuxtLink>
        </div>

        <div class="shop-header__info">
          <div class="shop-header__links">
            <a href="#">Помощь специалиста</a>
            <a href="#">Информация для клиентов</a>
          </div>

          <div class="shop-header__contact-row">
            <a href="tel:+71234567890" class="shop-header__phone">8 (123) 456-78-90</a>
            <button type="button" class="shop-header__address">
              <NuxtImg src="/icons/geo-pvz.svg" alt="" />
              <span>Адреса ПВЗ</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <MobileStoreHeader class="shop-header--mobile" @toggle-catalog="toggleCatalogMenu" />

    <Transition name="shop-drawer-fade">
      <div v-if="showCatalogMenu" class="shop-drawer" @click.self="closeCatalogMenu">
        <div class="shop-drawer__panel">
          <div class="shop-drawer__head">
            <div>
              <p class="shop-drawer__eyebrow">Навигация</p>
              <h2>Каталог магазина</h2>
            </div>
            <button type="button" class="shop-drawer__close" aria-label="Закрыть меню"
              @click="closeCatalogMenu">×</button>
          </div>

          <div class="shop-drawer__grid">
            <section class="shop-drawer__section">
              <h3>Категории</h3>
              <NuxtLink v-for="link in categoryLinks" :key="link.to" :to="link.to" class="shop-drawer__link">
                {{ link.label }}
              </NuxtLink>
            </section>

            <section class="shop-drawer__section">
              <h3>Профиль</h3>
              <NuxtLink v-for="link in profileLinks" :key="link.to" :to="link.to" class="shop-drawer__link">
                {{ link.label }}
              </NuxtLink>
            </section>

            <section class="shop-drawer__section">
              <h3>Контакты</h3>
              <a href="tel:+71234567890" class="shop-drawer__link">8 (123) 456-78-90</a>
              <a href="#" class="shop-drawer__link">Помощь с подбором</a>
              <a href="#" class="shop-drawer__link">Жалобы и предложения</a>
              <button type="button" class="shop-drawer__pvz">
                <NuxtImg src="/icons/geo-pvz.svg" alt="" />
                <span>Адреса ПВЗ</span>
              </button>
            </section>
          </div>
        </div>
      </div>
    </Transition>

    <main class="shop-layout__main">
      <slot />
    </main>

    <footer class="shop-footer">
      <div class="shop-footer__shell">
        <section class="shop-footer__column">
          <h2>Профиль</h2>
          <NuxtLink to="/profile">Личный кабинет</NuxtLink>
          <NuxtLink to="/profile/orders">Заказы</NuxtLink>
          <NuxtLink to="/cart">Корзина</NuxtLink>
          <NuxtLink to="/profile/garage">Гараж</NuxtLink>
          <NuxtLink to="/profile/balance">Баланс</NuxtLink>
        </section>

        <section class="shop-footer__column">
          <h2>Поиск запчасти</h2>
          <NuxtLink to="/catalogs/TO">Запчасти для ТО</NuxtLink>
          <NuxtLink to="/catalogs/original">Поиск по VIN</NuxtLink>
        </section>

        <section class="shop-footer__column">
          <h2>Навигация</h2>
          <NuxtLink to="/catalogs/original">Оригинальный каталог</NuxtLink>
          <NuxtLink to="/catalogs">Шины и диски</NuxtLink>
          <NuxtLink to="/catalogs/TO">Запчасти для ТО</NuxtLink>
          <NuxtLink to="/catalogs">Аксессуары</NuxtLink>
          <NuxtLink to="/catalog?categoryName=akb">АКБ</NuxtLink>
          <NuxtLink to="/catalogs">Автохимия</NuxtLink>
          <NuxtLink to="/catalogs">Масла и техжидкости</NuxtLink>
          <NuxtLink to="/catalogs">Инструменты</NuxtLink>
        </section>

        <section class="shop-footer__column">
          <h2>Права</h2>
          <NuxtLink to="/">Политика конфиденциальности</NuxtLink>
        </section>

        <section class="shop-footer__column shop-footer__column--contacts">
          <h2>Присоединяйтесь</h2>
          <div class="shop-footer__socials">
            <NuxtImg src="/icons/socialMedia/vkIcon.svg" alt="ВКонтакте" />
            <NuxtImg src="/icons/socialMedia/telegramIcon.svg" alt="Telegram" />
          </div>

          <h2>Помощь и доп. информация</h2>
          <a href="tel:+71234567890">8 (123) 456-78-90 - Помощь с подбором</a>
          <a href="tel:+71234567890">8 (123) 456-78-90 - Жалобы и предложения</a>
          <button type="button" class="shop-footer__pvz">
            <NuxtImg src="/icons/geo-pvz.svg" alt="" />
            <span>Адреса ПВЗ</span>
          </button>
        </section>
      </div>

      <div class="shop-footer__branding">
        <div class="shop-footer__brand-card">
          <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип ЧиназесАвто" />
        </div>
        <p>©ЧиназесАвто 2026</p>
        <span>Все права защищены</span>
      </div>
    </footer>

    <MobileProfileNav v-if="isProfileRoute" />
  </div>
</template>

<style scoped lang="scss">
.shop-layout {
  min-height: 100vh;
}

.shop-layout__main {
  padding: 2.8rem 0 6.4rem;
}

.shop-header {
  position: static;
  z-index: 30;
  padding: 0;
}

.shop-header--mobile {
  display: none;
}

.shop-header__shell,
.shop-footer__shell,
.shop-footer__branding {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
}

.shop-header__shell {
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

.shop-header__burger,
.shop-header__catalog {
  border: 0;
  background: transparent;
  cursor: pointer;
}

.shop-header__burger {
  display: none;
  flex-direction: column;
  gap: 0.45rem;
  width: 2.4rem;

  span {
    width: 100%;
    height: 0.2rem;
    border-radius: 999px;
    background: #383838;
  }
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
  border-radius: 1.4rem;
  background: $linear-green;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;

  img {
    width: 1.9rem;
    filter: brightness(0) invert(1);
  }
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

  img {
    width: 2.3rem;
    height: 2.3rem;
  }
}

.shop-header__mobile-profile {
  display: none;
  align-items: center;
  justify-content: center;
  width: 4.2rem;
  height: 4.2rem;
  border-radius: 50%;

  img {
    width: 2.6rem;
  }
}

.shop-header__search-wrap {
  width: 100%;
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

.shop-header__address,
.shop-footer__pvz,
.shop-drawer__pvz {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  border: 0;
  background: transparent;
  color: $orange;
  cursor: pointer;
  font-size: 1.45rem;

  img {
    width: 1.9rem;
  }
}

.shop-footer {
  padding: 5rem 0 4rem;
  background: #1c1e20;
}

.shop-footer__shell {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 3rem;
}

.shop-footer__column {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  h2 {
    margin-bottom: 0.4rem;
    color: #fff;
    font-size: 2rem;
    font-weight: 700;
  }

  a,
  button,
  span {
    color: #b9b9b9;
    font-size: 1.55rem;
    line-height: 1.45;
  }
}

.shop-footer__column--contacts {
  gap: 1.2rem;
}

.shop-footer__socials {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;

  img {
    width: 3.8rem;
    height: 3.8rem;
  }
}

.shop-footer__branding {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 5rem;
  color: #fff;

  p {
    font-size: 2rem;
  }

  span {
    color: #8f8f8f;
    font-size: 1.5rem;
  }
}

.shop-footer__brand-card {
  display: inline-flex;
  width: fit-content;
  padding: 1.4rem 1.8rem;
  border-radius: 1.6rem;
  background: #fff;

  img {
    width: 22rem;
  }
}

.shop-drawer {
  position: fixed;
  inset: 0;
  z-index: 45;
  display: flex;
  justify-content: flex-start;
  background: rgba(17, 17, 17, 0.48);
}

.shop-drawer__panel {
  width: min(48rem, 100%);
  height: 100%;
  padding: 2.4rem;
  background: #fff;
  overflow-y: auto;
}

.shop-drawer__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2.4rem;

  h2 {
    font-size: 3rem;
    font-weight: 700;
    color: #222;
  }
}

.shop-drawer__eyebrow {
  margin-bottom: 0.8rem;
  color: $green;
  font-size: 1.4rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.shop-drawer__close {
  border: 0;
  background: transparent;
  color: #444;
  font-size: 3.6rem;
  line-height: 1;
  cursor: pointer;
}

.shop-drawer__grid {
  display: grid;
  gap: 2rem;
}

.shop-drawer__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: #fafafa;
  border-radius: 1.8rem;

  h3 {
    margin-bottom: 0.4rem;
    color: #222;
    font-size: 1.8rem;
    font-weight: 700;
  }
}

.shop-drawer__link {
  color: #5d5d5d;
  font-size: 1.55rem;
}

.shop-drawer-fade-enter-active,
.shop-drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.shop-drawer-fade-enter-from,
.shop-drawer-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1199px) {
  .shop-header {
    background: #fff;
    border-radius: 0 0 2.4rem 2.4rem;
  }

  .shop-header__top {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .shop-header__catalog {
    display: none;
  }

  .shop-header__actions {
    gap: 1.4rem;
  }

  .shop-footer__shell {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .shop-header--mobile {
    display: block;
  }
  .shop-header--desktop {
    display: none;
  }
}

@media (max-width: 991px) {
  .shop-header__shell {
    padding-top: 2.8rem;
  }

  .shop-layout__main {
    padding-top: 1.2rem;
  }

  .shop-header {
    backdrop-filter: none;
  }

  .shop-header__shell,
  .shop-footer__shell,
  .shop-footer__branding {
    width: calc(100% - 1.6rem);
  }

  .shop-header__shell {
    gap: 1.2rem;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  .shop-header__top {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1.2rem;
  }

  .shop-header__identity {
    gap: 1.2rem;
  }

  .shop-header__burger {
    display: inline-flex;
  }

  .shop-header__catalog,
  .shop-header__actions,
  .shop-header__links {
    display: none;
  }

  .shop-header__mobile-profile {
    display: inline-flex;
  }

  .shop-header__logo img {
    width: min(21rem, 100%);
  }

  .shop-header__search-wrap {
    grid-column: 1 / -1;
  }

  .shop-header__info {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
    padding-bottom: 0.8rem;
  }

  .shop-header__contact-row {
    justify-content: space-between;
    gap: 1.2rem;
  }

  .shop-header__phone,
  .shop-header__address {
    font-size: 1.25rem;
  }

  .shop-footer {
    padding: 4rem 0 12rem;
  }

  .shop-footer__shell {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3.2rem 2rem;
  }

  .shop-footer__column {
    h2 {
      font-size: 1.8rem;
    }

    a,
    button,
    span {
      font-size: 1.4rem;
    }
  }

  .shop-footer__branding {
    margin-top: 4rem;

    p {
      font-size: 1.8rem;
    }
  }
}

@media (max-width: 767px) {
  .shop-layout--profile .shop-layout__main {
    padding-bottom: 10rem;
  }

  .shop-header--desktop {
    display: none;
  }

  .shop-header--mobile {
    display: block;
  }

  .shop-header__shell,
  .shop-footer__shell,
  .shop-footer__branding {
    width: calc(100% - 1.6rem);
  }

  .shop-header__shell {
    padding-top: 8rem;
  }

  .shop-header__logo img {
    width: 19rem;
  }

  .shop-footer__shell {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .shop-footer__brand-card img {
    width: 18rem;
  }

  .shop-drawer__panel {
    width: 100%;
    padding: 2rem 1.6rem 2.4rem;
  }

  .shop-drawer__head h2 {
    font-size: 2.4rem;
  }
}
</style>
