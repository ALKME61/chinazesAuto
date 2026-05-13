<script setup>

</script>
<template>
  <div class="row-links">
    <NuxtLink to="/driver/pvz">
      <div class="link">
        <div class="link__button pvz-link">
          <div class="button-img-centered">
            <NuxtImg src="/icons/pvzBlurredIcon.png" format="webp" />
          </div>
        </div>
        <p class="pvz-link__header">ПВЗ</p>
      </div>
    </NuxtLink>

    <NuxtLink to="/driver/boxes">
      <div class="link">
        <div class="link__button boxes-link">
          <div class="button-img-centered">
            <NuxtImg src="/icons/boxesBlurredIcon.png" format="webp" />
          </div>
        </div>
        <p class="pvz-link__header">Коробки</p>
      </div>
    </NuxtLink>
  </div>
  <div class="link">
    <div class="link__button-whole-row boxes-link">
      <div class="button-img-centered">
        <NuxtImg src="/icons/returnBlurredIcon.png" format="webp" />
      </div>
    </div>
    <p class="pvz-link__header">Возврат</p>
  </div>
</template>


<style scoped lang="scss">
.row-links {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.link {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  justify-content: center;
  align-items: center;

  p {
    font-size: 1.6rem;
    color: #3A3A3A;
  }
}

.link__button-whole-row {
  display: flex;
  justify-content: center;
  height: 5rem;
  border-radius: 1.2rem;
  width: 100%;

  img {
    position: absolute;
    top: -1rem;
    left: 1.6rem;
    width: 7rem;
  }
}

.button-img-centered {
  position: relative;
  width: 9rem;
}

.link__button {
  display: flex;
  justify-content: center;
  height: 5rem;
  border-radius: 1.2rem;
  width: 100%;

  img {
    position: absolute;
    top: -1rem;
    width: 9rem;
  }
}

.pvz-link {
  background-color: $orange;
}

.boxes-link {
  background-color: $green;
}
</style>