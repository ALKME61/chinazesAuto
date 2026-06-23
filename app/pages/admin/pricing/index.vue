<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const api = useAPI()
const loading = ref(true)
const rules = ref<any[]>([])
const showForm = ref(false)
const editing = ref<any | null>(null)
const calcResult = ref<any | null>(null)
const calcPrice = ref('')
const calcPtId = ref('')
const calcBrand = ref('')

const levelLabels: Record<string, string> = {
  base: 'На всё',
  category: 'На категорию',
  brand: 'На бренд',
  supplier: 'На поставщика',
  article: 'На артикул',
}

const levelColors: Record<string, string> = {
  base: '#9e9e9e',
  category: '#ff8800',
  brand: '#1565c0',
  supplier: '#7b1fa2',
  article: '#2e7d32',
}

async function loadRules() {
  loading.value = true
  try {
    const data: any = await api('/api/pricing/rules')
    rules.value = data?.results || []
  } catch { rules.value = [] }
  finally { loading.value = false }
}

async function deleteRule(id: number) {
  if (!confirm('Удалить правило?')) return
  try {
    await api(`/api/pricing/rules/${id}`, { method: 'DELETE' })
    await loadRules()
  } catch { alert('Ошибка удаления') }
}

async function toggleActive(rule: any) {
  try {
    await api(`/api/pricing/rules/${rule.id}`, {
      method: 'PATCH',
      body: { is_active: !rule.is_active },
    })
    rule.is_active = !rule.is_active
  } catch { alert('Ошибка') }
}

async function saveRule() {
  try {
    if (editing.value.id) {
      await api(`/api/pricing/rules/${editing.value.id}`, {
        method: 'PATCH',
        body: editing.value,
      })
    } else {
      await api('/api/pricing/rules', {
        method: 'POST',
        body: editing.value,
      })
    }
    showForm.value = false
    editing.value = null
    await loadRules()
  } catch { alert('Ошибка сохранения') }
}

function openCreate() {
  editing.value = { level: 'base', target_name: '', markup_percent: '', stack: false, round_to: null, is_active: true }
  showForm.value = true
}

function openEdit(rule: any) {
  editing.value = { ...rule }
  showForm.value = true
}

async function calcTest() {
  try {
    const params = new URLSearchParams()
    if (calcPrice.value) params.set('price', calcPrice.value)
    if (calcPtId.value) params.set('pt_id', calcPtId.value)
    if (calcBrand.value) params.set('brand', calcBrand.value)
    const data: any = await api(`/api/pricing/calc?${params.toString()}`)
    calcResult.value = data
  } catch { calcResult.value = null }
}

onMounted(loadRules)
</script>

