<script setup lang="ts">
type SearchMode = 'vin' | 'params'

const activeMode = ref<SearchMode>('params')
</script>

<template>
  <section class="car-search-card">
    <header class="car-search-card__header">
      <h2>Поиск авто</h2>
    </header>

    <div class="car-search-card__tabs" role="tablist" aria-label="Способ поиска автомобиля">
      <button
        type="button"
        class="car-search-card__tab"
        :class="{ 'car-search-card__tab--active': activeMode === 'vin' }"
        @click="activeMode = 'vin'"
      >
        По VIN
      </button>
      <button
        type="button"
        class="car-search-card__tab"
        :class="{ 'car-search-card__tab--active': activeMode === 'params' }"
        @click="activeMode = 'params'"
      >
        По параметрам
      </button>
    </div>

    <Search placeholder="VIN / FRAME" action-label="Найти" />
  </section>
</template>

<style scoped lang="scss">
.car-search-card {
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
  width: min(100%, 58rem);
  padding: 2.6rem;
  background: #fff;
  border-radius: 2.4rem;
}

.car-search-card__header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #2f2f2f;
}

.car-search-card__tabs {
  display: inline-grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  width: fit-content;
  border-radius: $radius-md;
  background: #1d1d1d;
}

.car-search-card__tab {
  min-width: 14rem;
  min-height: 5rem;
  padding: 0 2rem;
  border: 0;
  border-radius: $radius-md;
  background: transparent;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.car-search-card__tab--active {
  background: $green;
}

@media (max-width: 767px) {
  .car-search-card {
    width: 100%;
    padding: 2rem 1.6rem;
    border-radius: 2rem;
    gap: 1.8rem;
  }

  .car-search-card__header h2 {
    font-size: 1.8rem;
  }

  .car-search-card__tab {
    min-width: 12.8rem;
    min-height: 5rem;
    padding: 0 1.2rem;
    font-size: 1.45rem;
  }
}
</style>
