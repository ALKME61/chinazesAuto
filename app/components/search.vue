<script setup lang="ts">
const props = defineProps({
    placeholder: {
        type: String,
        default: 'Поиск по VIN, или артикулу'},
    searchButtonQuery: String
})

type requiredPostions = 'absolute' | 'static'

const propsValidation = () => {
    if (props.searchButtonQuery && props.searchButtonQuery.length > 25) {
        throw new Error("The maximum value of an searchButtonQuery is 25, while got " + props.searchButtonQuery.length);
    }
}

onMounted(() => {
    propsValidation()
})

const buttonStyle = ref({
    position: <requiredPostions>'absolute',
    height: '38px',
})
function addButtonClass() {
    if(props.searchButtonQuery) {
        buttonStyle.value.position = 'static'
        buttonStyle.value.height = '46px'

        return 'header__search-button-static'
    } else {
        return 'header__search-button'
    }
}

</script>
<template>
    <div class="header__search">
        <input type="text" class="input" :placeholder="props.placeholder">
        <button 
        :style="{
          position: buttonStyle.position,
          height: buttonStyle.height
        }"
        :class="addButtonClass()"
        aria-label="Поиск">
            <p v-if="props.searchButtonQuery">
                {{ props.searchButtonQuery }}
            </p>
            <NuxtImg v-else src="/icons/search.svg" alt="Лупа поиска" />
        </button>
    </div>
</template>


<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.header__search-button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 4px;
    right: 4px;
    background-color: $green;
    height: $header-height - 8px;
    width: 7rem;
    border-radius: $radius-sm;
    z-index: 11;
    cursor: pointer;
}

.header__search-button-static{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $green;
    height: $header-height - 8px;
    padding-left: $spacing-2xl;
    padding-right: $spacing-2xl;
    white-space: nowrap;
    border-radius: $radius-md;
    z-index: 11;
    cursor: pointer;
    font-size: $font-size-p;
    color: #fff
}

.header__search {
    position: relative;
    display: flex;
    gap: $spacing-md;
    flex: 1;
    max-width: 610px;
    img {
        width: 2.2rem;
    }
}

</style>