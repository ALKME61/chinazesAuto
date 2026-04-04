<template>
    <header class="header">
        <div class="header__content">
            <div class="header__content_leftPart">
                <NuxtLink to="/" title="На главную">
                    <NuxtImg src="/icons/logo/ChinazesAutoLogo.svg" alt="Логотип Чиназес-авто" />
                </NuxtLink>
                <button class="header__catalog-button" aria-label="Каталог">
                    <NuxtImg id="burgerIcon" src="/icons/burger.svg" alt="" />
                    Каталог
                </button>
                    <search></search>
            </div>
            <div class="header__content_rightPart">
                <nav class="header__content_rightPart-nav">
                    <ul>
                        <li>
                            <NuxtLink to="/cart" title="Перейти в корзину">
                                <NuxtImg src="/icons/Cart.svg" alt="Иконка корзины" />
                                Корзина
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/profile/orders" title="Просмотреть заказы">
                                <NuxtImg src="/icons/Orders.svg" alt="Иконка заказов" />
                                Заказы
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/profile/garage" title="Перейти в гараж">
                                <NuxtImg src="/icons/Garage.svg" alt="Иконка гаража" />
                                Гараж
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/auth/login" title="Войти в личный кабинет">
                                <NuxtImg src="/icons/Login.svg" alt="Иконка входа" />
                                Войти
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="header__info">
            <div class="header__contact">
                <a href="#" title="Наши специалисты помогут вам в подобре запчастей">Помощь специалиста</a>
                <a href="#" title="Информация для клиентов">Информация для клиентов</a>
            </div>
            <div class="header__pvz">
                <a href="tel:+71234567890">+7 (123) 456-78-90</a>
                <div class="header__pvz-address">
                    <NuxtImg src="/icons/geo-pvz.svg" alt="иконка гео-пвз" />
                    <p>Адреса ПВЗ</p>
                </div>
            </div>
        </div>
    </header>

    <div style="margin-bottom: 48px;">
        <slot />
    </div>
    <footer>
        <div class="footer-content">
            <nav class="footer-content__nav">
                <h2 class="footer-content__header">
                    ПРОФИЛЬ
                </h2>
                <div class="footer-content__links">
                    <NuxtLink>Личный кабинет</NuxtLink>
                    <NuxtLink>Заказы</NuxtLink>
                    <NuxtLink>Корзина</NuxtLink>
                    <NuxtLink>Гараж</NuxtLink>
                    <NuxtLink>Баланс</NuxtLink>
                </div>
                <div class="copyraiting">
                    <NuxtImg class="copyraiting__logo" alt="Лого Чиназес-авто" src="/icons/logo/ChinazesAutoLogo.svg" />
                    <h1 class="copyraiting__header">©ЧиназесАвто 2026</h1>
                    <p class="copyraiting__all-rules">Все права защищены</p>
                </div>
            </nav>
            <nav class="footer-content__nav">
                <h2 class="footer-content__header">
                    ПОИСК ЗАПЧАСТИ
                </h2>
                <div class="footer-content__links">
                    <NuxtLink to="/catalogs/TO">Запчасти для ТО</NuxtLink>
                    <NuxtLink>Поиск по VIN</NuxtLink>
                </div>
            </nav>
            <nav class="footer-content__nav">
                <h2 class="footer-content__header">
                    НАВИГАЦИЯ
                </h2>
                <div class="footer-content__links">
                    <NuxtLink to="/catalogs/original">Оригинальный каталог</NuxtLink>
                    <NuxtLink>Шины и диски</NuxtLink>
                    <NuxtLink>Запчасти для ТО</NuxtLink>
                    <NuxtLink>Аксессуары</NuxtLink>
                    <NuxtLink>АКБ</NuxtLink>
                    <NuxtLink>Автохимия</NuxtLink>
                    <NuxtLink>Масла и техжидкости</NuxtLink>
                    <NuxtLink>Инструменты</NuxtLink>
                </div>
            </nav>
            <nav class="footer-content__nav">
                <h2 class="footer-content__header">
                    ПРАВА
                </h2>
                <div class="footer-content__links">
                    <NuxtLink>Запчасти для ТО</NuxtLink>
                    <NuxtLink>Поиск по VIN</NuxtLink>
                </div>
            </nav>
            <nav class="footer-content__nav">
                <h2 class="footer-content__header">
                    ПРИСОЕДИНЯЙТЕСЬ
                </h2>
                <div class="footer-content__soc-media">
                    <NuxtImg src="/icons/socialMedia/vkIcon.svg" alt="Наша вк группа" />
                    <NuxtImg src="/icons/socialMedia/telegramIcon.svg" alt="Наш канал в телеграмме" />
                </div>
                <h2 class="footer-content__header">
                    ПОМОЩЬ И ДОП. ИНФОРМАЦИЯ
                </h2>
                <div class="contacts__wrapper">
                    <div class="contacts">
                        <NuxtImg alt="Иконка телефона" class="contacts__img" src="/icons/phone.svg" />
                        <a href="tel:+71234567890" class="contacts__content">+7 (123) 456-78-90 - Помощь с подбором</a>
                    </div>
                    <div class="contacts">
                        <NuxtImg alt="Иконка телефона" class="contacts__img" src="/icons/phone.svg" />
                        <a href="tel:+71234567890" class="contacts__content">+7
                            +7 (123) 456-78-90  - Жалобы и предложения
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    </footer>
</template>

