<script setup>

</script>
<template>
  <div class="garage-wrapper">
    <div class="garage">
      <div class="car">
        <NuxtImg src="/autoExample.png" />
        <div class="car__info">
          <h2 class="car__name">
            BMW IV (E39) 540i
          </h2>
          <div class="vin">
            <p class="vin__vin-code">
              WAUXSBBJ69LO0432
            </p>
            <p class="vin__p">
              VIN
            </p>
          </div>
          <div class="car__button-active">
            Выбрано
          </div>
        </div>
      </div>
      <div class="car">
        <NuxtImg src="/autoExample.png" />
        <div class="car__info">
          <h2 class="car__name">
            BMW IV (E39) 540i
          </h2>
          <div class="vin">
            <p class="vin__vin-code">
              WAUXSBBJ69LO0432
            </p>
            <p class="vin__p">
              VIN
            </p>
          </div>
          <div class="car__button-disabled">
            Выбрано
          </div>
        </div>
      </div>
      <div class="add-car-active">
        <NuxtImg src="/icons/plus.svg" />
        <p class="add-car__p">
          Добавить авто
        </p>
      </div>
    </div>
    <div class="categories">
      <div class="categoryBlock__wrapper">
        <h1>Подбор по авто</h1>
        <div class="categoryBlock__categories">
          <div class="categories__popular">
            <div>
              <NuxtLink to="/" class="categoryBlock-card">
                <NuxtImg format="webp" src="/Categories/filters.png" alt="Оригинальный каталог" />
                <p>Автомобильные фильтры</p>
              </NuxtLink>
            </div>
            <div>
              <NuxtLink to="/" class="categoryBlock-card">
                <NuxtImg format="webp" src="/Categories/brakePads.png" alt="Запчасти для ТО" />

                <p>Колодки тормозные</p>
              </NuxtLink>
            </div>
          </div>
          <div class="categories__other-stuff">
            <div>
              <NuxtLink class="categoryBlock-card">
                <NuxtImg format="webp" src="/Categories/carOil.png" alt="Аксессуары" />

                <p>Жидкости в авто</p>
              </NuxtLink>
            </div>
            <div>
              <NuxtLink class="categoryBlock-card">
                <NuxtImg format="webp" src="/Categories/ignitionSparks.png" alt="Шины и диски" />

                <p>Свечи зажигания</p>
              </NuxtLink>
            </div>
            <div>
              <NuxtLink class="categoryBlock-card">
                <NuxtImg format="webp" src="/Categories/wiperBlades.png" alt="Аккумуляторы" />

                <p>Щётки стеклоочистителя</p>
              </NuxtLink>
            </div>
            <div>
              <NuxtLink class="categoryBlock-card">
                <NuxtImg format="webp" src="/Categories/other.png" alt="Автохимия" />

                <p>Прочее</p>
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.garage-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.add-car-active {

  display: flex;
  flex-direction: column;

  img {
    width: 2vw
  }

  .add-car__p {
    font-size: $font-size-p;
    color: $gray-text;
    font-weight: 400;
  }

  justify-content: center;
  align-items: center;
}

.garage {
  width: 100%;
  height: 260px;
  border-radius: $radius-md;
  background-color: #fff;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;

  .car {
    img {
      width: 12vw;
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;

    .car__name {
      font-size: $font-size-p;
      font-weight: 600;
    }

    .car__info {
      font-size: $font-size-sm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: $spacing-sm;

      .vin {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .vin__p {
          font-size: 1.4rem;
          color: $gray-text;
          font-weight: 200;
        }
      }

      .car__button-active {
        padding-left: $spacing-lg;
        padding-right: $spacing-lg;
        padding-top: $spacing-xs;
        padding-bottom: $spacing-xs;
        background-color: #C4F6D0;
        color: $green;
        border-radius: $radius-xl;
        font-size: $font-size-sm;
        font-weight: 300;
      }

      .car__button-disabled {
        display: none;
      }
    }
  }
}

.categoryBlock__wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  background-color: $white;
  width: 100%;
  margin: 0 auto;
  border-radius: $radius-xl;
  padding: $spacing-xl;
}

.categoryBlock__categories {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-2xl;

  .most a {
    text-decoration: none;
    transition-duration: 0.2s;
  }

  a:hover {
    background-color: #ececec;
    transition-duration: 0.2s;

    img {
      width: 130px;
      transition-duration: 0.2s;
      top: -40px;
    }
  }

  .categories__popular {
    text-decoration: none;
    display: grid;
    grid-template-columns: 2fr 2fr;
    gap: $spacing-2xl;

    a {
      text-decoration: none;
    }
  }

  .categories__other-stuff {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-2xl;
  }
}

.categoryBlock-card {
  position: relative;
  background-color: $gray-light;
  display: flex;
  align-items: end;
  justify-content: center;
  padding-bottom: $spacing-lg;
  width: 100%;
  height: 140px;
  border-radius: $radius-lg;

  img {
    position: absolute;
    top: -30px;
    width: 120px;
    transition-duration: 0.2s;
  }

  p {
    font-size: $font-size-body;
    color: $gray-text;
  }
}

.categories {
  margin-bottom: 20%;
}
</style>