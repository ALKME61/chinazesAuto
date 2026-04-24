<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    placeholder?: string
    actionLabel?: string
    modelValue?: string
    ariaLabel?: string
  }>(),
  {
    placeholder: 'Поиск по VIN, или артикулу',
    modelValue: '',
    ariaLabel: 'Поиск',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const hasTextButton = computed(() => Boolean(props.actionLabel))

function updateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label class="shop-search" :class="{ 'shop-search--compact': hasTextButton }">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :aria-label="ariaLabel"
      type="text"
      @input="updateValue"
    >

    <button type="button" class="shop-search__button" :class="{ 'shop-search__button__text': hasTextButton }">
      <span v-if="hasTextButton">{{ actionLabel }}</span>
      <NuxtImg v-else src="/icons/search.svg" alt="" />
    </button>
  </label>
</template>

<style scoped lang="scss">
.shop-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 4.8rem;

  input {
    width: 100%;
    min-height: 4.8rem;
    padding: 0 7.2rem 0 1.8rem;
    border: 0;
    border-radius: 1.2rem;
    background: #f5f5f5;
    color: #353535;
    font-size: 1.5rem;

    &::placeholder {
      color: #ababab;
    }
  }
}

.shop-search--compact {
  gap: 1.2rem;

  input {
    padding-right: 1.8rem;
  }
}

.shop-search__button {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 6.2rem;
  min-width: 6.2rem;
  height: 4.0rem;
  border: 0;
  border-radius: 1rem;
  background: $green;
  cursor: pointer;

  img {
    width: 1.9rem;
    height: 1.9rem;
  }
}

.shop-search__button__text {
  position: static;
  width: auto;
  height: 4.8rem;
  padding: 0 2.6rem;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;
}

@media (max-width: 767px) {
  .shop-search {
    min-height: 4.6rem;

    input {
      min-height: 4.4rem;
      padding-left: 1.6rem;
      padding-right: 6.7rem;
      border-radius: $spacing-md;
      font-size: 1.4rem;
    }
  }

  .shop-search__button {
    top: 0.4rem;
    right: 0.2rem;
    width: 8rem;
    min-width: 5.4rem;
    height: 3.8rem;
    border-radius: $spacing-md;

    img {
      width: 1.8rem;
      height: 1.8rem;
    }
  }

  .shop-search__button__text {
    width: 9.6rem;
    min-width: 9.6rem;
    padding: 0 1.6rem;
    font-size: 1.5rem;
    height: 4.4rem;;
  }
}
</style>
