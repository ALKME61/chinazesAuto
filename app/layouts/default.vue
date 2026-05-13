<script setup lang="ts">
import LayoutFooter from '~/components/shop/layoutFooter/ui/LayoutFooter.vue'
import MobileProfileNav from '~/components/shop/mobileProfileNav/ui/MobileProfileNav.vue'
import HeaderWidget from '~/components/shop/header/ui/Header.vue'

const route = useRoute()


const isProfileRoute = computed(() => route.path.startsWith('/profile'))
</script>

<template>
  <div class="shop-layout" :class="{ 'shop-layout--profile': isProfileRoute }">
    <HeaderWidget />

    <main class="shop-layout__main">
      <slot />
    </main>

    <LayoutFooter />

    <MobileProfileNav v-if="isProfileRoute" />
  </div>
</template>

<style scoped lang="scss">
.shop-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.shop-layout__main {
  flex: 1;
  padding: 2.8rem 0 6.4rem;
}

.shop-footer {
  padding: 5rem 0 4rem;
  background: #1c1e20;
}

.shop-footer__shell,
.shop-footer__branding {
  width: min(144rem, calc(100% - 4rem));
  margin: 0 auto;
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

.shop-footer__pvz {
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

@media (max-width: 1199px) {
  .shop-footer__shell {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 991px) {
  .shop-layout--profile .shop-layout__main {
    padding-bottom: 10rem;
  }

  .shop-layout__main {
    padding-top: 1.2rem;
  }

  .shop-footer {
    padding: 4rem 0 12rem;
  }

  .shop-footer__shell,
  .shop-footer__branding {
    width: calc(100% - 1.6rem);
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
  .shop-footer__shell,
  .shop-footer__branding {
    width: calc(100% - 1.6rem);
  }

  .shop-footer__shell {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .shop-footer__brand-card img {
    width: 18rem;
  }
}
</style>
