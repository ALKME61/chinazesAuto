<template>
  <section class="profile-home">
    <article class="profile-home__card profile-home__card--account">
      <header class="profile-home__account-head">
        <div class="profile-home__user">
          <div class="profile-home__avatar">П</div>
          <div>
            <h2>Пользователь И.</h2>
          </div>
        </div>

        <button type="button" class="profile-home__ghost-action">
          <NuxtImg src="/icons/Orders.svg" alt="" />
        </button>
      </header>

      <div class="profile-home__rows">
        <div class="profile-home__row">
          <span>Почта</span>
          <div>
            <strong>exa***@***mple.com</strong>
            <button type="button">Изменить почту</button>
          </div>
        </div>

        <div class="profile-home__row">
          <span>Пароль</span>
          <div>
            <strong>*********</strong>
            <button type="button">Изменить пароль</button>
          </div>
        </div>

        <div class="profile-home__row">
          <span>Баланс</span>
          <div>
            <strong>14400₽</strong>
            <button type="button">Пополнить</button>
          </div>
        </div>
      </div>
    </article>

    <article class="profile-home__card profile-home__card--pickup">
      <header class="profile-home__pickup-head">
        <div class="profile-home__pickup-title">
          <NuxtImg src="/icons/pvzIcon.svg" alt="" />
          <h3>Привязанный пункт выдачи</h3>
        </div>

        <div class="profile-home__pickup-address">
          <NuxtImg src="/icons/geo-pvz.svg" alt="" />
          <span>ул. Аловаха, 2</span>
        </div>
      </header>

      <div class="profile-home__map">
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Afbae429f9c8065d1d457e2a10ecf0cc8997fc7d6971796c640d4643163a698ef&amp;source=constructor"
          title="Карта ПВЗ"
          loading="lazy"
        />
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.profile-home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-home__card {
  padding: 2.4rem;
  background: #fff;
  border-radius: 2.4rem;
  box-shadow: 0 16px 38px rgba(28, 30, 32, 0.05);
}

.profile-home__account-head,
.profile-home__pickup-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.6rem;
}

.profile-home__user {
  display: flex;
  align-items: center;
  gap: 1.4rem;

  h2 {
    color: #2d2d2d;
    font-size: 2rem;
    font-weight: 600;
  }
}

.profile-home__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5.4rem;
  height: 5.4rem;
  border-radius: 1.4rem;
  background: #d8d8d8;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
}

.profile-home__ghost-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border: 0;
  border-radius: 1.2rem;
  background: #f5f5f5;

  img {
    width: 2rem;
  }
}

.profile-home__rows {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  margin-top: 2rem;
}

.profile-home__row {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  span {
    color: #9a9a9a;
    font-size: 1.35rem;
  }

  div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1.2rem;
  }

  strong {
    color: #2c2c2c;
    font-size: 2rem;
    font-weight: 500;
  }

  button {
    border: 0;
    background: transparent;
    color: $green;
    font-size: 1.5rem;
  }
}

.profile-home__pickup-head {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.profile-home__pickup-title,
.profile-home__pickup-address {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-home__pickup-title h3 {
  color: #2c2c2c;
  font-size: 1.9rem;
  font-weight: 600;
}

.profile-home__pickup-address {
  color: #4c4c4c;
  font-size: 1.55rem;

  img {
    width: 1.8rem;
  }
}

.profile-home__map {
  margin-top: 1.6rem;
  overflow: hidden;
  border-radius: 1.8rem;

  iframe {
    width: 100%;
    height: 28rem;
    border: 0;
  }
}

@media (max-width: 767px) {
  .profile-home {
    gap: 1.6rem;
  }

  .profile-home__card {
    padding: 1.8rem 1.4rem;
    border-radius: 2rem;
  }

  .profile-home__user h2 {
    font-size: 1.8rem;
  }

  .profile-home__avatar {
    width: 4.4rem;
    height: 4.4rem;
    border-radius: 1.2rem;
    font-size: 1.8rem;
  }

  .profile-home__row strong {
    font-size: 1.6rem;
  }

  .profile-home__row button {
    font-size: 1.4rem;
  }

  .profile-home__map iframe {
    height: 21rem;
  }
}
</style>
