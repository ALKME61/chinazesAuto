<script setup lang="ts">
import Icon from '../../Icons/Icon.vue';

const props = defineProps<{
  type?: 'number' | 'password' | 'text'
  placeholder?: string
  modelValue?: string  // ← для v-model
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]  // ← эмит для v-model
}>()

const currentType = ref<'number' | 'password' | 'text'>(props.type || 'text')
const iconEye = ref('eyeBlack')

function toogleTypePassword() {
  if (currentType.value === 'password') {
    currentType.value = 'text'
    iconEye.value = 'closedEyeBlack'
  } else {
    currentType.value = 'password'
    iconEye.value = 'eyeBlack'
  }
}

// Обновляем значение через эмит
function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="UInput">
    <input
      :type="currentType"
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
    />
    <Icon
      :name="iconEye"
      v-if="type === 'password'"
      @click="toogleTypePassword"
    />
  </div>
</template>


<style scoped lang="scss">


.UInput {
  position: relative;
  width: 100%;
  img {
    position: absolute;
    top: 30%;
    right: 1.6rem;
  }
}

input {
  width: 100%;
  height: 5.4rem;
  padding: 0 1.8rem;
  border: 0;
  border-radius: 1.4rem;
  background: #f5f5f5;
  color: #2b2b2b;
  font-size: 1.6rem;
}
</style>