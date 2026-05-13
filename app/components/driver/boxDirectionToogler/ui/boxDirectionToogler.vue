<script setup>
const activeDirection = ref('boxIn')

function toogleBoxDirection(boxDirection) {
    if(boxDirection === 'boxOut') {
        activeDirection.value = 'boxOut'
    } else {
        activeDirection.value = 'boxIn'
    }
}
</script>
<template>
    <div class="box-toogler">
        <div :class="`toogle-container ${activeDirection === 'boxIn' ? 'active' : ''}`" @click="toogleBoxDirection('boxIn')">
            <NuxtImg src="/driver/boxInBlackIcon.svg"></NuxtImg>
        </div>

        <div :class="`toogle-container ${activeDirection === 'boxOut' ? 'active' : ''}`" @click="toogleBoxDirection('boxOut')">
            <NuxtImg src="/driver/boxOutBlackIcon.svg"></NuxtImg>
        </div>

    </div>
</template>


<style scoped lang="scss">
.box-toogler {
    display: flex;
    gap: 3rem;
}

.toogle-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5.8rem;
    height: 5.8rem;
    border-radius: 29px;

    img {
        width: 2.8rem;
    }
}

.active {
    background-color: #EFEFEF;
    border: 1px solid #C9C9C9;
}
</style>