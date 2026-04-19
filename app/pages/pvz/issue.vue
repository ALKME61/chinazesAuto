<script setup lang="ts">
import PvzIcon from '~/components/pvz/PvzIcon.vue'
import PvzProductCard from '~/components/pvz/PvzProductCard.vue'
import PvzScanHero from '~/components/pvz/PvzScanHero.vue'

definePageMeta({
  layout: 'pvz',
  pvzSidebar: [
    { label: 'QR-код клиента', to: '/pvz/issue', icon: 'qr' },
    { label: '4 цифры + SMS', to: '/pvz/issue?mode=sms', icon: 'sms' },
  ],
})

const route = useRoute()
const mode = computed(() => (route.query.mode === 'sms' ? 'sms' : 'qr'))

const orders = [
  {
    cell: 'A-12',
    code: 'CH-4451 0044',
    title: 'Аккумулятор HomeBoy / GS353234',
    quantity: '2 места',
    subtitle: 'Пользователь: Иван Петров · хранение до 12.04',
  },
  {
    cell: 'A-13',
    code: 'CH-4451 0045',
    title: 'Аккумулятор HomeBoy / GS353235',
    quantity: '1 место',    
    subtitle: 'Пользователь: Иван Петров · хранение до 12.04',
  },
] as const
</script>

<template>
  <section class="pvz-page">
    <div class="pvz-page__grid">
      <PvzScanHero
        :title="mode === 'qr' ? 'Отсканируйте QR-код клиента' : 'Введите 4 последние цифры телефона'"
        :subtitle="mode === 'qr'
          ? ''
          : 'Попросите код у клиента'"
      >
        <div v-if="mode === 'qr'" class="pvz-page__hero-actions">
          <NuxtLink class="pvz-page__hero-link" to="/pvz/issue?mode=sms">Нет QR-кода? перейти к SMS</NuxtLink>
        </div>

        <div v-else class="pvz-page__sms-form">
          <label>
            <span>4 последние цифры</span>
            <input type="text" maxlength="4" placeholder="4 последние цифры">
          </label>
          <label>
            <span>SMS-код</span>
            <input type="text" maxlength="6" placeholder="Подтверждение">
          </label>
          <div class="pvz-page__sms-actions">
            <button type="button">Отправить код</button>
            <button type="button" class="pvz-page__button--ghost">Подтвердить</button>
          </div>
        </div>
      </PvzScanHero>
    </div>

    <section class="pvz-page__workspace">
      <div class="pvz-page__workspace-head">
        <div>
          <h2>Заказы пользователя</h2>
          <p>После подтверждения можно выдать сразу все места одного пользователя.</p>
        </div>

        <div class="pvz-page__summary">
          <span>Пользователь</span>
          <strong>Иван Петров</strong>
        </div>
      </div>

      <div class="pvz-page__issue-layout">
        <aside class="pvz-page__issue-sidebar">
          <div class="pvz-page__metric">
            <span>Основная ячейка</span>
            <strong>A-12</strong>
          </div>

          <div class="pvz-page__metric">
            <span>Количество мест</span>
            <strong>3</strong>
          </div>

          <div class="pvz-page__metric">
            <span>Срок хранения</span>
            <strong>До 12.04</strong>
          </div>

          <button type="button" class="pvz-page__primary">Выдать все места</button>
        </aside>

        <div class="pvz-page__products">
          <PvzProductCard
            v-for="item in orders"
            :key="item.code"
            :cell="item.cell"
            :code="item.code"
            :quantity="item.quantity"
            :title="item.title"
            :subtitle="item.subtitle"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.pvz-page {
  display: grid;
  gap: 2rem;
}

.pvz-page__grid {
  display: grid;
  grid-template-columns: minmax(34rem, 40rem) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
}

.pvz-page__panel,
.pvz-page__workspace {
  padding: 2rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 18px 40px rgba(20, 24, 26, 0.04);
}

.pvz-page__panel--compact {
  padding: 1.8rem 2rem;
}

.pvz-page__panel-head,
.pvz-page__workspace-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

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

.pvz-page__operator-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
  margin-top: 1.8rem;

  article {
    padding: 1.5rem;
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 1.6rem;
  }

  strong {
    display: block;
    margin-bottom: 0.8rem;
    font-size: 1.45rem;
    color: #393939;
  }

  p {
    font-size: 1.3rem;
    line-height: 1.5;
    color: #757575;
  }
}

.pvz-page__note {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
  padding: 1.2rem 1.4rem;
  background: #f6fbf7;
  border-radius: 1.4rem;
  color: #5f8e68;

  span {
    font-size: 1.28rem;
    line-height: 1.45;
  }
}

.pvz-page__hero-actions {
  display: flex;
  justify-content: center;
}

.pvz-page__hero-link {
  font-size: 1.35rem;
  color: #18b536;
  text-decoration: none;
}

.pvz-page__sms-form {
  display: grid;
  gap: 1.2rem;
  width: 100%;
  margin-top: 0.8rem;

  label {
    display: grid;
    gap: 0.6rem;
    text-align: left;
  }

  span {
    font-size: 1.2rem;
    color: #8b8b8b;
  }

  input {
    width: 100%;
    height: 4.8rem;
    padding: 0 1.4rem;
    background: #fafafa;
    border: 1px solid #ececec;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    color: #444;
  }
}

.pvz-page__sms-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  button {
    min-height: 4.8rem;
    border: 0;
    border-radius: 1.2rem;
    background: $linear-green;
    font-size: 1.35rem;
    color: #fff;
    cursor: pointer;
  }
}

.pvz-page__button--ghost {
  background: #f2f7f3 !important;
  color: #18b536 !important;
}

.pvz-page__summary {
  text-align: right;

  strong {
    display: block;
    font-size: 1.75rem;
    color: #393939;
  }
}

.pvz-page__issue-layout {
  display: grid;
  grid-template-columns: 22rem minmax(0, 1fr);
  gap: 1.8rem;
  margin-top: 1.8rem;
}

.pvz-page__issue-sidebar {
  display: grid;
  align-content: start;
  gap: 1rem;
}

.pvz-page__metric {
  padding: 1.4rem;
  background: #f8f8f8;
  border-radius: 1.6rem;

  span {
    display: block;
    font-size: 1.25rem;
    color: #8e8e8e;
  }

  strong {
    display: block;
    margin-top: 0.8rem;
    font-size: 2rem;
    color: #333;
  }
}

.pvz-page__primary {
  min-height: 5.4rem;
  background: $linear-green;
  border: 0;
  border-radius: 1.4rem;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
}

.pvz-page__products {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.6rem;
}

.pvz-page__checklist {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.4rem;
  padding-left: 1.8rem;

  li {
    font-size: 1.35rem;
    line-height: 1.45;
    color: #616161;
  }
}

@media (max-width: 1360px) {
  .pvz-page__grid,
  .pvz-page__issue-layout,
  .pvz-page__products,
  .pvz-page__operator-grid {
    grid-template-columns: 1fr;
  }
}
</style>
