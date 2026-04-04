<template>
    <div class="profile-info">
        <div class="profile-info__data">
            <div class="profile-username">
                <div class="profile-username__icon">
                    <span>П</span>
                </div>
                <div class="profile-username__name">Пользователь П.</div>

            </div>
            <div class="profile-data">
                <div class="profile-data__name">
                    Почта
                </div>
                <div class="profile-data__data">
                    <p class="profile-data__main">ex***@***.com</p>
                    <button class="profile-data__action">Изменить</button>
                </div>
            </div>
            <div class="profile-data">
                <div class="profile-data__name">
                    Пароль
                </div>
                <div class="profile-data__data">
                    <p class="profile-data__main">*********</p>
                    <button class="profile-data__action">Изменить</button>
                </div>
            </div>
            <div class="profile-data">
                <div class="profile-data__name">
                    Баланс
                </div>
                <div class="profile-data__data">
                    <p class="profile-data__main">13000₽</p>
                    <button class="profile-data__action">Пополнить</button>
                </div>
            </div>
            <div class="profile-info__exit">
                Выйти из аккаунта
            </div>
        </div>
    </div>
    <div class="profile-pvz">
        <div class="pvz-header">
            <div class="pvz-header__content">
                <NuxtImg src="/icons/pvzIcon.svg" />
                <span class="content__header">Привязанный пункт выдачи</span>
            </div>
            <div class="pvz-header__content">
                <NuxtImg src="/icons/geo-pvz.svg" />
                <span class="content__address">г. Артëмовск, ул. Свиридова 6</span>
            </div>
        </div>
        <div class="pvz-map">
            <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3Afbae429f9c8065d1d457e2a10ecf0cc8997fc7d6971796c640d4643163a698ef&amp;source=constructor"
                width="530" height="270" frameborder="0"></iframe>
        </div>
    </div>
</template>

<style scoped lang="scss">
.profile-pvz {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    background-color: #fff;
    border-radius: $radius-md;
    padding: 20px;
    height: 350px;

    .pvz-header {
        display: flex;
        gap: $spacing-lg;

        .pvz-header__content {
            display: flex;
            gap: $spacing-sm;

            .content__header {
                font-size: $font-size-p;
            }

            .content__address {
                font-size: $font-size-sm;
                color: $orange;
            }

            img {
                width: 24px;
            }
        }
    }
}

.profile-data {
    display: flex;
    flex-direction: column;

    .profile-data__name {
        color: $gray-text;
        font-size: $font-size-sm;
    }

    .profile-data__data {
        display: flex;
        justify-content: space-between;

        .profile-data__main {
            font-size: $font-size-p;
        }

        .profile-data__action {
            background-color: #fff;
            color: $green;
            font-size: $font-size-sm;
        }

        .profile-data__action:hover {
            cursor: pointer;
        }
    }
}


.content {
    .profile-info {
        height: 350px;
        background-color: #fff;
        border-radius: $radius-md;
        padding: 20px;
        width: 100%;

        .profile-info__exit {
            color: #DD3030;
            font-size: $font-size-sm;

        }

        .profile-info__data {
            display: flex;
            flex-direction: column;
            gap: $spacing-md;

            .profile-username {
                display: flex;
                align-items: center;
                gap: $spacing-md;

                .profile-username__icon {
                    background-color: #DAD9D9;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                    font-weight: 600;
                    font-size: 2rem;
                    line-height: 0;
                    border-radius: $radius-sm;
                }

                .profile-username__name {
                    font-size: $font-size-p;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>