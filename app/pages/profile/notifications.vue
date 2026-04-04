<script setup lang="ts">
const notifications = [
  {
    title: 'Информация о заказах',
    orderId: '12422',
    messageStart: 'Заказ',
    messageEnd: 'готов к выдаче!',
    address: 'Вы можете забрать его по адресу - г. Москва, Ул. Пушкинская, д.22',
  },
  {
    title: 'Информация о заказах',
    orderId: '12422',
    messageStart: 'Заказ',
    messageEnd: 'готов к выдаче!',
    address: 'Вы можете забрать его по адресу - г. Москва, Ул. Пушкинская, д.22',
  },
]
</script>

<template>
  <section class="notifications">
    <article
      v-for="(notification, index) in notifications"
      :key="`${notification.orderId}-${index}`"
      class="notification-card"
    >
      <div class="notification-card__head">
        <div class="notification-card__icon-wrap">
          <NuxtImg
            class="notification-card__icon"
            src="/icons/profile/notificationIcon.svg"
            alt="Иконка уведомления"
          />
          <span class="notification-card__badge" />
        </div>

        <h2>{{ notification.title }}</h2>
      </div>

      <div class="notification-card__body">
        <p>
          {{ notification.messageStart }}
          <span>№{{ notification.orderId }}</span>
          {{ notification.messageEnd }}
        </p>
        <p>{{ notification.address }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.notifications {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2.2rem;
  min-width: 0;
}

.notification-card {
  width: 100%;
  padding: 2.4rem 2.6rem 2rem;
  background: #fff;
  border-radius: $radius-md;
  box-shadow: 0 12px 34px rgba(28, 30, 32, 0.04);
}

.notification-card__head {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin-bottom: 1.8rem;

  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #373737;
    line-height: 1.2;
  }
}

.notification-card__icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  height: 3.4rem;
  flex-shrink: 0;
}

.notification-card__icon {
  width: 2.6rem;
  height: 2.6rem;
}

.notification-card__badge {
  position: absolute;
  top: -0.1rem;
  right: -0.15rem;
  width: 1.1rem;
  height: 1.1rem;
  background: $green;
  border: 0.2rem solid #fff;
  border-radius: 50%;
}

.notification-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  p {
    font-size: 1.6rem;
    line-height: 1.4;
    color: #474747;
  }

  span {
    color: $orange;
  }
}
</style>
