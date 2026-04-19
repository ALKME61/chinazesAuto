<script setup lang="ts">
const groups = [
  {
    label: 'Сегодня',
    items: [
      'Заказ №12422 готов к выдаче',
      'Заказ №12422 готов к выдаче',
    ],
  },
  {
    label: 'На этой неделе',
    items: [
      'Заказ №12422 готов к выдаче',
      'Заказ №12422 готов к выдаче',
    ],
  },
]
</script>

<template>
  <section class="notifications-page">
    <h1>Уведомления</h1>

    <div class="notifications-page__groups">
      <section v-for="group in groups" :key="group.label" class="notifications-page__group">
        <h2>{{ group.label }}</h2>

        <article v-for="item in group.items" :key="`${group.label}-${item}`" class="notifications-page__item">
          <span class="notifications-page__dot" />
          <div class="notifications-page__icon-wrap">
            <NuxtImg src="/icons/profile/notificationIcon.svg" alt="" />
            <span class="notifications-page__badge" />
          </div>
          <p>{{ item }}</p>
        </article>
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
.notifications-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.notifications-page h1 {
  color: #2c2c2c;
  font-size: 3.6rem;
  font-weight: 800;
}

.notifications-page__groups {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.notifications-page__group {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    color: #3a3a3a;
    font-size: 1.8rem;
    font-weight: 600;
  }
}

.notifications-page__item {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 1.2rem;
  align-items: center;
  padding: 1.4rem 0;
  border-bottom: 1px solid #efefef;

  p {
    color: #3f3f3f;
    font-size: 1.7rem;
  }
}

.notifications-page__dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: $orange;
}

.notifications-page__icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;

  img {
    width: 2.4rem;
  }
}

.notifications-page__badge {
  position: absolute;
  top: -0.1rem;
  right: -0.1rem;
  width: 1rem;
  height: 1rem;
  border: 0.2rem solid #fff;
  border-radius: 50%;
  background: $green;
}

@media (max-width: 991px) {
  .notifications-page h1 {
    font-size: 3rem;
  }
}

@media (max-width: 767px) {
  .notifications-page {
    gap: 0.8rem;
  }

  .notifications-page h1 {
    font-size: 1.8rem;
  }

  .notifications-page__groups {
    gap: 0.8rem;
    padding: 1.6rem;
    background: #fff;
    border-radius: 2rem;
    box-shadow: none;
  }

  .notifications-page__group h2 {
    font-size: 1.4rem;
  }

  .notifications-page__item {
    padding: 1.3rem 0;

    p {
      font-size: 1.35rem;
    }
  }
}
</style>
