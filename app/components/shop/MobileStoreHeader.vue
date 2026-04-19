<script setup lang="ts">
const emit = defineEmits<{
  (e: 'toggleCatalog'): void
}>()

const searchValue = ref('')
</script>

<template>
  <header class="mobile-store-header">
    <div class="mobile-store-header__shell">
      <div class="mobile-store-header__top">
        <button type="button" class="mobile-store-header__burger" aria-label="Открыть каталог" @click="emit('toggleCatalog')">
          <span />
          <span />
          <span />
        </button>

        <NuxtLink to="/" class="mobile-store-header__logo" aria-label="На главную">
          <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип ЧиназесАвто" />
        </NuxtLink>

        <NuxtLink to="/profile" class="mobile-store-header__profile" aria-label="Профиль">
          <NuxtImg src="/icons/Login.svg" alt="" />
        </NuxtLink>
      </div>

      <search />

      <div class="mobile-store-header__info">
        <a href="tel:+71234567890" class="mobile-store-header__phone">8 (123) 456-78-90</a>

        <button type="button" class="mobile-store-header__address">
          <NuxtImg src="/icons/geo-pvz.svg" alt="" />
          <span>Адреса ПВЗ</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.mobile-store-header__shell {
  margin: 0 auto;
  padding: 1.2rem 1.6rem 1.1rem;
  background: #ffffff;
  border-radius: 0 0 1.8rem 1.8rem;
}

.mobile-store-header__top {
  display: grid;
  grid-template-columns: 2.8rem minmax(0, 1fr) 3.2rem;
  align-items: center;
  gap: 1.4rem;
  margin-bottom: 1.2rem;
}

.mobile-store-header__burger {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.45rem;
  width: 2.8rem;
  height: 2.8rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  span {
    width: 100%;
    height: 0.2rem;
    border-radius: 999px;
    background: #383838;
  }
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

  img {
    width: 3rem;
    height: 3rem;
  }
}

.mobile-store-header__search {
  position: relative;
  display: block;
  margin-top: 1.8rem;

  input {
    width: 100%;
    height: 4.8rem;
    padding: 0 10.6rem 0 2.2rem;
    border: 0;
    border-radius: $radius-md ;
    background: #f5f5f5;
    color: #565656;
    font-size: 1.7rem;
    font-weight: 400;

    &::placeholder {
      color: #808080;
    }
  }
}

.mobile-store-header__search-button {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 7.3rem;
  height: 4.0rem;
  padding: 0;
  border: 0;
  border-radius: 0.6rem;
  background: $green;
  cursor: pointer;

  img {
    width: 2.4rem;
    height: 2.4rem;
  }
}

.mobile-store-header__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4rem;
  margin-top: 2rem;
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

  img {
    width: 1.9rem;
    height: 2.4rem;
  }
}

@media (max-width: 479px) {
  .mobile-store-header__shell {
    padding-left: 1.4rem;
    padding-right: 1.4rem;
  }

  .mobile-store-header__top {
    grid-template-columns: 2.6rem minmax(0, 1fr) 2.8rem;
    gap: 1.2rem;
  }

  .mobile-store-header__logo img {
    max-width: 26rem;
  }

  .mobile-store-header__search {
    margin-top: 1.6rem;

    input {
      height: 6.6rem;
      padding-left: 1.8rem;
      padding-right: 8.8rem;
      border-radius: 1.8rem;
      font-size: 1.5rem;
    }
  }

  .mobile-store-header__search-button {
    top: 0.7rem;
    right: 0.7rem;
    width: 6rem;
    height: 5.2rem;
    border-radius: 1.7rem;

    img {
      width: 2.1rem;
      height: 2.1rem;
    }
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

    img {
      width: 1.6rem;
      height: 2rem;
    }
  }
}
</style>
