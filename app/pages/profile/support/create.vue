<!-- pages/profile/support/create.vue -->
<template>
  <div class="create-ticket">
    <div class="create-ticket__header">
      <NuxtLink to="/profile/support" class="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Назад к списку</span>
      </NuxtLink>
      <h2>Новое обращение</h2>
      <p>Опишите вашу проблему, и мы поможем в ближайшее время</p>
    </div>

    <form @submit.prevent="handleSubmit" class="ticket-form">
      <!-- Категория -->
      <div class="form-group">
        <label class="form-label">Категория проблемы *</label>
        <div class="category-grid">
          <button
            v-for="(label, key) in categoryLabels"
            :key="key"
            type="button"
            :class="['category-card', { active: form.category === key }]"
            @click="form.category = key as TicketCategory"
          >
            <span class="category-icon">{{ categoryIcons[key] }}</span>
            <span class="category-label">{{ label }}</span>
          </button>
        </div>
      </div>

      <!-- Тема -->
      <div class="form-group">
        <label class="form-label" for="subject">Тема обращения *</label>
        <input
          id="subject"
          v-model="form.subject"
          type="text"
          class="form-input"
          placeholder="Кратко опишите суть проблемы"
          maxlength="200"
        />
        <span class="form-hint">{{ form.subject.length }}/200</span>
      </div>

      <!-- Сообщение -->
      <div class="form-group">
        <label class="form-label" for="message">Описание проблемы *</label>
        <textarea
          id="message"
          v-model="form.message"
          class="form-textarea"
          placeholder="Подробно опишите ситуацию. Чем больше деталей, тем быстрее мы сможем помочь."
          rows="6"
          maxlength="5000"
        ></textarea>
        <span class="form-hint">{{ form.message.length }}/5000</span>
      </div>

      <!-- Файлы -->
      <div class="form-group">
        <label class="form-label">Прикрепить файлы</label>
        <div class="file-upload">
          <input
            ref="fileInput"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            @change="onFilesSelected"
            class="file-input-hidden"
          />
          
          <!-- Список файлов -->
          <div v-if="files.length > 0" class="files-list">
            <div v-for="(file, index) in files" :key="index" class="file-item">
              <div class="file-info">
                <span class="file-icon">{{ getFileIcon(file) }}</span>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatSize(file.size) }}</span>
              </div>
              <button type="button" class="file-remove" @click="removeFile(index)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#FF4D4D" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Кнопка добавления -->
          <button 
            type="button" 
            class="file-add-btn" 
            @click="fileInput?.click()"
            v-if="files.length < 5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="#666" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Прикрепить файл</span>
          </button>
          <p class="form-hint">JPG, PNG, PDF, DOC до 10 МБ (макс. 5 файлов)</p>
        </div>
      </div>

      <!-- Капча -->
      <div class="form-group">
        <label class="form-label">Проверка *</label>
        <Captcha ref="captchaRef" v-model="form.captcha" />
      </div>

      <!-- Ошибки -->
      <div v-if="error" class="form-error">
        {{ error }}
      </div>

      <!-- Кнопки -->
      <div class="form-actions">
        <NuxtLink to="/profile/support" class="btn-cancel">Отмена</NuxtLink>
        <button 
          type="submit" 
          class="btn-submit"
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="!isSubmitting">Отправить обращение</span>
          <span v-else class="btn-spinner"></span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { TicketCategory } from '~/types/ticket'
import Captcha from '../../../components/shared/Captcha.vue'

const fileInput = ref<HTMLInputElement>()
const captchaRef = ref()
const isSubmitting = ref(false)
const error = ref('')

const categoryLabels: Record<string, string> = {
  order: 'Заказ',
  payment: 'Оплата',
  delivery: 'Доставка',
  product: 'Товар',
  account: 'Аккаунт'
}

const categoryIcons: Record<string, string> = {
  order: '📦',
  payment: '💳',
  delivery: '🚚',
  product: '🛍️',
  account: '👤'
}

const form = reactive({
  subject: '',
  message: '',
  category: '' as TicketCategory | '',
  captcha: ''
})

const files = ref<File[]>([])

const isFormValid = computed(() => {
  return form.category && 
         form.subject.length >= 5 && 
         form.message.length >= 10 &&
         form.captcha.length === 5
})

const onFilesSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const newFiles = Array.from(input.files)
  
  // Проверка размера
  for (const file of newFiles) {
    if (file.size > 10 * 1024 * 1024) {
      error.value = `Файл ${file.name} превышает 10 МБ`
      return
    }
  }

  // Проверка общего количества
  if (files.value.length + newFiles.length > 5) {
    error.value = 'Максимум 5 файлов'
    return
  }

  files.value = [...files.value, ...newFiles]
  input.value = '' // Сбрасываем input
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const getFileIcon = (file: File) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png'].includes(ext || '')) return '🖼️'
  if (ext === 'pdf') return '📄'
  if (['doc', 'docx'].includes(ext || '')) return '📝'
  return '📎'
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  try {
    isSubmitting.value = true
    error.value = ''

    // Сначала загружаем файлы
    let attachments: any[] = []
    if (files.value.length > 0) {
      const formData = new FormData()
      files.value.forEach(file => formData.append('files', file))
      
      const uploadResult = await $fetch('/api/tickets/upload', {
        method: 'POST',
        body: formData
      })
      attachments = uploadResult.files
    }

    // Создаём тикет
// Стало:
const response = await $fetch('/api/tickets', {
  method: 'POST',
  body: {
    subject: form.subject,
    message: form.message,
    category: form.category,
  }
})

console.log('✅ Ответ:', response)

// Редирект на страницу тикета
if (response.ticket?.id) {
  await navigateTo(`/profile/support/${response.ticket.id}`)
} else if (response.id) {
  await navigateTo(`/profile/support/${response.id}`)
} else {
  console.error('❌ Нет ID:', response)
  navigateTo('/profile/support')
}

  } catch (e: any) {
    error.value = e.data?.message || 'Произошла ошибка. Попробуйте снова.'
    captchaRef.value?.refresh() // Обновляем капчу
    form.captcha = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.create-ticket {
  background: #fff;
  border-radius: 2.4rem;
  padding: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.create-ticket__header {
  margin-bottom: 3rem;

  h2 {
    font-size: 2.4rem;
    font-weight: 700;
    color: #2d2d2d;
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 1.4rem;
    color: #9a9a9a;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.6rem;
  color: #666;
  font-size: 1.4rem;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #2d2d2d;
  }
}

.ticket-form {
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.form-label {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2d2d2d;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.4rem;
  border: 2px solid #e0e0e0;
  border-radius: 1.4rem;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #b0b0b0;
  }

  &.active {
    border-color: $green;
    background: rgba($green, 0.05);
  }
}

.category-icon {
  font-size: 2rem;
}

.category-label {
  font-size: 1.4rem;
  font-weight: 500;
  color: #2d2d2d;
}

.form-input,
.form-textarea {
  padding: 1.2rem 1.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 1.2rem;
  font-size: 1.5rem;
  color: #2d2d2d;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: $green;
  }

  &::placeholder {
    color: #b0b0b0;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 12rem;
}

.form-hint {
  font-size: 1.2rem;
  color: #b0b0b0;
}

.file-upload {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.file-input-hidden {
  display: none;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.4rem;
  background: #f8f9fa;
  border-radius: 1rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 1.8rem;
}

.file-name {
  font-size: 1.4rem;
  color: #2d2d2d;
  font-weight: 500;
}

.file-size {
  font-size: 1.2rem;
  color: #b0b0b0;
}

.file-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 0.8rem;

  &:hover {
    background: #fff0f0;
  }
}

.file-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.4rem;
  border: 2px dashed #d0d0d0;
  border-radius: 1.2rem;
  background: #fafafa;
  color: #666;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: $green;
    color: $green;
    background: rgba($green, 0.02);
  }
}

.form-error {
  padding: 1.2rem 1.6rem;
  background: #fff0f0;
  border-radius: 1.2rem;
  color: #ff4d4d;
  font-size: 1.4rem;
  border-left: 3px solid #ff4d4d;
}

.form-actions {
  display: flex;
  gap: 1.2rem;
  padding-top: 1rem;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 1.4rem;
  border-radius: 1.4rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
  border: none;

  &:hover {
    background: #e8e8e8;
  }
}

.btn-submit {
  background: $green;
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: darken($green, 5%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>