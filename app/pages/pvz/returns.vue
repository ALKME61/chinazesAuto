<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'
import PvzProductCard from '~/components/pvz/PvzProductCard.vue'

definePageMeta({
  layout: 'pvz',
  pvzSidebar: [
    { label: 'От клиента', to: '/pvz/returns', icon: 'return' },
    { label: 'Поставщику', to: '/pvz/returns?mode=supplier', icon: 'truck' },
    { label: 'Перемещение', to: '/pvz/returns?mode=move', icon: 'cell' },
  ],
})

const route = useRoute()
const mode = computed(() => {
  if (route.query.mode === 'supplier') {
    return 'supplier'
  }

  if (route.query.mode === 'move') {
    return 'move'
  }

  return 'client'
})
</script>

<template>
  <section class="pvz-page">
    <div class="pvz-page__heading">
      <h1>Возвраты и перемещения</h1>
      <p>Оставляем только реальные сценарии: возврат клиентом в ПВЗ, возврат поставщику и внутреннее перемещение на склад/другой ПВЗ.</p>
    </div>

    <div class="pvz-page__grid">
      <section class="pvz-page__workspace">
        <div class="pvz-page__workspace-head">
          <div>
            <h2 v-if="mode === 'client'">Возврат от клиента</h2>
            <h2 v-else-if="mode === 'supplier'">Возврат поставщику</h2>
            <h2 v-else>Внутреннее перемещение</h2>
            <p>Причина, состояние товара, фотофиксация и чек-лист — всё в одном сценарии.</p>
          </div>
        </div>

        <div class="pvz-page__return-layout">
          <PvzProductCard
            cell="R-04"
            code="CH-RET-0091"
            title="Аккумулятор HomeBoy / GS353234"
            subtitle="Клиент: Сергей Волков · заказ от 02.04"
            :badge="mode === 'move' ? 'Перемещение' : 'Возврат'"
            :badge-tone="mode === 'move' ? 'warning' : 'danger'"
          />

          <div class="pvz-page__form">
            <label>
              <span>Причина</span>
              <select>
                <option>Не подошёл товар</option>
                <option>Повреждение</option>
                <option>Не тот товар</option>
              </select>
            </label>

            <label>
              <span>Состояние товара</span>
              <select>
                <option>Упаковка целая, товар принят</option>
                <option>Есть следы вскрытия</option>
                <option>Повреждение до приёмки</option>
              </select>
            </label>

            <label class="pvz-page__wide">
              <span>Комментарий оператора</span>
              <textarea placeholder="Коротко описываем, что увидел оператор и почему принято решение"></textarea>
            </label>

            <div class="pvz-page__photo">
              <div>
                <PvzIcon name="camera" :size="22" />
                <span>Фотофиксация</span>
              </div>
              <small>В реальной логике сюда ляжет загрузка фото товара и упаковки.</small>
            </div>

            <div class="pvz-page__checklist">
              <label><input type="checkbox"> Товар осмотрен оператором</label>
              <label><input type="checkbox"> Упаковка проверена</label>
              <label><input type="checkbox"> Причина возврата зафиксирована</label>
            </div>
          </div>
        </div>
      </section>

      <aside class="pvz-page__panel">
        <div class="pvz-page__panel-head">
          <h2>Дальнейшее движение</h2>
          <span>Зависит от сценария</span>
        </div>

        <div class="pvz-page__action-stack">
          <button type="button" class="pvz-page__primary">Подтвердить сценарий</button>
          <button v-if="mode !== 'supplier'" type="button" class="pvz-page__secondary">Отправить на склад</button>
          <button type="button" class="pvz-page__secondary">Отправить на другой ПВЗ</button>
          <button v-if="mode !== 'move'" type="button" class="pvz-page__secondary">Вернуть поставщику</button>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pvz-page {
  display: grid;
  gap: 2rem;
}

.pvz-page__heading {
  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #353535;
  }

  p {
    margin-top: 0.8rem;
    max-width: 78rem;
    font-size: 1.45rem;
    line-height: 1.55;
    color: #757575;
  }
}

.pvz-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 30rem;
  gap: 2rem;
}

.pvz-page__workspace,
.pvz-page__panel {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 18px 40px rgba(20, 24, 26, 0.04);
}

.pvz-page__workspace-head,
.pvz-page__panel-head {
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }

  p,
  span {
    margin-top: 0.4rem;
    font-size: 1.35rem;
    line-height: 1.45;
    color: #8b8b8b;
  }
}

.pvz-page__return-layout {
  display: grid;
  grid-template-columns: 32rem minmax(0, 1fr);
  gap: 1.8rem;
  margin-top: 1.8rem;
}

.pvz-page__form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.2rem;

  label {
    display: grid;
    gap: 0.7rem;
  }

  span {
    font-size: 1.25rem;
    color: #8d8d8d;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0 1.4rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    color: #444;
  }

  select,
  input {
    height: 4.8rem;
  }

  textarea {
    min-height: 12rem;
    padding-top: 1.3rem;
    resize: vertical;
  }
}

.pvz-page__wide {
  grid-column: 1 / -1;
}

.pvz-page__photo {
  display: grid;
  gap: 0.8rem;
  padding: 1.4rem;
  background: #f7fbf7;
  border: 1px dashed rgba(24, 181, 54, 0.3);
  border-radius: 1.4rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #18b536;
  }

  small {
    font-size: 1.25rem;
    line-height: 1.45;
    color: #7d907f;
  }
}

.pvz-page__checklist {
  display: grid;
  gap: 0.8rem;
  align-content: start;
  padding: 1.4rem;
  background: #fbfbfb;
  border-radius: 1.4rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.3rem;
    color: #5f5f5f;
  }
}

.pvz-page__action-stack {
  display: grid;
  gap: 1rem;
  margin-top: 1.6rem;
}

.pvz-page__primary,
.pvz-page__secondary {
  min-height: 5rem;
  border: 0;
  border-radius: 1.3rem;
  font-size: 1.4rem;
  cursor: pointer;
}

.pvz-page__primary {
  background: $linear-green;
  color: #fff;
}

.pvz-page__secondary {
  background: #f5f9f5;
  color: #18b536;
}

@media (max-width: 1380px) {
  .pvz-page__grid,
  .pvz-page__return-layout,
  .pvz-page__form {
    grid-template-columns: 1fr;
  }
}
</style>
