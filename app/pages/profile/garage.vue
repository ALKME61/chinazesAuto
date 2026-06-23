<script setup lang="ts">
import auth from '~/middleware/auth'
import { useGarageStore } from '~~/stores/garage'

definePageMeta({ middleware: auth })

const api = useAPI()
const garageStore = useGarageStore()

const showAddModal = ref(false)
const addVin = ref('')
const addBrand = ref('')
const addModel = ref('')
const addYear = ref<number | null>(null)
const addLoading = ref(false)
const addError = ref('')
const deletingId = ref<number | null>(null)
const selectedCarId = ref<number | null>(null)
const units = ref<any[]>([])
const unitsLoading = ref(false)
const selectedUnitId = ref<string | null>(null)
const parts = ref<any[]>([])
const partsLoading = ref(false)
const partCount = ref(0)
const partsImgError = ref(false)

const selectedCar = computed(() => garageStore.vehicles.find(v => v.id === selectedCarId.value))

async function selectCar(id: number) {
  if (selectedCarId.value === id) {
    selectedCarId.value = null
    units.value = []
    selectedUnitId.value = null
    parts.value = []
    return
  }
  selectedCarId.value = id
  selectedUnitId.value = null
  parts.value = []
  partsImgError.value = false
  unitsLoading.value = true
  try {
    const data: any = await api(`/api/garage/${id}/units`)
    units.value = (Array.isArray(data) ? data : data?.results || data?.units || [])
  } catch {
    units.value = []
  } finally {
    unitsLoading.value = false
  }
}

function unitAttr(unit: any, key: string): string {
  return unit.attributes?.find((a: any) => a.key === key)?.value || unit.attributes?.find((a: any) => a.name === key)?.value || ''
}

async function selectUnit(unitId: string) {
  if (selectedUnitId.value === unitId) { selectedUnitId.value = null; return }
  selectedUnitId.value = unitId
  partsLoading.value = true
  parts.value = []
  partsImgError.value = false
  try {
    const data: any = await api(`/api/garage/${selectedCarId.value}/units/${unitId}/parts`)
    parts.value = (Array.isArray(data) ? data : data?.parts || data?.results || [])
    partCount.value = data?.count || parts.value.length
  } catch {
    parts.value = []
  } finally {
    partsLoading.value = false
  }
}

function backToUnits() {
  selectedUnitId.value = null
  parts.value = []
}

function backToCars() {
  selectedCarId.value = null
  units.value = []
  backToUnits()
}

async function addCar() {
  if (!addVin.value.trim()) return
  addLoading.value = true
  addError.value = ''
  try {
    await garageStore.addVehicle({
      vin: addVin.value.trim(),
      brand: addBrand.value.trim() || undefined,
      model: addModel.value.trim() || undefined,
      year: addYear.value || undefined,
    })
    showAddModal.value = false
    addVin.value = ''
    addBrand.value = ''
    addModel.value = ''
    addYear.value = null
  } catch (e: any) {
    addError.value = e?.data?.message || e?.message || 'Ошибка добавления'
  } finally {
    addLoading.value = false
  }
}

async function confirmDelete(id: number) {
  deletingId.value = id
  await garageStore.removeVehicle(id)
  deletingId.value = null
}

onMounted(() => garageStore.fetchVehicles())
</script>

