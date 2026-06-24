<script setup lang="ts">
defineProps<{
  title: string
  categories?: { pt_id: number; name: string; icon?: string }[]
  brands?: string[]
  loading?: boolean
}>()

const emits = defineEmits<{
  categoryClick: [ptId: number]
  brandClick: [brand: string]
}>()

const imagesLoaded = ref<Record<string, boolean>>({})

const onImageLoad = (name: string) => { imagesLoaded.value[name] = true }

function getIconUrl(icon: string | undefined): string {
  if (!icon) return '/productExample.png'
  return `/icons/categories/${icon}.svg`
}
</script>

<template>
  <section class="main-block card-section">
    <div class="main-block__head">
      <h2>{{ title }}</h2>
    </div>

    <div v-if="loading" class="main-block__loading">Загрузка...</div>

    <template v-else>
      <div v-if="categories?.length" class="main-block__categories">
        <button
          v-for="cat in categories"
          :key="cat.pt_id"
          type="button"
          class="main-block__cat-btn"
          @click="emits('categoryClick', cat.pt_id)"
        >
          <NuxtImg
            :src="getIconUrl(cat.icon)"
            :alt="cat.name"
            :class="{ loaded: imagesLoaded[cat.name] }"
            @load="onImageLoad(cat.name)"
          />
          <span>{{ cat.name }}</span>
        </button>
      </div>

      <div v-if="brands?.length" class="main-block__brands">
        <span>Популярные бренды:</span>
        <div class="main-block__brands-list">
          <button
            v-for="brand in brands.slice(0, 8)"
            :key="brand"
            type="button"
            class="main-block__brand-btn"
            @click="emits('brandClick', brand)"
          >
            {{ brand }}
          </button>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.card-section {
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.8rem;
  box-shadow: 0 20px 50px rgba(28, 30, 32, 0.05);
}

.main-block__head {
  margin-bottom: 1.6rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #2c2c2c;
  }
}

.main-block__loading {
  text-align: center;
  padding: 2rem;
  color: #888;
  font-size: 1.4rem;
}

.main-block__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.main-block__cat-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  min-height: 4.4rem;
  padding: 0 1.6rem;
  background: #f4f7f4;
  border: 0;
  border-radius: 1.2rem;
  color: #3c3c3c;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #e8f0e9;
  }

  img {
    width: 2.4rem;
    height: 2.4rem;
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }

  span {
    white-space: nowrap;
  }
}

.main-block__brands {
  margin-top: 1.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  > span {
    font-size: 1.3rem;
    color: #888;
    white-space: nowrap;
  }
}

.main-block__brands-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.main-block__brand-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.2rem;
  padding: 0 1.2rem;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  color: #18b536;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #18b536;
    color: #fff;
    border-color: #18b536;
  }
}

@media (max-width: 767px) {
  .card-section {
    padding: 1.6rem;
    border-radius: 2rem;
  }

  .main-block__categories {
    gap: 0.6rem;
  }

  .main-block__cat-btn {
    min-height: 3.8rem;
    padding: 0 1.2rem;
    font-size: 1.3rem;
  }

  .main-block__brands {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
