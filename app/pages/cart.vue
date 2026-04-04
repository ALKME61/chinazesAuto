<script setup>

</script>
<template>
  <div class="cart-wrapper">
    <h1>Корзина</h1>
    <div class="cart-workflow">
      <div class="products">
        <div class="product">
          <NuxtImg class="product__img" src="/productExample.png" />
          <div class="product__content">
            <div class="product__name-quantity">
              <div class="product__name">
                <h1 class="product__header">Аккумулятор Hiki-Lo</h1>
                <p class="product__category">АКБ</p>
              </div>
              <div class="product__quantity">
                <NuxtImg src="/icons/minus.svg" />
                <span>1</span>
                <NuxtImg src="/icons/plus.svg" />
              </div>
            </div>
            <div class="product__price-interaction">
              <div class="product__interaction">
                <NuxtImg src="/icons/delete.svg" />
                <NuxtImg src="/icons/checkbox.svg" />
              </div>
              <div class="product__price">
                <h2>12399₽</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="order">
        <h2>Условия заказа</h2>
        <div class="order__content">
          <div class="order__quantity-sum">
            <div class="order__quantity">
              <p>Итого:</p>
              <h2>1 товар</h2>
            </div>
            <div class="order__sum">
              <p>Сумма:</p>
              <h2>12899₽</h2>
            </div>
          </div>
          <div class="order__balance">
            <p>Баланс на аккаунте</p>
            <h2>13000₽</h2>
          </div>
          <div class="order__address-submit">
            <div class="order__address">
              <NuxtImg src="/icons/geo-pvz.svg" />
              <p>ул. Пушкинская 8</p>
            </div>
            <div class="order__submit">
              <div class="submit__button">
                <button>Оформить заказ</button>
              </div>
              <div class="submit__under-text">
                Сумма заказа вычтется из баланса
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<style scoped lang="scss">
.cart-wrapper {
  width: $content-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-2xl;
  margin-bottom: 20%;
  h1{
    color: #333333;
    font-size: $font-size-h2;
  }
  .cart-workflow {
    display: flex;
    gap: $spacing-xl;

    .order {

      background-color: #fff;
      padding: $spacing-xl;
      border-radius: $radius-xl;
      display: flex;
      flex-direction: column;
      gap: $spacing-3xl;
      width: 27%;
      max-width: 400px;

      h2 {
        font-size: 1.8rem;
      }

      .order__content {
        display: flex;
        flex-direction: column;
        gap: $spacing-3xl;

        h2 {
          font-size: $font-size-pp;
        }

        p {
          color: #6B6B6B;
          font-size: $font-size-sm;
          font-weight: 200;
        }

        .order__quantity-sum {
          display: flex;
          justify-content: space-between;

          .order__quantity {}

          .order__sum {}
        }

        .order__address-submit {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          gap: $spacing-md;
          .order__address {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: center;
            gap: $spacing-md;
            background-color: #FFECD6;
            padding-left: $spacing-xl;
            padding-right: $spacing-xl;
            padding-top: $spacing-md;
            padding-bottom: $spacing-md;
            border-radius: $radius-md;
            height:4.8rem;

            p {
              font-size: 1.4rem;
              color: #FF8800;
              font-weight: normal;
            }

            img {
              width: 2.2rem;
            }
          }
          .order__address:hover {
            cursor: pointer;
          }
          .order__submit {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: $spacing-sm;
            button {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: $spacing-sm;
              background-color: #10AE3B;
              padding-left: $spacing-xl;
              padding-right: $spacing-xl;
              padding-top: $spacing-md;
              padding-bottom: $spacing-md;
              border-radius: $radius-md;
              font-size: $font-size-p;
              width: 100%;
              height: 4.8rem;
              color: #fff
            }
            button:hover {
              cursor: pointer;
            }
          }
          .submit__under-text {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: #6B6B6B;
            font-weight: 300;
          }
        }
      }
    }

    .products {
      flex: 1;

      .product {
        background-color: #fff;
        padding: $spacing-md;
        padding-right: 30px;
        border-radius: $radius-xl;
        display: flex;
        gap: $spacing-2xl;
        align-items: center;

        .product__img {
          width: 100px;
          padding: $spacing-md;
          background-color: #F8F8F8;
          border-radius: $radius-md;
        }

        .product__content {
          display: flex;
          justify-content: space-between;
          width: 100%;

          .product__name-quantity {
            display: flex;
            flex-direction: column;
            gap: $spacing-sm;

            .product__name {
              .product__header {
                font-size: $font-size-p;
                font-weight: $font-weight-normal;
                color: #333333;
              }

              .product__category {
                font-size: $font-size-p - 0.2rem;
                color: #737373;
                font-weight: 200;
              }
            }

            .product__quantity {
              width: fit-content;
              padding: $spacing-sm - 3px;
              padding-left: $spacing-sm;
              padding-right: $spacing-sm;
              background-color: #fff;
              border: #DBDBDB 1px solid;
              border-radius: $radius-md;
              display: flex;
              gap: $spacing-lg;

              span {
                font-size: $font-size-p;
              }

              img {
                width: 16px;
              }

              img:hover {
                cursor: pointer;
              }
            }
          }

          .product__price-interaction {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .product__price {
              h2 {
                font-size: $font-size-p;
                font-weight: 700;
                color: #333333;
              }
            }

            .product__interaction {
              display: flex;
              justify-content: space-between;

              img {
                width: 22px;
              }

              img:hover {
                cursor: pointer
              }
            }
          }
        }
      }
    }

  }
}
</style>