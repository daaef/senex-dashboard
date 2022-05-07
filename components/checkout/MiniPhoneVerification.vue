<template>
  <div class="checkout checkout--no-min-height">
    <div class="checkout__body">
      <div class="checkout__modal">
        <h3 class="heading-secondary u-mb-mini-medium u-mt-small">
          Phone Verification
        </h3>
        <label class="paragraph" for="password"
          >Please enter your 6-digit code sent to {{ maskMobile() }}</label
        >
        <div class="o-form__input-box">
          <input
            name="password"
            v-model="otp"
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
        <p
          v-if="verifyError"
          class="paragraph error-text u-text-left u-mb-mini-medium"
        >
          This code is incorrect. Please check and try again.
        </p>
        <div class="checkout__btn-box wallet-btn-box u-mb-mini-medium">
          <div class="checkout__btn checkout__btn--sm">
            <ButtonSpinner
              value="Cancel"
              :background="backBtn().background"
              :color="backBtn().color"
              :on-submit="backBtn().onSubmit"
            />
          </div>
          <div class="checkout__btn">
            <ButtonSpinner
              value="Verify code"
              :background="continueBtn().background"
              :color="continueBtn().color"
              :on-submit="verifyCode"
              :is-in-active="isInActive()"
              :is-loading="processing"
            />
          </div>
        </div>
        <p class="paragraph">
          <span class="resend-code" @click="resendCode">Resend code</span>
          <span :class="[showTimer ? 'show' : 'hide']"
            >in 00:{{ counter }}</span
          >
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
    mobile: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      otp: '',
      passwordLocked: 'password',
      verifyError: false,
      processing: false,
      counter: 60,
      showTimer: false,
    }
  },
  methods: {
    togglePassword() {
      this.passwordLocked =
        this.passwordLocked === 'password' ? 'text' : 'password'
    },
    maskMobile() {
      const first4 = this.mobile.slice(0, 4)
      const last4 = this.mobile.slice(this.mobile.length - 4)

      return first4 + 'xxxx' + last4
    },
    continueBtn() {
      return {
        ...continueBtn,
      }
    },
    isInActive() {
      return !this.otp || this.otp.length != 6
    },
    backBtn() {
      return {
        ...backBtn,
        isInActive: false,
        onSubmit: () => {
          this.$emit('controlModal', false)
        },
      }
    },
    startCountDown(limit) {
      this.counter = limit
      this.showTimer = true
      const interval = setInterval(() => {
        this.counter--
        if (this.counter <= 0) {
          clearInterval(interval)
          this.showTimer = false
        }
      }, 1000)
    },
    async resendCode() {
      if (this.showTimer === true) {
        return
      }
      this.startCountDown(60)
      const payload = {
        email: this.email,
        mobile: this.mobile,
      }
      this.$axios
        .post('/verify/credentials', payload)
        .then((res) => {
          const pin = res.data.details.data.pinId
          localStorage.setItem('pinId', pin)
        })
        .catch((err) => {
          const {
            response: { data },
          } = err
          this.$notify({
            type: 'error',
            text: data.message, // error.response.data.message
          })
          return
        })
    },
    async verifyCode() {
      if (this.isInActive()) {
        return
      }
      const pin = localStorage.getItem('pinId')
      const payload = {
        code: this.otp,
        type: 'Normal',
        pinId: pin,
      }
      this.processing = true
      try {
        await this.$api.verifyOTP(payload)
        await this.$auth.fetchUser()
        this.processing = false
        this.otp = ''
        this.$notify({
          title: 'Good job boss! 👌 ',
          text: 'Your phone number was verified successfully.',
        })
        this.$emit('proceedToPassword')
        this.$emit('controlModal', false)
        // this.$router.push('/secret')
      } catch (e) {
        // this.processing = false
        // this.inValid = true
        // const err = e.response.data && e.response.data.message
        this.verifyError = true
        this.processing = false
        // this.inValidMessage =
        //   err !== '' ? err : 'Invalid code. Please check the code again.'
        // this.$notify({
        //   type: 'error',
        //   text: err
        // })
      }
    },
  },
}
</script>

<style scoped>
.resend-code {
  cursor: pointer;
}
.time {
  font-weight: 700;
}
.error-text {
  color: #eb4545;
  margin-top: -20px;
  display: block;
}
.hide {
  display: none;
}

.show {
  display: inline;
}
</style>
