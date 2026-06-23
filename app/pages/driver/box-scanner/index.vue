    <script setup>
    import { ref, computed } from 'vue'
    import { QrcodeStream } from 'vue-qrcode-reader'
    import boxDirectionToogler from '~/components/driver/boxDirectionToogler/ui/boxDirectionToogler.vue'

    definePageMeta({
      layout: 'without-header'
    })

    const api = useAPI()
    const isValid = ref(undefined)
    const paused = ref(false)
    const result = ref('')
    const routeId = ref('1')
    const scanResult = ref(null)

    const validationPending = computed(() => isValid.value === undefined && paused.value)
    const validationSuccess = computed(() => isValid.value === true)
    const validationFailure = computed(() => isValid.value === false)

    const onError = console.error
    const resetValidationState = () => { isValid.value = undefined }

    const onDetect = async ([firstDetectedCode]) => {
      const qr = firstDetectedCode.rawValue
      result.value = qr
      paused.value = true
      try {
        const data = await api('/api/warehouse/driver/scan', {
          method: 'POST',
          body: { qr_code: qr, route_id: Number(routeId.value) },
        })
        scanResult.value = data
        isValid.value = true
      } catch {
        isValid.value = false
      }
      await new Promise(r => setTimeout(r, 2000))
      paused.value = false
    }
</script>

<template>
  <div class="qr-scanner">

    <qrcode-stream class="hello" :paused="paused" @detect="onDetect" @error="onError" @camera-on="resetValidationState" >
    </qrcode-stream>
  </div>
  <div class="action-menu">
    <div class="quit-button">
      <NuxtLink to="/driver/pvz">
        <NuxtImg src="/driver/crossIcon.svg"></NuxtImg>
      </NuxtLink>
    </div>
    <div class="action-header">
      <div class="address">
        <span>{{ scanResult?.source || 'Склад' }} → {{ scanResult?.destination || 'ПВЗ' }}</span>
      </div>
      <div class="address" style="margin-top:0.5rem;">
        <label style="display:flex;gap:0.5rem;align-items:center;font-size:12px;color:#888;">
          Route ID:
          <input v-model="routeId" type="number" style="width:5rem;padding:0.3rem;border:1px solid #ddd;border-radius:0.4rem;">
        </label>
      </div>
    </div>
    <div class="action-info">
      <div class="info">
        <div class="info__scanned">
          <NuxtImg src="/driver/qrIcon.svg"></NuxtImg>
          <span>
            {{ scanResult ? `${scanResult.items_count} товаров` : '0' }}
          </span>
        </div>
        <div class="info__pvz">
          <span>{{ scanResult?.status || 'Ожидание' }}</span>
        </div>
      </div>
    </div>
    <div v-if="scanResult" class="action-info" style="padding-top:0;">
      <div class="info__scanned" style="background:#e8f5e9;color:#2e7d32;padding:1rem;border-radius:0.8rem;text-align:center;">
        Коробка {{ scanResult.qr_code }} привязана к маршруту
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quit-button {
  position: absolute;
  z-index:2325235235;
  padding: 1.7rem;
  background-color: #fff;
  border-radius: 30px;
  top: -62px;

  left: 2.4rem;
  img {
    width: 1.8rem;
  }
}
.action-info {
  padding: 2.4rem;

  .info {
    display: flex;
    gap: 2rem;

    .info__scanned {
      padding: 1.8rem 0 1.8rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $green;
      width: 100%;
      color: #fff;
      border-radius: 0.8rem;
      gap: 0.8rem;
      img {
        width: 2.4rem;
      }
      span {
        font-size: 14px;
      }
    }

    .info__pvz {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      background-color: #FF8800;
      color: #fff;
      border-radius: 0.8rem;

      span {
        font-size: 18px;
        font-weight: 200;
      }
    }
  }
}

.action-menu {
  position: absolute;
  z-index: 134134;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  border-radius: 1.6rem 1.6rem 0 0;
}

.action-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  padding: 2.4rem;
  border-bottom: 1px solid #EDEDED;

  .address {
    padding: 1.5rem;
    display: flex;
    justify-content: center;
    background-color: #EFEFEF;
    width: 100%;
    border-radius: 0.8rem;

    span {
      font-size: 12px;
    }
  }
}

.qr-scanner {
  height: 70vh;
}

.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  color: black;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}

.validation-success {
  color: green;
}

.validation-failure {
  color: red;
}
</style>