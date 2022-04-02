<template>
  <div class="auth">
    <div class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="fw-bold u-text-center u-mb-30">VERIFY YOUR PHONE NUMBER</h3>
        <div class="auth__success-img-box u-mb-10">
          <img class="auth__success-img" src="/img/mobile.svg" alt="mobile" />
        </div>
        <p class="u-text-center u-mb-10">
          Please enter the OTP sent to your phone number
        </p>
        <div
          style="
            width: 100%;
            display: flex;
            flex-direction: row;
            margin-bottom: 20px;
            justify-content: center;
            flex-wrap: wrap;
          "
        >
          <v-otp-input
            ref="otpInput"
            input-classes="otp-input"
            separator=""
            :num-inputs="6"
            :should-auto-focus="true"
            :is-input-num="true"
            @on-complete="handleOnComplete"
            @on-change="handleOnChange"
          />
        </div>
        <span class="invalid-code red" :class="[inValid ? 'show' : 'hide']">{{
          inValidMessage
        }}</span>
        <ButtonSpinner
          :is-loading="processing"
          :is-in-active="isButtonDisabled"
          value="Verify OTP"
          :on-submit="onSubmit"
        />
        <div class="auth__form-footer u-text-center">
          <span class=""
            >Didn't receive OTP?
            <span class="u-link" @click="resendOTP">Resend </span
            ><span :class="[showTimer ? 'show' : 'hide']"
              >in 00:{{ counter }}</span
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import OtpInput from '@bachdgvn/vue-otp-input'

export default {
  components: {
    'v-otp-input': OtpInput,
  },
  layout: 'toast',
  data() {
    return {
      otp: '',
      processing: false,
      isButtonDisabled: true,
      otpValue: '',
      inValid: false,
      inValidMessage: '',
      counter: 60,
      showTimer: false,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    handleOnComplete() {
      this.isButtonDisabled = false
    },
    handleOnChange() {
      this.isButtonDisabled = true
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
    async onSubmit() {
      if (this.isButtonDisabled) {
        return
      }
      const pinId = localStorage.getItem('pinId')
      const payload = {
        code: this.$refs.otpInput.otp.join(''),
        type: 'On login', //this.user.profile.mobileVerified ? 'On login' : 'Normal'
      }
      if (pinId) {
        payload.pinId = pinId
      }
      this.processing = true
      try {
        await this.$api.verifyOTP(payload)
        await this.$auth.fetchUser()
        localStorage.removeItem('pinId')
        this.processing = false
        this.otp = ''
        this.$notify({
          title: 'Good job boss! 👌 ',
          text: 'Your phone number was verified successfully.',
        })
        this.$router.push('/secret')
      } catch (e) {
        this.processing = false
        this.inValid = true
        const err = e.response.data && e.response.data.message
        this.inValidMessage =
          err !== '' ? err : 'Invalid code. Please check the code again.'
        this.$notify({
          type: 'error',
          text: err,
        })
      }
    },
    async resendOTP() {
      if (this.showTimer === true) {
        return
      }
      this.startCountDown(60)
      const payload = {
        type: 'Generic',
        currentMobile: this.user.mobile,
        newMobile: this.user.mobile,
      }
      this.processing = true
      try {
        const { data } = await this.$api.sendOTP(payload)
        localStorage.setItem('pinId', data.details.data.pinId)
        this.processing = false
      } catch (error) {
        this.processing = false
        this.$notify({
          type: 'error',
          text: error.response.data.message,
        })
      }
    },
  },
}
</script>

<style>
.hide {
  display: none;
}

.show {
  display: inline;
}

.otp-input {
  width: 30px;
  height: 30px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  display: flex;
  text-align: center;
}

@media screen and (min-width: 450px) {
  .otp-input {
    width: 40px;
    height: 40px;
  }
}
</style>
