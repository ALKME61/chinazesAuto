<script setup lang="ts">
import Icon from '~/shared/ui-kit/Icon/Icon.vue';

definePageMeta({
  layout: 'driver'
})

const addresses = ref([
  {
    id: 1, title: 'Г. Ростов-на-Дону, ул. Пушкинская 1', boxes: [
      {
        id: 1, addressId: 1, deliveryType: 'outcoming'
      },
      {
        id: 2, addressId: 1, deliveryType: 'outcoming'
      },
      {
        id: 3, addressId: 1, deliveryType: 'outcoming'
      },
    ]
  },
  {
    id: 2, title: 'Г. Ростов-на-Дону, ул. Большая Садовая 34', boxes: [
      {
        id: 1, addressId: 2, deliveryType: 'outcoming'
      },
      {
        id: 2, addressId: 2, deliveryType: 'outcoming'
      },
      {
        id: 3, addressId: 2, deliveryType: 'outcoming'
      },
    ]
  }
])

</script>
<template>
  <main class="driver-pvz">
    <div class="boxes__header">
      <Icon name="boxIcon" size="28"></Icon>
      <h1>Коробки</h1>
    </div>
    <div class="boxes__in-the-car">
      <Icon name="deliverDriverIcon" size="24"></Icon>
      <h2>В машине</h2>
    </div>
    <div class="boxes">
      <div class="boxes__container" v-for="address in addresses">
        <h1>{{ address.title }}</h1>
        <div class="boxes__for-address">
          <div class="box" v-for="box in address.boxes ">
            {{ box.addressId }}
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
</style>