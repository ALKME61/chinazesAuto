<script setup lang="ts">
import Icon from '~/shared/ui-kit/Icon/Icon.vue';

definePageMeta({
  layout: 'driver'
})

const addresses = ref([
  {
    id: 1, title: 'Г. Ростов-на-Дону, ул. Пушкинская 1', boxes: [
      {
        id: 1, addressTitle: 'Г. Ростов-на-Дону, ул. Пушкинская 1', deliveryType: 'outcoming', supplier: 'Профит-лига'
      },
      {
        id: 2, addressTitle: 'Г. Ростов-на-Дону, ул. Пушкинская 1', deliveryType: 'outcomingcoming', supplier: 'Профит-лига'
      },
      {
        id: 3, addressTitle: 'Г. Ростов-на-Дону, ул. Пушкинская 1', deliveryType: 'outcoming', supplier: 'Профит-лига'
      },
    ]
  },
  {
    id: 2, title: 'Г. Ростов-на-Дону, ул. Большая Садовая 34', boxes: [
      {
        id: 1, addressTitle: 'Г. Ростов-на-Дону, ул. Большая Садовая 34', deliveryType: 'outcoming', supplier: 'Профит-лига'
      },
      {
        id: 2, addressTitle: 'Г. Ростов-на-Дону, ул. Большая Садовая 34', deliveryType: 'outcoming', supplier: 'Профит-лига'
      },
      {
        id: 3, addressTitle: 'Г. Ростов-на-Дону, ул. Большая Садовая 34', deliveryType: 'outcoming', supplier: 'Профит-лига'
      },
    ]
  }
])

</script>
<template>
  <main class="driver-pvz">
    <div class="boxes__header">
      <Icon name="boxIcon" size="28"></Icon>
      <h1>Возвраты</h1>
    </div>
    <div class="boxes__in-the-car">
      <Icon name="deliverDriverIcon" size="24"></Icon>
      <h2>В машине</h2>
    </div>
    <div class="boxes">
      <div class="boxes__container" v-for="address in addresses">
        <p>{{ address.title }}</p>
        <div class="boxes__for-address">
          <div class="box" v-for="box in address.boxes">
            <h1>{{ box.addressTitle }}</h1>
            <span>{{ box.supplier }}</span>
            <div class="box__info">
              <span>{{ `№ ${box.id}` }}</span>
              <NuxtImg src="/icons/boxReturnIcon.svg"></NuxtImg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>


<style scoped lang="scss">
.driver-pvz {
  min-height: calc(100vh - 16rem);
  margin-top: 8px;
  padding: 24px;
  border-radius: 12px 12px 0 0;
  background-color: #ffffff;
  max-width: 900px;
  margin: 0.8rem auto;

  .boxes__header,
  .boxes__in-the-car {
    display: flex;
    gap: 1rem;
    color: $green;
    align-items: center;
    margin-bottom: 3.2rem;

    h1 {
      font-size: 22px;
    }

    h2 {
      color: $orange;
      font-size: 16px;
    }
  }
}
.boxes__for-address {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}
.boxes__container {
  p {
    font-size: 14px;
    font-weight: 300;
    color: #959595
  }
  display: flex;
  flex-direction: column;
  gap: 2.0rem;
  margin-bottom: 2rem;
}
.box {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  color: #ffffff;
  padding: 1.6rem;
  border-radius: $radius-md;
  background: $linear-green;
  h1 {
    font-size: 16px;
  }
  span {
    font-size: 15px;
  }
  .box__info {
    display: flex;
    justify-content: space-between;
    align-items: end;
    span {
      font-size: 15px;
      font-weight: 300;
    }
    img {
      width: 30px;
    }
  }
}
</style>