<!-- app/error.vue -->
<template>
  <div class="error-page">
    <div class="error-page__container">
      <!-- Декоративные элементы -->
      <div class="error-page__decor">
        <div class="error-page__circle error-page__circle--1"></div>
        <div class="error-page__circle error-page__circle--2"></div>
        <div class="error-page__circle error-page__circle--3"></div>
      </div>

      <!-- Основной контент -->
      <div class="error-page__content">
        <div class="error-page__code">404</div>

        <h1 class="error-page__title">
          {{ errorTitle }}
        </h1>
        
        <p class="error-page__description">
          {{ errorDescription }}
        </p>

        <div class="error-page__actions">
          <NuxtLink to="/" class="error-page__btn error-page__btn--primary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10H17M17 10L11 4M17 10L11 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>На главную</span>
          </NuxtLink>
          
          <button 
            v-if="error.statusCode !== 404" 
            class="error-page__btn error-page__btn--secondary"
            @click="handleError"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const errorTitle = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Страница не найдена'
    case 403:
      return 'Доступ запрещён'
    case 500:
      return 'Ошибка сервера'
    default:
      return 'Что-то пошло не так'
  }
})

const errorDescription = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Запрашиваемая страница не существует или была перемещена. Проверьте правильность адреса или вернитесь на главную.'
    case 403:
      return 'У вас нет прав для доступа к этой странице. Возможно, нужно войти в аккаунт с другими правами.'
    case 500:
      return 'На сервере произошла ошибка. Мы уже работаем над её исправлением. Попробуйте обновить страницу позже.'
    default:
      return props.error.message || 'Произошла непредвиденная ошибка. Попробуйте обновить страницу.'
  }
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.error-page__container {
  position: relative;
  max-width: 600px;
  width: 100%;
  text-align: center;
}

// Декоративные круги
.error-page__decor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}



.error-page__content {
  position: relative;
  z-index: 1;
  background: white;
  border-radius: 2.4rem;
  padding: 4rem 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.error-page__code {
  font-size: 8rem;
  font-weight: 800;
  background: #10ae3b;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;
}

.error-page__icon {
  margin-bottom: 2rem;
  
  svg {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
}

.error-page__title {
  font-size: 2.4rem;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.error-page__description {
  font-size: 1.6rem;
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
}

.error-page__actions {
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.error-page__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 2.4rem;
  border-radius: 1.4rem;
  font-size: 1.6rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  
  &--primary {
    background: $green;
    color: white;
    
    &:hover {
      background: darken($green, 5%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($green, 0.3);
    }
  }
  
  &--secondary {
    background: white;
    color: #2d2d2d;
    border-color: #dee2e6;
    
    &:hover {
      background: #f8f9fa;
      border-color: #adb5bd;
      transform: translateY(-2px);
    }
  }
}

// Анимация появления
.error-page__content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Адаптив
@media (max-width: 768px) {
  .error-page {
    padding: 1.6rem;
  }
  
  .error-page__content {
    padding: 3rem 2rem;
    border-radius: 2rem;
  }
  
  .error-page__code {
    font-size: 6rem;
  }
  
  .error-page__title {
    font-size: 2rem;
  }
  
  .error-page__description {
    font-size: 1.4rem;
  }
  
  .error-page__btn {
    width: 100%;
    justify-content: center;
    padding: 1rem 2rem;
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .error-page__content {
    padding: 2.4rem 1.6rem;
  }
  
  .error-page__code {
    font-size: 5rem;
  }
  
  .error-page__icon svg {
    width: 80px;
    height: 80px;
  }
}
</style>