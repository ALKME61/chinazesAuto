<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const titlePlaceholder = 'Заголовок'
const imagePlaceholder = 'Загрузить изображение'
const descriptionPlaceholder = 'Описание'
const hasPreviewImage = false
</script>

<template>
  <section class="admin-notifications">
    <div class="admin-notifications__heading">
      <h1>Уведомления</h1>
    </div>

    <section class="admin-notifications__editor">
      <div class="admin-notifications__editor-header">
        <h2>Новое уведомление</h2>
        <p>Подготовьте шаблон сообщения для пользователей и сразу посмотрите, как оно будет выглядеть.</p>
      </div>

      <div class="admin-notifications__form">
        <label class="admin-notifications__field admin-notifications__field--wide">
          <span>Заголовок</span>
          <input :placeholder="titlePlaceholder" type="text">
        </label>

        <div class="admin-notifications__media-row">
          <button type="button" class="admin-notifications__upload">
            <span class="admin-notifications__upload-label">Изображение</span>

            <div class="admin-notifications__upload-body">
              <NuxtImg
                src="/icons/imageIcon.svg"
                alt="Иконка загрузки изображения"
                class="admin-notifications__upload-image"
              />

              <div class="admin-notifications__upload-copy">
                <strong>{{ imagePlaceholder }}</strong>
                <small>PNG, JPG или WEBP</small>
              </div>
            </div>
          </button>
        </div>

        <label class="admin-notifications__field admin-notifications__field--wide">
          <span>Описание</span>
          <textarea :placeholder="descriptionPlaceholder"></textarea>
        </label>
      </div>

      <div class="admin-notifications__actions">
        <button type="button" class="admin-notifications__submit">Отправить всем пользователям</button>

        <button type="button" class="admin-notifications__settings" aria-label="Настройки уведомления">
          <AdminIcon name="settings" :size="22" />
        </button>
      </div>
    </section>

    <div class="admin-notifications__preview-title">
      <h2>Предпросмотр</h2>
    </div>

    <article class="admin-notifications__preview">
      <header class="admin-notifications__preview-head">
        <div class="admin-notifications__preview-icon">
          <AdminIcon name="message" :size="20" />
          <span />
        </div>

        <div>
          <h3>{{ titlePlaceholder }}</h3>
          <p>Уведомление для всех пользователей</p>
        </div>
      </header>

      <p class="admin-notifications__preview-text">{{ descriptionPlaceholder }}</p>

      <div v-if="hasPreviewImage" class="admin-notifications__preview-image">
        <NuxtImg src="/icons/imageIcon.svg" alt="Превью изображения" />
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.admin-notifications {
  max-width: 118rem;
}

.admin-notifications__heading {
  margin-bottom: 2.4rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #434343;
  }
}

.admin-notifications__editor,
.admin-notifications__preview {
  background: #fff;
  border-radius: 1.8rem;
}

.admin-notifications__editor {
  max-width: 74rem;
  padding: 2.4rem 2.6rem 2.8rem;
}

.admin-notifications__editor-header {
  margin-bottom: 2.2rem;

  h2 {
    margin-bottom: 0.6rem;
    font-size: 2rem;
    font-weight: 700;
    color: #434343;
  }

  p {
    max-width: 48rem;
    font-size: 1.4rem;
    line-height: 1.45;
    color: #868686;
  }
}

.admin-notifications__form {
  display: grid;
  gap: 1.8rem;
}

.admin-notifications__field {
  display: grid;
  gap: 0.9rem;

  span {
    font-size: 1.3rem;
    font-weight: 500;
    color: #808080;
  }
}

.admin-notifications__field input,
.admin-notifications__field textarea {
  width: 100%;
  border: 1px solid #ededed;
  background: #fafafa;
  border-radius: 1.4rem;
  color: #4d4d4d;
  font-size: 1.45rem;

  &::placeholder {
    color: #a7a7a7;
    opacity: 1;
  }
}

.admin-notifications__field input {
  height: 5.4rem;
  padding: 0 1.8rem;
}

.admin-notifications__field textarea {
  min-height: 20.8rem;
  padding: 1.7rem 1.8rem;
  resize: none;
  line-height: 1.45;
}

.admin-notifications__media-row {
  display: flex;
  align-items: flex-start;
}

.admin-notifications__upload {
  display: grid;
  gap: 0.9rem;
  width: 32rem;
  padding: 0;
  background: transparent;
  border: 0;
  text-align: left;
  cursor: pointer;
}

.admin-notifications__upload-label {
  font-size: 1.3rem;
  font-weight: 500;
  color: #808080;
}

.admin-notifications__upload-body {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  min-height: 11.6rem;
  padding: 0 1.8rem;
  background: linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%);
  border: 1px dashed #d7e9dd;
  border-radius: 1.6rem;
}

.admin-notifications__upload-image {
  width: 4.8rem;
  height: 4.8rem;
  flex: 0 0 auto;
}

.admin-notifications__upload-copy {
  display: grid;
  gap: 0.35rem;

  strong {
    font-size: 1.55rem;
    font-weight: 600;
    color: #454545;
  }

  small {
    font-size: 1.3rem;
    color: #9a9a9a;
  }
}

.admin-notifications__actions {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin-top: 2.4rem;
}

.admin-notifications__submit {
  height: 5.4rem;
  padding: 0 2.4rem;
  background: $linear-green;
  border: 0;
  border-radius: 1.2rem;
  color: #fff;
  font-size: 1.45rem;
  font-weight: 500;
  cursor: pointer;
}

.admin-notifications__settings {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5.4rem;
  height: 5.4rem;
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 1.2rem;
  color: $green;
  box-shadow: 0 10px 24px rgba(15, 15, 15, 0.05);
  cursor: pointer;
}

.admin-notifications__preview-title {
  margin-top: 3.8rem;
  margin-bottom: 1.8rem;

  h2 {
    font-size: 2.8rem;
    font-weight: 700;
    color: #434343;
  }
}

.admin-notifications__preview {
  max-width: 108rem;
  padding: 2.2rem 2.6rem 2.4rem;
}

.admin-notifications__preview-head {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.8rem;

  h3 {
    margin-bottom: 0.35rem;
    font-size: 1.75rem;
    font-weight: 700;
    color: #404040;
  }

  p {
    font-size: 1.3rem;
    color: #9a9a9a;
  }
}

.admin-notifications__preview-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.8rem;
  height: 3.8rem;
  border: 2px solid $green;
  border-radius: 0.8rem;
  color: $green;

  span {
    position: absolute;
    top: -0.3rem;
    right: -0.3rem;
    width: 1.1rem;
    height: 1.1rem;
    background: $green;
    border: 2px solid #fff;
    border-radius: 50%;
  }
}

.admin-notifications__preview-text {
  max-width: 83rem;
  min-height: 7.2rem;
  font-size: 1.45rem;
  line-height: 1.5;
  color: #4c4c4c;
}

.admin-notifications__preview-image {
  margin-top: 1.8rem;

  img {
    width: 22rem;
    height: auto;
  }
}

@media (max-width: 1360px) {
  .admin-notifications {
    max-width: none;
  }

  .admin-notifications__editor,
  .admin-notifications__preview {
    max-width: none;
  }
}
</style>
