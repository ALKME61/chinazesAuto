<script setup lang="ts">
const props = withDefaults(
    defineProps<{
    subtext?: string
    background?: string
}>(),
{
    background: '#10AE3B'
}
)

</script>
<template>
    <button type="button" class="button" :style="`background:${props.background}`">
        <span><slot /></span>
        <small v-if="props.subtext">{{ props.subtext }}</small>
    </button>
</template>


<style scoped lang="scss">
.button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    min-height: 6rem;
    border: 0;
    border-radius: $radius-lg;
    color: #fff;

    span {
        font-size: 1.8rem;
        font-weight: 600;
    }

    small {
        font-size: 1.4rem;
        opacity: 0.9;
    }
}
</style>
