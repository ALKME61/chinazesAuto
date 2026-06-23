<script setup lang="ts">
import Icon from '~/shared/ui-kit/Icon/Icon.vue';

definePageMeta({
  layout: 'driver'
})

const api = useAPI()
const loading = ref(true)
const routes = ref<any[]>([])

async function loadRoutes() {
  loading.value = true
  try {
    const data: any = await api('/api/warehouse/driver/routes')
    routes.value = data?.results || []
  } catch { routes.value = [] }
  finally { loading.value = false }
}

onMounted(loadRoutes)

const addresses = computed(() =>
  routes.value.map((r: any) => ({
    id: r.id,
    title: r.dest || r.destination || 'ПВЗ',
    boxes: Array.from({ length: r.boxes || 0 }, (_, i) => ({
      id: i + 1,
      addressTitle: r.source || '',
      deliveryType: 'outcoming',
    })),
  }))
)

async function startRoute(id: number) {
  try {
    await api(`/api/warehouse/route/${id}/start`, { method: 'POST' })
    await loadRoutes()
  } catch { alert('Ошибка') }
}

async function completeRoute(id: number) {
  try {
    await api(`/api/warehouse/route/${id}/complete`, { method: 'POST' })
    await loadRoutes()
  } catch { alert('Ошибка') }
}

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
    <div v-if="loading" class="boxes__loading">Загрузка...</div>

    <div v-else-if="!routes.length" class="boxes__loading">Нет активных маршрутов</div>

    <div v-else class="boxes">
      <div v-for="route in routes" :key="route.id" class="boxes__container">
        <p>{{ route.source || 'Склад' }} → {{ route.dest || route.destination || 'ПВЗ' }}</p>
        <p class="boxes__status">Статус: {{ route.status }} · Коробок: {{ route.boxes || 0 }}</p>
        <div class="boxes__actions">
          <button v-if="route.status === 'new'" type="button" class="boxes__action" @click="startRoute(route.id)">Начать маршрут</button>
          <button v-if="route.status === 'in_transit'" type="button" class="boxes__action" @click="completeRoute(route.id)">Завершить</button>
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