<style lang="scss" scoped>

//footer
.contacts__wrapper {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
}
.contacts {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    .contacts__img {
        width:2.2rem;
    }
    .contacts__content {
        color: #fff;
        font-size: $font-size-p;
        text-decoration: none;
    }
}

.copyraiting {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    img {
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 8px;
        padding-bottom: 8px;
        width: 100%;
        max-width: 400px;
        background-color: #fff;
        border-radius: $radius-md;
    }

    h1,
    p {
        color: #fff;
    }

    h4 {
        font-size: $font-size-p;
        font-weight: $font-weight-normal;
    }

    p {
        font-size: $font-size-p;
        color: #B7B7B7;
    }
}

footer {
    background-color: #1C1E20;
    width: 100%;
    padding-top: 48px;
    padding-bottom: 48px;

    .footer-content {
        width: 75vw;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;

        .footer-content__nav {
            display: flex;
            flex-direction: column;
            gap: 3.2rem;
            .footer-content__header {
                font-size: 1.8rem;
                color: #fff;
            }

            .footer-content__links {
                display: flex;
                flex-direction: column;
                gap: $spacing-md;
                color: #B7B7B7;
                font-size: $font-size-p;
                text-decoration: none;
                a:visited {
                    color: #B7B7B7;
                }
            }

            .footer-content__soc-media {
                display: flex;
                gap: $spacing-md;

                img {
                    width: 40px;
                }
            }
        }
    }
}

//header
#burgerIcon {
    width: 2.5rem;
}

.header__content_rightPart-nav {
    display: flex;

    ul {
        display: flex;
        gap: 2.4rem;

        li {

            a {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 1.4rem;
                font-weight: 400;
                color: #616060;
                text-decoration: none;
            }

            img {
                width: 2.2rem
            }
        }
    }
}

.header__content_leftPart {
    height: $header-height;
    display: flex;
    gap: 2.2rem;
    flex: 1;
    text-decoration: none;

    a {
        img {
            height: 100%;
        }
    }
}

.header__content {
    padding-top: 2rem;
    display: flex;
    background-clip: content-box;
    align-items: center;
    justify-content: space-between;
    gap: 2.2rem;
    padding-left: 4.8rem;
    padding-right: 4.8rem;
}

.header__search-input {
    background-color: #F3F3F3;
    font-size: 1.6rem;
    font-weight: 300;
    height: 100%;
    padding: 0;
    padding-left: 2.4rem;
    padding-right: 8rem;
    max-width: 610px;
    border-radius: 1.2rem;
    width: 100%;
    color: #646464;
}

.header__search-button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 4px;
    right: 4px;
    background-color: $green;
    height: $header-height - 8px;
    width: 7rem;
    border-radius: 0.8rem;
    z-index: 11;
    cursor: pointer;
}

.header {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    gap: 2.2rem;
    border-radius: 20px;
    width: 75vw;
    margin: 0 auto;
    margin-bottom: 24px;
}


.header__catalog-button {
    cursor: pointer;
    background: $linear-green;
    color: #fff;
    font-size: 1.8rem;

    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding-left: 1.4rem;
    padding-right: 2rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-radius: 1.2rem;
}

.header__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 44px;
    padding-right: 44px;

    .header__contact {
        display: flex;
        gap: 3.2rem;
    }

    a {
        font-size: 1.3rem;
        text-decoration: none;
        color: #323232;
        font-weight: 300;
    }

    padding-bottom: 1.8rem;
}

.header__pvz {
    display: flex;
    align-items: center;

    a {
        font-size: 1.4rem;
    }

    gap: 2.2rem;
}

.header__pvz-address {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    color: #FF8800;
    font-weight: 300;
}
</style>