<template>
  <section class="admin-pricing">
    <div class="admin-pricing__heading">
      <h1>Правила наценок</h1>
      <button type="button" class="admin-pricing__add-btn" @click="openCreate()">+ Создать правило</button>
    </div>

    <div v-if="loading" class="admin-pricing__loading">Загрузка...</div>

    <div v-else class="admin-pricing__layout">
      <div class="admin-pricing__main">
        <div v-if="!rules.length" class="admin-pricing__empty">Нет правил наценок</div>
        <div v-else class="admin-pricing__list">
          <div v-for="rule in rules" :key="rule.id" class="admin-pricing__rule" :class="{ 'admin-pricing__rule--inactive': !rule.is_active }">
            <div class="admin-pricing__rule-head">
              <span class="admin-pricing__level-badge" :style="{ background: levelColors[rule.level] || '#999' }">{{ levelLabels[rule.level] || rule.level }}</span>
              <strong class="admin-pricing__rule-name">{{ rule.target_name }}</strong>
              <span class="admin-pricing__rule-pct">{{ rule.markup_percent }}%</span>
              <span v-if="rule.stack" class="admin-pricing__rule-stack">Stack</span>
              <span v-if="rule.round_to" class="admin-pricing__rule-round">≈{{ rule.round_to }}</span>
              <span v-if="rule.date_from" class="admin-pricing__rule-dates">{{ rule.date_from }} – {{ rule.date_to || '∞' }}</span>
            </div>
            <div class="admin-pricing__rule-actions">
              <button type="button" class="admin-pricing__action" :class="rule.is_active ? 'admin-pricing__action--warn' : 'admin-pricing__action--ok'" @click="toggleActive(rule)">{{ rule.is_active ? 'Выкл' : 'Вкл' }}</button>
              <button type="button" class="admin-pricing__action" @click="openEdit(rule)">Ред</button>
              <button type="button" class="admin-pricing__action admin-pricing__action--danger" @click="deleteRule(rule.id)">Удал</button>
            </div>
          </div>
        </div>
      </div>

      <aside class="admin-pricing__sidebar">
        <section class="admin-pricing__panel">
          <h2>Тестовый расчёт</h2>
          <div class="admin-pricing__calc-form">
            <label>Цена <input v-model="calcPrice" type="number" placeholder="1247" /></label>
            <label>pt_id <input v-model="calcPtId" type="number" placeholder="82" /></label>
            <label>Бренд <input v-model="calcBrand" type="text" placeholder="BOSCH" /></label>
            <button type="button" class="admin-pricing__calc-btn" @click="calcTest()">Рассчитать</button>
          </div>
          <div v-if="calcResult" class="admin-pricing__calc-result">
            <div class="admin-pricing__calc-row">
              <span>Базовая цена</span>
              <strong>{{ calcResult.base_price }}₽</strong>
            </div>
            <div class="admin-pricing__calc-row">
              <span>Наценка</span>
              <strong>+{{ calcResult.markup_percent }}%</strong>
            </div>
            <div class="admin-pricing__calc-row admin-pricing__calc-row--total">
              <span>Итоговая цена</span>
              <strong>{{ calcResult.final_price }}₽</strong>
            </div>
            <div v-if="calcResult.rules?.length" class="admin-pricing__calc-rules">
              <span class="admin-pricing__calc-rules-title">Применённые правила:</span>
              <div v-for="r in calcResult.rules" :key="r.id" class="admin-pricing__calc-rule">
                <span>{{ r.name }}</span>
                <span>+{{ r.markup }}%</span>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <!-- Form modal -->
    <Teleport to="body">
      <div v-if="showForm && editing" class="admin-pricing__overlay" @click.self="showForm = false">
        <div class="admin-pricing__modal">
          <h2>{{ editing.id ? 'Редактировать правило' : 'Создать правило' }}</h2>
          <div class="admin-pricing__form">
            <label>Уровень
              <select v-model="editing.level">
                <option value="base">На всё (base)</option>
                <option value="category">На категорию (category)</option>
                <option value="brand">На бренд (brand)</option>
                <option value="supplier">На поставщика (supplier)</option>
                <option value="article">На артикул (article)</option>
              </select>
            </label>
            <label>Название <input v-model="editing.target_name" type="text" /></label>
            <label v-if="editing.level === 'category' || editing.level === 'article'">ID цели <input v-model="editing.target_id" type="number" /></label>
            <label>Наценка % <input v-model="editing.markup_percent" type="text" placeholder="25.00" /></label>
            <label class="admin-pricing__checkbox-label">
              <input v-model="editing.stack" type="checkbox" />
              <span>Суммировать (stack)</span>
            </label>
            <label>Округление до <input v-model="editing.round_to" type="number" placeholder="10" /></label>
            <label>Дата с <input v-model="editing.date_from" type="date" /></label>
            <label>Дата по <input v-model="editing.date_to" type="date" /></label>
          </div>
          <div class="admin-pricing__form-actions">
            <button type="button" class="admin-pricing__btn admin-pricing__btn--save" @click="saveRule()">Сохранить</button>
            <button type="button" class="admin-pricing__btn" @click="showForm = false">Отмена</button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped lang="scss">
.admin-pricing { padding: 0 0 2.4rem; }

.admin-pricing__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  margin-bottom: 1.8rem;
  h1 { font-size: 3rem; font-weight: 700; color: #434343; }
}

.admin-pricing__add-btn {
  min-height: 4rem;
  padding: 0 2rem;
  border: 0;
  border-radius: 1rem;
  background: $linear-green;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
}

