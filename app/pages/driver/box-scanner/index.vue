    <script setup>
    import { ref, computed } from 'vue'
    import { QrcodeStream } from 'vue-qrcode-reader'
    import boxDirectionToogler from '~/components/driver/boxDirectionToogler/ui/boxDirectionToogler.vue'

    definePageMeta({
      layout: 'without-header'
    })

    const isValid = ref(undefined)
    const paused = ref(false)
    const result = ref(null)

    const validationPending = computed(() => {
      return isValid.value === undefined && paused.value
    })

    const validationSuccess = computed(() => {
      return isValid.value === true
    })

    const validationFailure = computed(() => {
      return isValid.value === false
    })

    const onError = console.error

    const resetValidationState = () => {
      isValid.value = undefined
    }

    const timeout = (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    }

    const onDetect = async ([firstDetectedCode]) => {
      result.value = firstDetectedCode.rawValue
      console.log('QR-код = ' + firstDetectedCode.rawValue)
      paused.value = true

      // pretend it's taking really long
      await timeout(3000)
      isValid.value = result.value.startsWith('http')

      // some more delay, so users have time to read the message
      await timeout(2000)
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
        <span>г. Ростов-на-дону, ул. Пушкинская 5</span>
      </div>
      <boxDirectionToogler />
    </div>
    <div class="action-info">
      <div class="info">
        <div class="info__scanned">
          <NuxtImg src="/driver/qrIcon.svg"></NuxtImg>
          <span>
            1/3
          </span>
        </div>
        <div class="info__pvz">
          <span>ПВЗ №1</span>
        </div>
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