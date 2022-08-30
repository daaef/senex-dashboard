<template>
  <div>
    <div class="checkout checkout--no-min-height u-secondary-text-color">
      <div class="secret-key">
        <h3 class="img-box u-mb-40">
          <img class="img" src="/img/icon-expired.svg" />
        </h3>
        <h3 class="secret-key__title heading-primary u-mb-40">
          ORDER LIMIT EXCEEDED
        </h3>
        <div class="secret-key__body">
          <p class="paragraph content u-mb-40">
            Only approved accounts can purchase this amount. To continue this
            trade, click below to complete KYC in a few minutes.
          </p>
          <div class="checkout__btn-box checkout__btn-box--wrap-sm">
            <div class="checkout__btn checkout__btn--eq">
              <ButtonSpinner
                :value="backBtn().value"
                :background="backBtn().background"
                :color="backBtn().color"
                :is-in-active="backBtn().isInActive"
                :on-submit="
                  () => {
                    this.backBtn().onSubmit()
                  }
                "
              />
            </div>
            <div class="checkout__btn checkout__btn--eq">
              <ButtonSpinner
                :value="continueBtn().value"
                :background="continueBtn().background"
                :color="continueBtn().color"
                :is-in-active="continueBtn().isInActive"
                :on-submit="
                  () => {
                    this.continueBtn().onSubmit()
                  }
                "
              />
            </div>
          </div>
          <!-- <CheckoutButtonSet :left="backBtn()" :right="continueBtn()" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
import {
  COOKIE_SAVED_CHECKOUT,
  COOKIE_SAVED_ORDER,
  COOKIE_SAVED_ORDER_REVIEW_BENEF,
  COOKIE_SAVED_RATE_OBJECT,
} from '~/data/constants'
export default {
  methods: {
    continueBtn() {
      return {
        ...continueBtn,
        isInActive: false,
        value: 'Continue to KYC',
        //isLoading: this.processing,
        onSubmit: () => {
          this.terminateSession()
          this.$router.push('/profile')
        },
      }
    },
    backBtn() {
      return {
        ...backBtn,
        isInActive: false,
        value: 'Create new trade',
        onSubmit: () => {
          this.terminateSession()
          this.$router.push('/order/start')
        },
      }
    },
    terminateSession() {
      this.$cookiz.remove(COOKIE_SAVED_ORDER)
      this.$cookiz.remove(COOKIE_SAVED_RATE_OBJECT)
      this.$cookiz.remove(COOKIE_SAVED_CHECKOUT)
      this.$cookiz.remove(COOKIE_SAVED_ORDER_REVIEW_BENEF)
    },
  },
}
</script>

<style scoped>
.content {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.img-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>
