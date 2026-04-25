<script setup>
import Button from '~/components/shared/ui/Button/ui/Button.vue';
</script>
<template>
    <section class="home-guide card-section">
        <div class="home-guide__copy">
            <h2>Как сделать свой первый заказ?</h2>
            <p>
                Видеоинструкция для новых клиентов, расскажем о том, как создать аккаунт, выбрать нужный товар и
                оформить свой первый заказ
            </p>
        </div>

        <div class="home-guide__actions">
            <Button type="button" class="home-guide__button" background="white">
                <NuxtImg src="/icons/playIcon.svg" alt="" />
                <span>Посмотреть инструкцию</span>
            </Button>

            <div class="home-guide__meta">
                <span>
                    <NuxtImg src="/icons/timeDurationIcon.svg" alt="" />
                    4:32 минуты
                </span>
                <span>
                    <NuxtImg src="/icons/eyeIcon.svg" alt="" />
                    4232 просмотра
                </span>
            </div>
        </div>
    </section>
</template>


<style scoped lang="scss">
.card-section {
    padding: 3.2rem;
    background: #fff;
    border-radius: 2.8rem;
    box-shadow: 0 20px 50px rgba(28, 30, 32, 0.05);
}

.home-guide__copy {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;

    h2 {
        font-size: clamp(2.8rem, 2.4vw, 3.8rem);
        font-weight: 800;
    }

    p {
        max-width: 52rem;
        font-size: 1.8rem;
        line-height: 1.5;
    }
}

.home-guide {
    display: flex;
    flex-direction: column;
    gap: 2.8rem;
    width: min(72rem, 100%);
    color: #fff;
    background: $linear-green;
}

.home-guide__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: center;
}

.home-guide__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    align-items: center;

    span {
        display: inline-flex;
        align-items: center;
        gap: 0.8rem;
        font-size: 1.55rem;

        img {
            width: 2rem;
        }
    }
}

.home-guide__button {
    width: 50%;
}

@media (max-width: 767px) {
    .home-guide {
        width: 100%;
        padding: 2.4rem 1.6rem;
        gap: 2rem;
    }

    .home-guide__copy {
        h2 {
            font-size: 1.7rem;
        }

        p {
            font-size: 1.4rem;
        }
    }

    .home-guide__button {
        width: 100%;
        min-height: 5.4rem;
        border-radius: 1.4rem;
        font-size: 1.55rem;
    }

    .home-guide__meta {
        justify-content: space-between;
        width: 100%;

        span {
            font-size: 1.2rem;
        }
    }
}
</style>
