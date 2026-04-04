<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'

type ActiveTab = 'vin' | 'params'

// Активная вкладка
const activeTab = ref<ActiveTab>('vin')

// Ссылки на элементы
const vinRef = ref<HTMLParagraphElement | null>(null)
const paramsRef = ref<HTMLParagraphElement | null>(null)

// Стили слайдера (тип выводится автоматически)
const sliderStyle = ref({
  left: '0px',
  width: '0px'
})

const updateSlider = () => {
  const activeElement = activeTab.value === 'vin' ? vinRef.value : paramsRef.value
  if (activeElement) {
    const { offsetLeft, offsetWidth } = activeElement
    sliderStyle.value = {
      left: `${offsetLeft - 20}px`,
      width: `${offsetWidth + 40}px`
    }
  }
}

const setActive = (tab: ActiveTab) => {
  activeTab.value = tab
  updateSlider()
}

onMounted(() => {
  updateSlider()
})
</script>
<template>
    <div>
        <div class="car-search__block">
            <h1 class="car-search__header">Поиск по авто</h1>
            <div class="car-search__wrapper">
                <p ref="vinRef" :class="{ active: activeTab === 'vin' }" @click="setActive('vin')">
                    По VIN
                </p>
                <p ref="paramsRef" :class="{ active: activeTab === 'params' }" @click="setActive('params')">
                    По параметрам
                </p>
                <div class="green-slider" :style="{
                    left: sliderStyle.left,
                    width: sliderStyle.width
                }"></div>
            </div>
            <Search placeholder="VIN / FRAME" search-button-query="Найти"></Search>
        </div>
    </div>
</template>


<style scoped lang="scss">
.car-search__block {
    display: flex;
    flex-direction: column;
    gap: 2.2rem;
    background-color: #fff;
    padding: 2.2rem;
    width: 40%;
    border-radius: $radius-xl;

    .car-search__wrapper {
        position: relative;
        display: flex;
        align-items: center;
        background-color: #1b1b1b;
        padding-left: 2.2rem;
        padding-right: 2.2rem;
        height: $header-height;
        width: 240px;
        border-radius: $radius-md;
        justify-content: space-between;

        p {
            font-size: $font-size-p;
            color: #fff;
            z-index: 1;
            cursor: pointer;
            transition: color 0.2s;

            &.active {
                color: #fff; // можно изменить цвет активного текста, если нужно
            }
        }
    }

}

.green-slider {
    position: absolute;
    height: 100%;
    background-color: #18960a;
    top: 0;
    left: 0;
    z-index: 0;
    border-radius: $radius-md;
    transition: left 0.3s ease, width 0.3s ease;
}
</style>