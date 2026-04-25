<script setup lang="ts">
import Icon from '~/shared/ui-kit/Icon/Icon.vue'
import {
  categoryLinks,
  helpPhone,
  helpPhoneHref,
  profileLinks,
} from '~/shared/lib/navigation'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function closeCatalogMenu() {
  emit('close')
}
</script>

<template>
  <Transition name="shop-drawer-fade">
    <div v-if="props.show" class="shop-drawer" @click.self="closeCatalogMenu">
      <div class="shop-drawer__panel">
        <div class="shop-drawer__head">
          <div>
            <p class="shop-drawer__eyebrow">Навигация</p>
            <h2>Каталог магазина</h2>
          </div>

          <button
            type="button"
            class="shop-drawer__close"
            aria-label="Закрыть меню"
            @click="closeCatalogMenu"
          >
            &times;
          </button>
        </div>

        <div class="shop-drawer__grid">
          <section class="shop-drawer__section">
            <h3>Категории</h3>

            <NuxtLink
              v-for="link in categoryLinks"
              :key="`${link.label}-${link.to}`"
              :to="link.to"
              class="shop-drawer__link"
              @click="closeCatalogMenu"
            >
              {{ link.label }}
            </NuxtLink>
          </section>

          <section class="shop-drawer__section">
            <h3>Профиль</h3>

            <NuxtLink
              v-for="link in profileLinks"
              :key="`${link.label}-${link.to}`"
              :to="link.to"
              class="shop-drawer__link"
              @click="closeCatalogMenu"
            >
              {{ link.label }}
            </NuxtLink>
          </section>

          <section class="shop-drawer__section">
            <h3>Контакты</h3>

            <a :href="helpPhoneHref" class="shop-drawer__link">{{ helpPhone }}</a>
            <a href="#" class="shop-drawer__link">Помощь с подбором</a>
            <a href="#" class="shop-drawer__link">Жалобы и предложения</a>

            <button type="button" class="shop-drawer__pvz">
              <Icon name="geo-pvz" width="19" height="19" />
              <span>Адреса ПВЗ</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
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

.shop-drawer__pvz {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  border: 0;
  background: transparent;
  color: $orange;
  cursor: pointer;
  font-size: 1.45rem;
}

.shop-drawer-fade-enter-active,
.shop-drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.shop-drawer-fade-enter-from,
.shop-drawer-fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .shop-drawer__panel {
    width: 100%;
    padding: 2rem 1.6rem 2.4rem;
  }

  .shop-drawer__head h2 {
    font-size: 2.4rem;
  }
}
</style>