<template>
  <section class="garage-page">
    <div v-if="garageStore.isLoading" class="garage-page__skeleton">
      <div class="skeleton-card" />
      <div class="skeleton-card" />
    </div>
    <template v-else>
      <article class="garage-page__garage-card">
        <div v-for="car in garageStore.vehicles" :key="car.id" class="garage-page__car-card" :class="{ 'garage-page__car-card--selected': selectedCarId === car.id }" @click="selectCar(car.id)">
          <div class="garage-page__car-copy">
            <h2>{{ car.title || 'Автомобиль' }}</h2>
            <strong>{{ car.vin }}</strong>
            <span>VIN</span>
            <div class="garage-page__car-actions">
              <em v-if="car.is_primary">Основной</em>
              <button v-else type="button" class="garage-page__set-primary" @click.stop="garageStore.setPrimary(car.id)">Сделать основным</button>
              <button type="button" class="garage-page__delete" :disabled="deletingId === car.id" @click.stop="confirmDelete(car.id)">
                <NuxtImg src="/icons/delete.svg" alt="Удалить" width="16" height="16" />
              </button>
            </div>
          </div>
          <NuxtImg src="/AutoExample.png" :alt="car.title" />
        </div>

        <button type="button" class="garage-page__add-car" @click="showAddModal = true">
          <NuxtImg src="/icons/plus.svg" alt="" />
          <span>Добавить авто</span>
        </button>
      </article>

      <section v-if="selectedUnitId" class="garage-page__units">
        <div class="garage-page__units-header">
          <button type="button" class="garage-page__units-back" @click="backToUnits"><span>←</span> Назад к узлам</button>
          <h3>Детали: {{ units.find(u => u.unitId === selectedUnitId)?.name || selectedUnitId }}</h3>
        </div>
        <div v-if="partsLoading" class="garage-page__units-loading">Загрузка деталей...</div>
        <div v-else-if="!parts.length" class="garage-page__units-empty">Нет данных о деталях</div>
        <div v-else class="garage-page__parts-layout">
          <div class="garage-page__parts-list">
            <div class="garage-page__parts-count">Найдено: {{ partCount }}</div>
            <div v-for="(part, idx) in parts" :key="idx" class="part-card">
              <div class="part-card__info">
                <strong class="part-card__name">{{ part.name }}</strong>
                <span class="part-card__oem">OEM: <em>{{ part.oem }}</em></span>
                <span class="part-card__code">Поз. {{ part.codeOnImage }}</span>
                <p v-if="unitAttr(part, 'amount')" class="part-card__qty">{{ unitAttr(part, 'amount') }} шт.</p>
                <p v-if="unitAttr(part, 'note')" class="part-card__note">{{ unitAttr(part, 'note') }}</p>
              </div>
            </div>
          </div>
          <div class="garage-page__parts-image">
            <p class="garage-page__parts-image-label">Схема узла</p>
            <img v-show="!partsImgError"
              :src="`/api/image-proxy?url=${encodeURIComponent((units.find(u => u.unitId === selectedUnitId)?.largeImageUrl || '').replace('%size%', '600'))}`"
              alt="Схема"
              class="garage-page__parts-img"
              loading="lazy"
              @error="partsImgError = true"
            />
            <p v-if="partsImgError" class="garage-page__parts-img-fallback">Схема недоступна</p>
          </div>
        </div>
      </section>

      <section v-else-if="selectedCarId" class="garage-page__units">
        <div class="garage-page__units-header">
          <button type="button" class="garage-page__units-back" @click="backToCars"><span>←</span> Назад к автомобилям</button>
          <h3>Узлы: {{ selectedCar?.title || selectedCar?.vin }}</h3>
        </div>
        <div v-if="unitsLoading" class="garage-page__units-loading">Загрузка...</div>
        <div v-else-if="!units.length" class="garage-page__units-empty">Нет данных об узлах</div>
        <div v-else class="garage-page__units-grid">
          <div v-for="unit in units" :key="unit.unitId" class="unit-card" :class="{ 'unit-card--selected': selectedUnitId === unit.unitId }" @click="selectUnit(unit.unitId)">
            <div class="unit-card__image">
              <img v-if="unit.imageUrl" :src="`/api/image-proxy?url=${encodeURIComponent(unit.imageUrl.replace('%size%', '200'))}`" alt="" loading="lazy" />
            </div>
            <div class="unit-card__info">
              <strong class="unit-card__name">{{ unit.name }}</strong>
              <span class="unit-card__code">{{ unit.code }}</span>
              <p v-if="unitAttr(unit, 'note')" class="unit-card__note">{{ unitAttr(unit, 'note') }}</p>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="garage-page__hint">
        <p>Нажмите на автомобиль для просмотра узлов</p>
        <span>Выберите машину из списка выше</span>
      </section>
    </template>

    <Transition name="modal-fade">
      <div v-if="showAddModal" class="garage-page__backdrop" @click.self="showAddModal = false">
        <div class="garage-page__modal">
          <h2>Добавить автомобиль</h2>
          <form @submit.prevent="addCar">
            <label><span>VIN *</span><input v-model="addVin" type="text" placeholder="17 символов" required maxlength="17" /></label>
            <label><span>Марка</span><input v-model="addBrand" type="text" placeholder="Например: BMW" /></label>
            <label><span>Модель</span><input v-model="addModel" type="text" placeholder="Например: X5" /></label>
            <label><span>Год</span><input v-model="addYear" type="number" placeholder="Например: 2015" min="1900" max="2030" /></label>
            <p v-if="addError" class="garage-page__modal-error">{{ addError }}</p>
            <div class="garage-page__modal-actions">
              <button type="button" class="garage-page__modal-cancel" @click="showAddModal = false">Отмена</button>
              <button type="submit" class="garage-page__modal-submit" :disabled="addLoading || !addVin.trim()">{{ addLoading ? 'Добавление...' : 'Добавить' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.garage-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.garage-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.skeleton-card {
  height: 16rem;
  background: #e8e8e8;
  border-radius: 2.4rem;
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.garage-page__garage-card,
.garage-page__categories {
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.garage-page__garage-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.8rem;
}

.garage-page__car-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  padding: 1.8rem;
  background: #fafafa;
  border-radius: 2rem;
  overflow: visible;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  img {
    width: min(15rem, 44%);
    margin-top: -2.2rem;
    object-fit: contain;
    transition: transform 0.2s ease;
    pointer-events: none;
  }

  &:hover {
    background: #f2f2f2;
    img { transform: scale(1.04); }
  }

  &--selected {
    box-shadow: 0 0 0 2px $green;
    background: #edf8f0;
  }
}

.garage-page__car-copy {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  pointer-events: none;

  h2 { color: #2d2d2d; font-size: 1.8rem; font-weight: 700; }
  strong { color: #2d2d2d; font-size: 1.6rem; font-weight: 500; }
  span { color: #a0a0a0; font-size: 1.3rem; }
}

.garage-page__car-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.4rem;
  pointer-events: auto;

  em {
    display: inline-flex;
    width: fit-content;
    padding: 0.4rem 1.2rem;
    border-radius: 999px;
    background: #d8f8e0;
    color: $green;
    font-style: normal;
    font-size: 1.25rem;
  }
}

.garage-page__set-primary {
  padding: 0.4rem 1rem;
  border: 1px solid $green;
  border-radius: 999px;
  background: transparent;
  color: $green;
  font-size: 1.15rem;
  cursor: pointer;
  white-space: nowrap;
}

.garage-page__delete {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s;
  &:hover { opacity: 1; }
  &:disabled { opacity: 0.2; cursor: not-allowed; }
}

.garage-page__add-car {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: 0;
  border-radius: 2rem;
  background: transparent;
  color: #7b7b7b;
  font-size: 1.7rem;
  cursor: pointer;
  img { width: 2.4rem; }
}

.garage-page__units-header {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  margin-bottom: 1.6rem;

  h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.garage-page__units-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
  background: #fff;
  color: #555;
  font-size: 1.4rem;
  cursor: pointer;
  white-space: nowrap;

  span { font-size: 1.6rem; }
}

.garage-page__units-loading,
.garage-page__units-empty {
  padding: 3rem 0;
  text-align: center;
  color: #999;
  font-size: 1.5rem;
}

.garage-page__units {
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.garage-page__units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 1.6rem;
}

.unit-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.6rem;
  background: #fafafa;
  border-radius: 1.8rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;

  &:hover { background: #f2f2f2; }

  &--selected {
    background: #edf8f0;
    box-shadow: 0 0 0 2px $green;
  }
}

.unit-card__image {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  background: #fff;
  border-radius: 1.2rem;

  img { object-fit: contain; }
}

.unit-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.unit-card__name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.unit-card__code {
  font-size: 1.2rem;
  color: #999;
}

.unit-card__note {
  font-size: 1.3rem;
  color: #777;
  margin: 0.4rem 0 0;
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: break-word;
}

.garage-page__parts-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.garage-page__parts-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.garage-page__parts-count {
  color: #838383;
  font-size: 1.3rem;
}

.garage-page__parts-image {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: #fafafa;
  border-radius: 1.6rem;
  padding: 1.6rem;
}

.garage-page__parts-image-label {
  margin: 0;
  font-size: 1.3rem;
  color: #999;
  align-self: flex-start;
}

.garage-page__parts-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  background: #fff;
  border-radius: 1.2rem;
}

.garage-page__parts-img-fallback {
  color: #999;
  font-size: 1.3rem;
  text-align: center;
  padding: 4rem 0;
}

.part-card {
  display: flex;
  gap: 1.6rem;
  padding: 1.6rem;
  background: #fafafa;
  border-radius: 1.4rem;
  transition: background 0.2s;

  &:hover { background: #f2f2f2; }
}

.part-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.part-card__name {
  font-size: 1.45rem;
  font-weight: 600;
  color: #333;
}

.part-card__oem {
  font-size: 1.2rem;
  color: #888;

  em {
    font-style: normal;
    color: #10ae3b;
    font-weight: 600;
  }
}

.part-card__code {
  font-size: 1.1rem;
  color: #aaa;
}

.part-card__qty {
  font-size: 1.3rem;
  color: $green;
  font-weight: 500;
  margin: 0.2rem 0 0;
}

.part-card__note {
  font-size: 1.1rem;
  color: #888;
  margin: 0.2rem 0 0;
  line-height: 1.4;
  word-break: break-word;
  overflow-wrap: break-word;
}

.garage-page__hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  min-height: 16rem;
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);

  p {
    color: #888;
    font-size: 1.7rem;
    font-weight: 500;
    margin: 0;
  }

  span {
    color: #aaa;
    font-size: 1.3rem;
  }
}

.garage-page__backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(17, 17, 17, 0.48);
}

.garage-page__modal {
  width: min(42rem, 100%);
  padding: 2.8rem;
  background: #fff;
  border-radius: 2.4rem;

  h2 { font-size: 2.2rem; font-weight: 700; color: #333; margin-bottom: 2rem; }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.4rem;

    span { font-size: 1.3rem; color: #777; }
    input { width: 100%; min-height: 4.6rem; padding: 0 1.4rem; border: 1px solid #e0e0e0; border-radius: 1.2rem; font-size: 1.5rem; }
  }
}

.garage-page__modal-error { color: #c62828; font-size: 1.3rem; margin: 0 0 1rem; }

.garage-page__modal-actions {
  display: flex;
  gap: 1.2rem;
  margin-top: 1rem;
}

.garage-page__modal-cancel {
  flex: 1;
  min-height: 4.8rem;
  border: 1px solid #ddd;
  border-radius: 1.2rem;
  background: #fff;
  color: #555;
  font-size: 1.5rem;
  cursor: pointer;
}

.garage-page__modal-submit {
  flex: 1;
  min-height: 4.8rem;
  border: 0;
  border-radius: 1.2rem;
  background: $linear-green;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 991px) {
  .garage-page__garage-card { grid-template-columns: 1fr; }
  .garage-page__units-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 767px) {
  .garage-page { gap: 0.8rem; }
  .garage-page__garage-card, .garage-page__units, .garage-page__hint { padding: 1.6rem; border-radius: 2rem; }
  .garage-page__garage-card { gap: 1rem; }
  .garage-page__car-card { padding: 1.2rem 1.4rem; border-radius: 1.8rem; img { width: min(12rem, 42%); margin-top: 0; } }
  .garage-page__car-copy h2 { font-size: 1.5rem; }
  .garage-page__car-copy strong { font-size: 1.4rem; }
  .garage-page__add-car { min-height: 12rem; background: #fafafa; border-radius: 1.8rem; box-shadow: none; }
  .garage-page__units-grid { grid-template-columns: 1fr; }
  .garage-page__parts-layout { grid-template-columns: 1fr; }
  .part-card { flex-direction: column; }
}
</style>
