<!-- components/shared/Captcha.vue -->
<template>
  <div class="captcha-wrapper">
    <div class="captcha">
      <div class="captcha__display" @click="refreshCaptcha">
        <canvas ref="canvasRef" width="150" height="45"></canvas>
      </div>
      <button type="button" class="captcha__refresh" @click="refreshCaptcha" title="Обновить">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 4V10H7M23 20V14H17" stroke="#9A9A9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.49 9C19.9828 7.56678 19.1209 6.28542 17.9845 5.27542C16.8482 4.26543 15.4747 3.55976 13.9917 3.22426C12.5087 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4913 21.1113 10.0083 20.7757C8.5253 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="#9A9A9A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <input
      v-model="userInput"
      type="text"
      class="captcha__input"
      placeholder="Введите символы"
      maxlength="5"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const canvasRef = ref<HTMLCanvasElement>()
const captchaText = ref('')
const userInput = ref('')

const drawCaptcha = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, 150, 45)

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  captchaText.value = ''
  for (let i = 0; i < 5; i++) {
    captchaText.value += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  // Фон
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, 150, 45)

  // Символы
  for (let i = 0; i < captchaText.value.length; i++) {
    const x = 18 + i * 28
    const y = 32
    
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((Math.random() - 0.5) * 0.6)
    
    ctx.font = `bold ${Math.random() * 6 + 20}px Arial, sans-serif`
    const hue = Math.random() * 360
    ctx.fillStyle = `hsl(${hue}, 60%, ${Math.random() * 20 + 25}%)`
    ctx.shadowColor = 'rgba(0,0,0,0.1)'
    ctx.shadowBlur = 2
    ctx.fillText(captchaText.value[i], 0, 0)
    ctx.restore()
  }

  // Линии
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.strokeStyle = `rgba(0,0,0,0.1)`
    ctx.lineWidth = 1
    ctx.moveTo(Math.random() * 150, Math.random() * 45)
    ctx.quadraticCurveTo(Math.random() * 150, Math.random() * 45, Math.random() * 150, Math.random() * 45)
    ctx.stroke()
  }

  // Точки
  for (let i = 0; i < 25; i++) {
    ctx.fillStyle = `rgba(0,0,0,0.15)`
    ctx.fillRect(Math.random() * 150, Math.random() * 45, 2, 2)
  }
}

const onInput = () => {
  userInput.value = userInput.value.toUpperCase()
  emit('update:modelValue', userInput.value)
}

const refreshCaptcha = () => {
  userInput.value = ''
  emit('update:modelValue', '')
  drawCaptcha()
}

defineExpose({
  refresh: refreshCaptcha
})

onMounted(() => {
  drawCaptcha()
})
</script>

<style scoped lang="scss">
.captcha-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.captcha {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.captcha__display {
  border: 2px solid #e0e0e0;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s;
  background: #fff;
  width: 150px;

  &:hover {
    border-color: #b0b0b0;
  }

  canvas {
    display: block;
    width: 150px;
    height: 45px;
  }
}

.captcha__refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 1rem;
  background: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    border-color: #b0b0b0;
  }
}

.captcha__input {
  padding: 1rem 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2d2d;
  text-align: center;
  letter-spacing: 0.4rem;
  font-family: monospace;
  transition: border-color 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: $green;
  }

  &::placeholder {
    color: #b0b0b0;
    letter-spacing: 0;
    font-weight: 400;
    font-family: inherit;
    font-size: 1.3rem;
  }
}
</style>