.admin-pricing__loading { text-align: center; padding: 4rem; color: #999; font-size: 1.6rem; }
.admin-pricing__empty { text-align: center; padding: 4rem; color: #bbb; font-size: 1.5rem; }

.admin-pricing__layout {
  display: grid;
  grid-template-columns: 1fr 32rem;
  gap: 1.6rem;
  align-items: start;
}

.admin-pricing__main { display: flex; flex-direction: column; gap: 0.8rem; }

.admin-pricing__list { display: flex; flex-direction: column; gap: 0.6rem; }

.admin-pricing__rule {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.6rem;
  background: #fff;
  border-radius: 1.4rem;
  transition: opacity 0.2s;
  &--inactive { opacity: 0.5; }
}

.admin-pricing__rule-head {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  min-width: 0;
}

.admin-pricing__level-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 0.6rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
}

.admin-pricing__rule-name { font-size: 1.5rem; color: #333; font-weight: 500; }
.admin-pricing__rule-pct { font-size: 1.6rem; font-weight: 700; color: $green; }
.admin-pricing__rule-stack { padding: 0.1rem 0.4rem; background: #fff3e0; border-radius: 0.4rem; font-size: 1rem; color: #e65100; font-weight: 600; }
.admin-pricing__rule-round { padding: 0.1rem 0.4rem; background: #e3f2fd; border-radius: 0.4rem; font-size: 1rem; color: #1565c0; }
.admin-pricing__rule-dates { font-size: 1.15rem; color: #888; }

.admin-pricing__rule-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }

.admin-pricing__action {
  padding: 0.3rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 0.6rem;
  background: #fff;
  font-size: 1.1rem;
  color: #555;
  cursor: pointer;
  &:hover { border-color: $green; color: $green; }
  &--warn { color: #e65100; border-color: #ffcc80; &:hover { background: #fff3e0; } }
  &--ok { color: $green; border-color: #a5d6a7; &:hover { background: #e8f5e9; } }
  &--danger { color: #c62828; border-color: #ef9a9a; &:hover { background: #ffebee; } }
}

/* Sidebar */
.admin-pricing__sidebar { }

.admin-pricing__panel {
  padding: 1.6rem;
  background: #fff;
  border-radius: 1.8rem;
  h2 { font-size: 1.5rem; font-weight: 600; color: #4d4d4d; margin-bottom: 1.2rem; }
}

.admin-pricing__calc-form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 1.2rem;
    color: #888;
  }
  input {
    min-height: 3.6rem;
    padding: 0 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.8rem;
    font-size: 1.4rem;
  }
}

.admin-pricing__calc-btn {
  min-height: 3.6rem;
  border: 0;
  border-radius: 0.8rem;
  background: $linear-green;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.4rem;
}

.admin-pricing__calc-result {
  margin-top: 1.4rem;
  padding-top: 1.2rem;
  border-top: 1px solid #eee;
}

.admin-pricing__calc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  font-size: 1.3rem;
  color: #666;
  strong { color: #333; }
  &--total {
    margin-top: 0.4rem;
    padding-top: 0.6rem;
    border-top: 1px solid #eee;
    font-size: 1.5rem;
    font-weight: 700;
    strong { color: $green; font-size: 1.8rem; }
  }
}

.admin-pricing__calc-rules {
  margin-top: 1rem;
}

.admin-pricing__calc-rules-title { display: block; font-size: 1.1rem; color: #999; margin-bottom: 0.4rem; }

.admin-pricing__calc-rule {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0;
  font-size: 1.2rem;
  color: #555;
}

/* Modal */
.admin-pricing__overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
}

.admin-pricing__modal {
  width: min(48rem, 90vw);
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.4rem;
  background: #fff;
  border-radius: 2rem;
  h2 { font-size: 2rem; font-weight: 700; color: #333; margin-bottom: 1.6rem; }
}

.admin-pricing__form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 1.3rem;
    color: #666;
  }
  select, input {
    min-height: 4rem;
    padding: 0 1.2rem;
    border: 1px solid #e0e0e0;
    border-radius: 0.8rem;
    font-size: 1.4rem;
    background: #fff;
  }
}

.admin-pricing__checkbox-label {
  flex-direction: row !important;
  align-items: center;
  gap: 0.8rem !important;
  cursor: pointer;
  input { width: 1.8rem; height: 1.8rem; min-height: auto; }
}

.admin-pricing__form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.6rem;
}

.admin-pricing__btn {
  flex: 1;
  min-height: 4.4rem;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
  background: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  &--save { border: 0; background: $linear-green; color: #fff; font-weight: 600; }
}

@media(max-width: 1100px) {
  .admin-pricing__layout { grid-template-columns: 1fr; }
}
</style>
