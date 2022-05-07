<template>
  <div class="checkout checkout--no-min-height">
    <div class="checkout__body">
      <div class="checkout__modal">
        <h3 class="heading-secondary u-mb-mini-medium u-mt-small">
          Secret Key
        </h3>
        <p class="paragraph u-text-left u-mb-10">
          Please enter your secret key
        </p>
        <div class="o-form__input-box">
          <input
            name="password"
            v-model="password"
            :type="passwordLocked"
            class="o-form__input"
          />
          <img
            :src="[
              passwordLocked !== 'password'
                ? '/img/eye-on.svg'
                : '/img/eye-off.svg',
            ]"
            alt="eye"
            class="o-form__input-eye"
            @click="togglePassword"
          />
        </div>
        <p class="paragraph error-text u-text-left u-mb-mini-medium">
          This key is incorrect. Please check and try again.
        </p>
        <div class="checkout__btn-box wallet-btn-box u-mb-mini-medium">
          <div class="checkout__btn checkout__btn--sm">
            <ButtonSpinner
              value="Cancel"
              :background="backBtn.background"
              :color="backBtn.color"
            />
          </div>
          <div class="checkout__btn">
            <ButtonSpinner
              value="Verify key"
              :background="continueBtn.background"
              :color="continueBtn.color"
              :is-loading="this.processing"
              :on-submit="
                () => {
                  this.onContinue()
                }
              "
            />
          </div>
        </div>
        <p class="paragraph">
          <span class="resend-color">Resend</span> <span>code</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'

export default {
  props: {
    processing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      password: '',
      passwordLocked: 'password',
      backBtn: backBtn,
      continueBtn: continueBtn,
    }
  },
  methods: {
    togglePassword() {
      this.passwordLocked =
        this.passwordLocked === 'password' ? 'text' : 'password'
    },
    onContinue() {
      // this.$emit('update:processing', true)
      // this.$emit('placeOrder')
      this.$emit('controlModal', false)
      // this.$emit('controlShowReview', true)
    },
  },
}
</script>

<style scoped>
.resend-color {
  color: #3382fa;
}
.error-text {
  color: #eb4545;
  margin-top: -20px;
  display: block;
}
</style>
