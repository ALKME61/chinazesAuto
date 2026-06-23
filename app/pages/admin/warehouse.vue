<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const api = useAPI()
const route = useRoute()
const router = useRouter()

const tab = computed(() => {
  const t = route.query.tab
  if (t === 'routes' || t === 'racks' || t === 'stock') return t
  return 'stock'
})

function setTab(t: string) {
  router.replace({ query: { tab: t } })
}

const pickupPoints = ref<any[]>([])
const loadingPoints = ref(false)

async function loadPickupPoints() {
  loadingPoints.value = true
  try {
    const data: any = await api('/api/warehouse/pickup-points')
    pickupPoints.value = data?.results || (Array.isArray(data) ? data : [])
  } catch {
    pickupPoints.value = []
  } finally {
    loadingPoints.value = false
  }
}

onMounted(loadPickupPoints)

const routesList = ref<any[]>([])
const routesLoading = ref(false)

async function loadRoutes() {
  routesLoading.value = true
  try {
    const data: any = await api('/api/warehouse/route/list')
    routesList.value = data?.results || (Array.isArray(data) ? data : [])
  } catch {
    routesList.value = []
  } finally {
    routesLoading.value = false
  }
}

const routeForm = reactive({
  driver_id: '',
  source_id: '',
  dest_id: '',
})
const creatingRoute = ref(false)
const routeCreateResult = ref<any>(null)

async function createRoute() {
  if (!routeForm.driver_id || !routeForm.source_id || !routeForm.dest_id) return
  creatingRoute.value = true
  routeCreateResult.value = null
  try {
    const data: any = await api('/api/warehouse/route/create', {
      method: 'POST',
      body: {
        driver_id: Number(routeForm.driver_id),
        source_id: Number(routeForm.source_id),
        dest_id: Number(routeForm.dest_id),
      },
    })
    routeCreateResult.value = data
    routeForm.driver_id = ''
    routeForm.source_id = ''
    routeForm.dest_id = ''
    await loadRoutes()
  } catch {
    alert('Ошибка создания маршрута')
  } finally {
    creatingRoute.value = false
  }
}

const racksList = ref<any[]>([])
const racksLoading = ref(false)
const rackPvzId = ref('')

async function loadRacks() {
  if (!rackPvzId.value) return
  racksLoading.value = true
  try {
    const data: any = await api('/api/warehouse/cell/racks', { params: { pvz_id: Number(rackPvzId.value) } })
    racksList.value = data?.results || (Array.isArray(data) ? data : [])
  } catch {
    racksList.value = []
  } finally {
    racksLoading.value = false
  }
}

const createRackForm = reactive({
  pvz_id: '',
  rack: '',
  shelf_count: 3,
  cells_per_shelf: 3,
})
const creatingRack = ref(false)
const rackCreateResult = ref<any>(null)

async function createRack() {
  if (!createRackForm.pvz_id || !createRackForm.rack) return
  creatingRack.value = true
  rackCreateResult.value = null
  try {
    const data: any = await api('/api/warehouse/cell/rack/create', {
      method: 'POST',
      body: {
        pvz_id: Number(createRackForm.pvz_id),
        rack: createRackForm.rack,
        shelf_count: createRackForm.shelf_count,
        cells_per_shelf: createRackForm.cells_per_shelf,
      },
    })
    rackCreateResult.value = data
    if (rackPvzId.value === createRackForm.pvz_id) await loadRacks()
  } catch {
    alert('Ошибка создания стеллажа')
  } finally {
    creatingRack.value = false
  }
}

async function deleteRack(pvzId: number, rack: string) {
  if (!confirm(`Удалить стеллаж ${rack}?`)) return
  try {
    await api('/api/warehouse/cell/rack/delete', {
      method: 'POST',
      body: { pvz_id: pvzId, rack },
    })
    await loadRacks()
  } catch {
    alert('Ошибка удаления стеллажа')
  }
}

const nextCell = ref<any>(null)
const nextCellPvzId = ref('')
const nextCellLoading = ref(false)

