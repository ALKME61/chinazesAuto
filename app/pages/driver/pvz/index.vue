<script setup>
definePageMeta({
  layout: 'driver',
})
</script>

<template>
  <main class="driver-pvz">
    <NuxtLink to="/driver/box-scanner">
      <section class="pvz-card" aria-label="ПВЗ №1">
        <div class="pvz-card__content">
          <div class="pvz-card__header">
            <h1>ПВЗ №1</h1>
            <p>Город. Ростов-на-дону,<br>ул. Пушкинская 1</p>
          </div>
  
          <div class="pvz-card__stats">
            <div class="pvz-stat">
              <img src="/icons/takeBoxIcon.svg" alt="" aria-hidden="true">
              <span>1 коробка</span>
            </div>
  
            <div class="pvz-stat">
              <img src="/icons/giveBoxIcon.svg" alt="" aria-hidden="true">
              <span>3 коробки</span>
            </div>
          </div>
        </div>
  
        <img class="pvz-card__warehouse" src="/icons/homePvzLinkIcon.png" alt="" aria-hidden="true">
      </section>
    </NuxtLink>
  </main>
</template>

<style scoped lang="scss">
.driver-pvz {
  min-height: calc(100vh - 16rem);
  margin-top: 8px;
  padding: 24px;
  border-radius: 12px 12px 0 0;
  background-color: #ffffff;
}

.pvz-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 354 / 233;
  border-radius: 8px;
  padding: 31px 30px 24px;
  color: #ffffff;
  background-color: $green;
  box-shadow:
    inset -30px 28px 36px -30px #17cd49,
    0 8px 18px rgba(18, 180, 62, 0.18);

  &::before,
  &::after {
    content: '';
    position: absolute;
    z-index: 0;
    border-radius: 50%;
    pointer-events: none;
  }

  &::before {
    right: -52.4%;
    bottom: -79.6%;
    width: 104.8%;
    aspect-ratio: 1;
    background-color: #12b43e;
  }

  &::after {
    right: -44.35%;
    bottom: -67.38%;
    width: 88.7%;
    aspect-ratio: 1;
    background-color: #16ba42;
  }
}

.pvz-card__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: min(100%, 205px);
  height: 100%;
}

.pvz-card__header {
  h1 {
    margin: 0;
    font-size: 24px;
    line-height: 1;
    font-weight: 600;
  }

  p {
    margin: 16px 0 0;
    font-size: 16px;
    line-height: 1.05;
    font-weight: 500;
  }
}

.pvz-card__stats {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pvz-stat {
  display: flex;
  align-items: center;
  gap: 17px;
  min-width: 0;
  font-size: 14px;
  line-height: 1.15;
  font-weight: 500;
  white-space: nowrap;

  img {
    width: 32px;
    height: 33px;
    flex: 0 0 auto;
  }
}

.pvz-card__warehouse {
  position: absolute;
  z-index: 1;
  right: 0%;
  bottom: 0%;
  width: 28%;
  max-width: none;
  pointer-events: none;
}

@media (max-width: 380px) {
  .driver-pvz {
    padding-inline: 18px;
  }

  .pvz-card {
    padding: 24px 18px 20px;
  }

  .pvz-card__content {
    width: min(100%, 206px);
  }

  .pvz-card__header {
    h1 {
      font-size: 24px;
    }

    p {
      font-size: 16px;
    }
  }

  .pvz-stat {
    gap: 12px;
    font-size: 14px;
  }
}
</style>
