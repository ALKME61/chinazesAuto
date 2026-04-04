<script setup lang="ts">

</script>

<template>
    <div class="car-search">
        <CarSearch></CarSearch>
    </div>
    <div class="categories">
        <div class="categoryBlock__wrapper">
            <h1>Каталоги для ТО</h1>
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
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.car-search {
    width: $content-width;
    margin: 0 auto;
    margin-bottom: $spacing-lg;
}

.categoryBlock__wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    background-color: $white;
    width: $content-width;
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
        a{
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