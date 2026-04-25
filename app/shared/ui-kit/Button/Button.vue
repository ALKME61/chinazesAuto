<script setup lang="ts">
import type { ButtonColors } from '~/shared/types/button';

const props = withDefaults(
    defineProps<{
    subtext?: string
    background?: ButtonColors
    image?:string
}>(),
{
    background: 'green'
})

const slots = useSlots()
const defineClassName = ref<null | string>(null)

if(props.background) {
    defineClassName.value = `bg-${props.background}`
}

const hasSlotImage = computed(() => {
    const checkNodes = (nodes: any[] = []): boolean =>
        nodes.some((node) => {
            if (!node) {
                return false
            }

            if (node.type === 'img') {
                return true
            }

            const componentName = node.type?.name || node.type?.__name

            if (componentName === 'NuxtImg' || componentName === 'NuxtPicture') {
                return true
            }

            if (Array.isArray(node.children)) {
                return checkNodes(node.children)
            }

            return false
        })

    return checkNodes(slots.default?.() ?? [])
})

const hasImageContent = computed(() => Boolean(props.image) || hasSlotImage.value)

</script>
<template>
    <button type="button" :class="['button', defineClassName]">
        <span :class="['button__content', { 'button__content--with-image': hasImageContent }]">
            <slot />
            <NuxtImg v-if="props.image" :src="props.image" class="button__image"/>
        </span>
        <small v-if="props.subtext">{{ props.subtext }}</small>
    </button>
</template>



<style scoped lang="scss">
.bg-white {
    background-color: #fff;
    color: #10ae3b;
}
.bg-green {
    background-color: #10ae3b;
    color: #ffffff;
}
.button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    min-height: 6rem;
    border: 0;
    border-radius: $radius-lg;

    small {
        font-size: 1.4rem;
        opacity: 0.9;
    }
}

.button__content {
    display: block;
    font-size: 1.8rem;
    font-weight: 600;
    text-align: center;
}

.button__content--with-image {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.button__content--with-image :deep(img),
.button__image {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
}
</style>
