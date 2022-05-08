<template>
  <div class="checkout checkout--no-min-height">
    <div class="checkout__body">
      <div class="checkout__modal">
        <h3 class="heading-secondary u-mb-30 u-mt-small">
          CONFIRM WALLET ADDRESS
        </h3>
        <p class="u-mb-30 paragraph">
          Are you sure you want to proceed with this wallet?
        </p>
        <div
          class="o-form__input-box o-form__input-box--bg-dark u-text-left u-mb-30"
        >
          <span class="o-form__input u-dim">{{ address }}</span>
        </div>
        <div class="checkout__btn-box wallet-btn-box">
          <div class="checkout__btn checkout__btn--lg">
            <ButtonSpinner
              value="Continue with wallet"
              :background="backBtn.background"
              :color="backBtn.color"
              :on-submit="onSubmit"
              :is-loading="processing"
            />
          </div>
          <div class="checkout__btn checkout__btn--sm">
            <ButtonSpinner
              value="Cancel"
              :background="continueBtn.background"
              :color="continueBtn.color"
              :on-submit="cancel"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'

export default {
  props: {
    address: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      backBtn: backBtn,
      continueBtn: continueBtn,
      processing: false,
    }
  },
  methods: {
    onSubmit() {
      // this.processing = true
      this.$emit('addRecipientAndPlaceOrder')
      // this.processing = false

      // setTimeout(() => {
      //   this.processing = false
      // }, 3000)
    },
    cancel() {
      this.$emit('controlModal', false)
    },
  },
}
</script>

<style lang="scss">
$color: #242426;

.mini-wallet-holder {
  width: 100%;
  text-align: center;
  padding: 20px 30px;
  color: $color;
  font-family: 'SFPro';
}

.mini-wallet-text-left {
  text-align: left;
}

.wallet-btn-box {
  flex-wrap: wrap;
}

.wallet-confirm-left {
  flex: 0 1 180px;
}

.wallet-confirm-right {
  flex: 0 1 120px;
}

.wallet-btn-spinner {
  font-size: 14px !important;
}
</style>