async function loadNextCell() {
  if (!nextCellPvzId.value) return
  nextCellLoading.value = true
  nextCell.value = null
  try {
    const data: any = await api('/api/warehouse/cell/next', { params: { pvz_id: Number(nextCellPvzId.value) } })
    nextCell.value = data
  } catch {
    nextCell.value = null
  } finally {
    nextCellLoading.value = false
  }
}

watch(tab, (t) => {
  if (t === 'routes') loadRoutes()
})

const utilization = [
  { label: 'Алчевск', value: '78%', color: '#18b536' },
  { label: 'Артемовск', value: '64%', color: '#68d27f' },
  { label: 'Зоринск (распредцентр)', value: '82%', color: '#18b536' },
  { label: 'Ростов (склад)', value: '41%', color: '#b9e8c4' },
  { label: 'Чернухино', value: '55%', color: '#68d27f' },
]

const warehouseTasks = [
  { title: 'Низкий остаток по фильтрам', note: '12 позиций требуют пополнения', tone: 'orange' },
  { title: 'Ожидается поставка BOSCH', note: 'Приемка назначена на сегодня', tone: 'green' },
  { title: 'Проверить пересорт', note: 'Склад РНД-Центр, 4 позиции', tone: 'gray' },
]
</script>

<template>
  <section class="admin-warehouse">
    <div class="admin-warehouse__heading">
      <h1>Склад</h1>
      <p>Держим остатки, поставки и точки пополнения под контролем.</p>
    </div>

    <div class="admin-warehouse__tabs">
      <button type="button" :class="['admin-warehouse__tab', { 'admin-warehouse__tab--active': tab === 'stock' }]" @click="setTab('stock')">Остатки</button>
      <button type="button" :class="['admin-warehouse__tab', { 'admin-warehouse__tab--active': tab === 'routes' }]" @click="setTab('routes')">Маршруты</button>
      <button type="button" :class="['admin-warehouse__tab', { 'admin-warehouse__tab--active': tab === 'racks' }]" @click="setTab('racks')">Стеллажи</button>
    </div>

    <template v-if="tab === 'stock'">
      <div class="admin-warehouse__top">
        <div class="admin-warehouse__stats">
          <div class="admin-panel admin-warehouse__card admin-warehouse__card--total">
            <AdminMetricCard title="Всего товаров" value="12 384" :change="{ value: '+3.2%', positive: true }" />
          </div>
          <div class="admin-panel admin-warehouse__card admin-warehouse__card--attention">
            <AdminMetricCard title="Требуют внимания" value="47" :change="{ value: '+8', positive: false }" />
          </div>
          <div class="admin-panel admin-warehouse__card admin-warehouse__card--incoming">
            <AdminMetricCard title="Поставки сегодня" value="6" />
          </div>
          <div class="admin-panel admin-warehouse__card admin-warehouse__card--moves">
            <AdminMetricCard title="Перемещения" value="14" />
          </div>
          <div class="admin-panel admin-warehouse__card admin-warehouse__card--review">
            <AdminMetricCard title="На проверке" value="9" />
          </div>
          <div class="admin-panel admin-warehouse__card admin-warehouse__card--writeoff">
            <AdminMetricCard title="Списания" value="3" />
          </div>
        </div>

        <div class="admin-panel admin-warehouse__capacity">
          <h2>Загрузка ПВЗ</h2>
          <div class="admin-warehouse__capacity-list">
            <div v-for="item in utilization" :key="item.label" class="admin-warehouse__capacity-row">
              <div class="admin-warehouse__capacity-meta">
                <strong>{{ item.label }}</strong>
                <span>{{ item.value }}</span>
              </div>
              <div class="admin-warehouse__capacity-track">
                <div class="admin-warehouse__capacity-fill" :style="{ width: item.value, background: item.color }" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="admin-panel admin-warehouse__tasks-panel">
        <h2>Задачи</h2>
        <div class="admin-warehouse__tasks-list">
          <div v-for="task in warehouseTasks" :key="task.title" class="admin-warehouse__task">
            <div class="admin-warehouse__task-dot" :class="`admin-warehouse__task-dot--${task.tone}`" />
            <div>
              <h3>{{ task.title }}</h3>
              <p>{{ task.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="tab === 'routes'">
      <div class="admin-warehouse__section">
        <div class="admin-warehouse__section-head">
          <h2>Маршруты</h2>
        </div>

        <div class="admin-warehouse__form">
          <h3>Создать маршрут</h3>
          <div class="admin-warehouse__form-row">
            <label>
              <span>ID водителя</span>
              <input v-model="routeForm.driver_id" type="number" placeholder="driver_id">
            </label>
            <label>
              <span>ID откуда</span>
              <input v-model="routeForm.source_id" type="number" placeholder="source_id">
            </label>
            <label>
              <span>ID куда</span>
              <input v-model="routeForm.dest_id" type="number" placeholder="dest_id">
            </label>
            <button type="button" class="admin-warehouse__primary" :disabled="creatingRoute" @click="createRoute">
              {{ creatingRoute ? 'Создание...' : 'Создать' }}
            </button>
          </div>
          <div v-if="routeCreateResult" class="admin-warehouse__result">
            Маршрут #{{ routeCreateResult.id }} создан, статус: {{ routeCreateResult.status }}
          </div>
        </div>

        <div class="admin-warehouse__list">
          <div v-if="routesLoading" class="admin-warehouse__empty">Загрузка...</div>
          <div v-else-if="!routesList.length" class="admin-warehouse__empty">Нет маршрутов</div>
          <div v-else>
            <div class="admin-warehouse__list-head">
              <span>ID</span>
              <span>Откуда</span>
              <span>Куда</span>
              <span>Водитель</span>
              <span>Статус</span>
            </div>
            <div v-for="r in routesList" :key="r.id" class="admin-warehouse__list-row">
              <span>{{ r.id }}</span>
              <span>{{ r.source || r.source_id }}</span>
              <span>{{ r.dest || r.dest_id }}</span>
              <span>{{ r.driver || r.driver_id }}</span>
              <span>{{ r.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="tab === 'racks'">
      <div class="admin-warehouse__section">
        <div class="admin-warehouse__section-head">
          <h2>Стеллажи</h2>
        </div>

        <div class="admin-warehouse__form">
          <h3>Создать стеллаж</h3>
          <div class="admin-warehouse__form-row">
            <label>
              <span>ПВЗ ID</span>
              <input v-model="createRackForm.pvz_id" type="number" placeholder="pvz_id">
            </label>
            <label>
              <span>Стеллаж</span>
              <input v-model="createRackForm.rack" type="text" placeholder="A">
            </label>
            <label>
              <span>Полок</span>
              <input v-model="createRackForm.shelf_count" type="number" min="1" max="10">
            </label>
            <label>
              <span>Ячеек на полку</span>
              <input v-model="createRackForm.cells_per_shelf" type="number" min="1" max="20">
            </label>
            <button type="button" class="admin-warehouse__primary" :disabled="creatingRack" @click="createRack">
              {{ creatingRack ? 'Создание...' : 'Создать' }}
            </button>
          </div>
          <div v-if="rackCreateResult" class="admin-warehouse__result">
            Создано {{ rackCreateResult.created }} ячеек на стеллаже {{ rackCreateResult.rack }}
          </div>
        </div>

        <div class="admin-warehouse__form">
          <h3>Просмотр стеллажей ПВЗ</h3>
          <div class="admin-warehouse__form-row">
            <label>
              <span>ПВЗ ID</span>
              <input v-model="rackPvzId" type="number" placeholder="pvz_id">
            </label>
            <button type="button" class="admin-warehouse__primary" @click="loadRacks">Загрузить</button>
          </div>

          <div v-if="racksLoading" class="admin-warehouse__empty">Загрузка...</div>
          <div v-else-if="!racksList.length && rackPvzId" class="admin-warehouse__empty">Нет стеллажей</div>
          <div v-else-if="racksList.length" class="admin-warehouse__racks">
            <div v-for="rack in racksList" :key="rack.rack" class="admin-warehouse__rack-card">
              <div class="admin-warehouse__rack-head">
                <strong>Стеллаж {{ rack.rack }}</strong>
                <button type="button" class="admin-warehouse__danger-btn" @click="deleteRack(Number(rackPvzId), rack.rack)">Удалить</button>
              </div>
              <div v-if="rack.cells" class="admin-warehouse__rack-cells">
                <span v-for="cell in rack.cells" :key="cell" class="admin-warehouse__cell-badge">{{ cell }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-warehouse__form">
          <h3>Свободная ячейка</h3>
          <div class="admin-warehouse__form-row">
            <label>
              <span>ПВЗ ID</span>
              <input v-model="nextCellPvzId" type="number" placeholder="pvz_id">
            </label>
            <button type="button" class="admin-warehouse__primary" :disabled="nextCellLoading" @click="loadNextCell">
              {{ nextCellLoading ? 'Поиск...' : 'Найти' }}
            </button>
          </div>
          <div v-if="nextCell" class="admin-warehouse__result">
            Свободная ячейка: {{ nextCell.rack }}/{{ nextCell.shelf }}/{{ nextCell.cell }} (ID: {{ nextCell.id }})
          </div>
        </div>

        <div v-if="pickupPoints.length" class="admin-warehouse__form">
          <h3>ПВЗ в системе</h3>
          <div class="admin-warehouse__pp-list">
            <div v-for="p in pickupPoints" :key="p.id" class="admin-warehouse__pp-item">
              <strong>{{ p.name || 'ПВЗ #' + p.id }}</strong>
              <span>{{ p.type || '' }} · id: {{ p.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.admin-warehouse__heading {
  margin-bottom: 1.8rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #434343;
  }

  p {
    margin-top: 0.4rem;
    font-size: 1.6rem;
    color: #5d5d5d;
  }
}

.admin-warehouse__tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.8rem;
}

.admin-warehouse__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 4.4rem;
  padding: 0 1.8rem;
  background: #fff;
  border: 0;
  border-radius: 1.2rem;
  color: #343434;
  font-size: 1.45rem;
  cursor: pointer;
}

.admin-warehouse__tab--active {
  background: $linear-green;
  color: #fff;
}

.admin-warehouse__top {
  display: grid;
  grid-template-columns: minmax(0, 1.42fr) minmax(34rem, 0.98fr);
  gap: 1.4rem;
  margin-bottom: 1.4rem;
}

.admin-warehouse__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-areas:
    'total total attention attention'
    'incoming moves capacity capacity'
    'review writeoff capacity capacity';
  grid-auto-rows: minmax(10.8rem, auto);
  gap: 1.4rem;
}

.admin-warehouse__card {
  min-height: 10.8rem;
}

.admin-warehouse__card--total {
  grid-area: total;
  min-height: 11.6rem;
}

.admin-warehouse__card--attention {
  grid-area: attention;
  min-height: 11.6rem;
}

.admin-warehouse__card--incoming {
  grid-area: incoming;
}

.admin-warehouse__card--moves {
  grid-area: moves;
}

.admin-warehouse__card--review {
  grid-area: review;
}

.admin-warehouse__card--writeoff {
  grid-area: writeoff;
}

.admin-panel {
  background: #fff;
  border-radius: 1.8rem;
}

.admin-warehouse__capacity {
  grid-area: capacity;
  padding: 1.5rem 1.6rem;

  h2 {
    margin-bottom: 1.6rem;
    font-size: 1.4rem;
    color: #4d4d4d;
    font-weight: 500;
  }
}

.admin-warehouse__capacity-list {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.admin-warehouse__capacity-row {
  display: grid;
  gap: 0.8rem;
}

.admin-warehouse__capacity-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.35rem;

  strong { color: #595959; font-weight: 500; }
  span { color: #909090; }
}

.admin-warehouse__capacity-track {
  height: 1rem;
  background: #eff4ef;
  border-radius: 999px;
  overflow: hidden;
}

.admin-warehouse__capacity-fill {
  height: 100%;
  border-radius: inherit;
}

.admin-warehouse__tasks-panel {
  padding: 1.5rem 1.8rem;

  h2 {
    margin-bottom: 1.6rem;
    font-size: 1.4rem;
    color: #4d4d4d;
    font-weight: 500;
  }
}

.admin-warehouse__tasks-list {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.admin-warehouse__task {
  display: grid;
  grid-template-columns: 1rem minmax(0, 1fr);
  align-items: flex-start;
  gap: 1rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid #f1f1f1;

  &:last-child { border-bottom: 0; padding-bottom: 0; }

  h3 { margin-bottom: 0.4rem; font-size: 1.45rem; font-weight: 500; color: #505050; }
  p { font-size: 1.32rem; color: #8c8c8c; line-height: 1.35; }
}

.admin-warehouse__task-dot {
  width: 1rem;
  height: 1rem;
  margin-top: 0.35rem;
  border-radius: 50%;
}

.admin-warehouse__task-dot--orange { background: #ff9f29; }
.admin-warehouse__task-dot--green { background: #18b536; }
.admin-warehouse__task-dot--gray { background: #bbbbbb; }

.admin-warehouse__section {
  display: grid;
  gap: 1.6rem;
}

.admin-warehouse__section-head {
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }
}

.admin-warehouse__form,
.admin-warehouse__list {
  padding: 2rem;
  background: #fff;
  border-radius: 1.8rem;
}

.admin-warehouse__form {
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #444;
    margin-bottom: 1.2rem;
  }
}

.admin-warehouse__form-row {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;

  label {
    display: grid;
    gap: 0.6rem;
  }

  span {
    font-size: 1.2rem;
    color: #8d8d8d;
  }

  input {
    height: 4.4rem;
    padding: 0 1.2rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1rem;
    font-size: 1.35rem;
    color: #444;
    min-width: 14rem;
  }
}

.admin-warehouse__primary {
  min-height: 4.4rem;
  padding: 0 1.8rem;
  background: $linear-green;
  border: 0;
  border-radius: 1.2rem;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.admin-warehouse__danger-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.4rem;
  padding: 0 1.2rem;
  background: #fff0f0;
  border: 0;
  border-radius: 0.8rem;
  color: #c62828;
  font-size: 1.25rem;
  cursor: pointer;
}

.admin-warehouse__result {
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  background: #e8f5e9;
  border-radius: 1rem;
  font-size: 1.35rem;
  color: #2e7d32;
}

.admin-warehouse__empty {
  text-align: center;
  padding: 3rem 1rem;
  color: #888;
  font-size: 1.4rem;
}

.admin-warehouse__list-head,
.admin-warehouse__list-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 1.5fr 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0.8rem;
  font-size: 1.35rem;
}

.admin-warehouse__list-head {
  color: #9a9a9a;
  border-bottom: 1px solid #eee;
}

.admin-warehouse__list-row {
  color: #4a4a4a;
  border-bottom: 1px solid #f5f5f5;
}

.admin-warehouse__racks {
  display: grid;
  gap: 1rem;
  margin-top: 1.2rem;
}

.admin-warehouse__rack-card {
  padding: 1.4rem;
  background: #fafafa;
  border-radius: 1.2rem;
}

.admin-warehouse__rack-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  strong { font-size: 1.45rem; color: #444; }
}

.admin-warehouse__rack-cells {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.admin-warehouse__cell-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0 1rem;
  background: #e8f5e9;
  border-radius: 999px;
  font-size: 1.2rem;
  color: #2e7d32;
  font-family: monospace;
}

.admin-warehouse__pp-list {
  display: grid;
  gap: 0.8rem;
}

.admin-warehouse__pp-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  background: #fafafa;
  border-radius: 1rem;

  strong { font-size: 1.4rem; color: #444; }
  span { font-size: 1.25rem; color: #888; }
}

@media (max-width: 1280px) {
  .admin-warehouse__top {
    grid-template-columns: 1fr;
  }

  .admin-warehouse__form-row {
    flex-direction: column;
  }
}
</style>
