<template>
  <div class="checkout checkout--no-min-height">
    <div class="checkout__body">
      <div class="checkout__modal">
        <h3 class="heading-secondary u-mb-mini-medium u-mt-small">
          VERIFY SECURITY CODES
        </h3>
        <p class="paragraph paragraph--600 u-text-left u-mb-10">
          Enter your 3-alphabet security key
        </p>
        <div class="o-form__input-box">
          <div
            style="
              width: 100%;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            "
          >
            <input
              ref="s1"
              v-model="s1"
              maxlength="1"
              :type="typeS1"
              class="otp-input"
              @keyup="keyUp(1, $event)"
              @keypress="checkKeys"
            />
            <input
              ref="s2"
              v-model="s2"
              maxlength="1"
              :type="typeS2"
              class="otp-input"
              @keyup="keyUp(2, $event)"
              @keypress="checkKeys"
            />
            <input
              ref="s3"
              v-model="s3"
              maxlength="1"
              :type="typeS3"
              class="otp-input"
              @keyup="keyUp(3, $event)"
              @keypress="checkKeys"
            />
            <!-- <v-otp-input
              ref="secretInput"
              input-classes="otp-input"
              separator=""
              :num-inputs="3"
              input-type=""
              :is-input-num="false"
              :should-auto-focus="true"
              @on-complete="handleOnComplete"
              @on-change="handleOnChange"
            /> -->
          </div>
        </div>
        <p
          v-if="secretError"
          class="paragraph error-text u-text-left u-mb-medium"
        >
          This is not your security key. Please try again.
        </p>
        <p class="paragraph paragraph--600 u-text-left u-mb-10">
          Enter the 6-digit code sent to {{ maskMobile() }}
        </p>
        <div class="o-form__input-box">
          <input
            name="password"
            v-model.number="otp"
            :type="passwordLocked"
            step="any"
            min="0"
            class="o-form__input"
            @keydown="isNumber"
          />
          <!-- <img
            :src="[
              passwordLocked !== 'password'
                ? '/img/eye-on.svg'
                : '/img/eye-off.svg'
            ]"
            alt="eye"
            class="form__input-eye"
            @click="togglePassword"
          /> -->
        </div>
        <p
          v-if="phoneVerifyError"
          class="paragraph error-text u-text-left u-mb-mini-medium"
        >
          This key is incorrect. Please check and try again.
        </p>
        <div class="checkout__btn-box wallet-btn-box u-mb-mini-medium">
          <div class="checkout__btn checkout__btn--sm">
            <ButtonSpinner
              value="Cancel"
              :background="backBtn.background"
              :color="backBtn.color"
              :on-submit="cancelTransaction"
            />
          </div>
          <div class="checkout__btn">
            <ButtonSpinner
              value="Verify codes"
              :background="continueBtn.background"
              :color="continueBtn.color"
              :is-loading="this.processing"
              :is-in-active="isContinueinActive()"
              :on-submit="
                () => {
                  this.onContinue()
                }
              "
            />
          </div>
        </div>
        <p class="paragraph">
          <span class="resend-color" @click="resendTwoFactorCode"
            >Resend code</span
          >
          <span :class="[showTimer ? 'show' : 'hide']"
            >in 00:{{ counter >= 10 ? counter : '0' + counter }}</span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import OtpInput from '@bachdgvn/vue-otp-input'
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
import { mapState } from 'vuex'

export default {
  components: {
    'v-otp-input': OtpInput,
  },
  props: {
    // processing: {
    //   type: Boolean,
    //   default: false
    // },
    mobile: {
      type: String,
      default: '',
    },
  },
  watch: {
    s1(val) {
      this.s1 = val.toUpperCase()
    },
    s2(val) {
      this.s2 = val.toUpperCase()
    },
    s3(val) {
      this.s3 = val.toUpperCase()
    },
  },
  data() {
    return {
      otp: '',
      processing: false,
      passwordLocked: 'number',
      backBtn: backBtn,
      continueBtn: continueBtn,
      isButtonDisabled: true,
      secretError: false,
      phoneVerifyError: false,
      counter: 60,
      showTimer: false,
      s1: '',
      s2: '',
      s3: '',
      typeS1: 'text',
      typeS2: 'text',
      typeS3: 'text',
    }
  },
  mounted() {
    this.getTwoFactor()
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
    isContinueinActive() {
      if (this.otp.toString().length != 6 || !this.s1 || !this.s2 || !this.s3) {
        return true
      }
      return false
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
    mergeSecret() {
      return this.s1 + this.s2 + this.s3
    },
    togglePassword() {
      this.passwordLocked =
        this.passwordLocked === 'password' ? 'number' : 'number'
    },
    maskMobile() {
      const first4 = this.mobile.slice(0, 4)
      const last4 = this.mobile.slice(this.mobile.length - 4)

      return first4 + 'xxxx' + last4
    },
    onContinue() {
      this.twoFactor()
    },
    isNumber(evt) {
      // const reg = /^\d*\.?\d*$/
      // console.log(evt.target.value.toString(), reg.test(evt.target.value))
      // if (reg.test(evt.target.value.toString(),)) {
      //   //evt.preventDefault()
      // } else {
      //   evt.preventDefault()
      // }
      const charCode = evt.which ? evt.which : evt.keyCode
      // console.log(charCode)
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46 &&
        charCode != 190
      ) {
        evt.preventDefault()
      }
    },
    keyUp(val, evt) {
      if (!this.isLetterOrBackspace(evt.keyCode)) {
        return
      }
      if (val == 1) {
        if (evt.keyCode != 8) {
          this.$refs.s2.select()
          this.$refs.s2.focus()
          this.typeS1 = 'password'
        } else {
          this.typeS1 = 'text'
        }
      } else if (val == 2) {
        if (evt.keyCode == 8) {
          this.$refs.s1.select()
          this.$refs.s1.focus()
          this.typeS2 = 'text'
        } else {
          this.$refs.s3.select()
          this.$refs.s3.focus()
          this.typeS2 = 'password'
        }
      } else if (val == 3) {
        if (evt.keyCode == 8) {
          this.$refs.s2.select()
          this.$refs.s2.focus()
          this.typeS3 = 'text'
        } else {
          setTimeout(() => {
            this.typeS3 = 'password'
          }, 100)
        }
      }
    },
    checkKeys(evt) {
      if (
        !this.isLetterOrBackspace(evt.keyCode) &&
        !this.modifierKeys().includes(evt.key)
      ) {
        evt.preventDefault()
      }
    },
    isLetterOrBackspace(code) {
      if (
        (code >= 65 && code < 91) ||
        (code >= 97 && code < 123) ||
        code == 8
      ) {
        return true
      }
    },
    modifierKeys() {
      return ['Backspace', 'Shift', 'CapsLock']
    },
    async getTwoFactor() {
      try {
        await this.$api.getTwoFactor()
      } catch (e) {}
    },
    async resendTwoFactorCode() {
      if (this.showTimer === true) {
        return
      }
      this.startCountDown(59)
      try {
        await this.$api.getTwoFactor()
      } catch (error) {}
    },
    async sendOTP() {
      const payload = {
        type: 'Generic',
        newMobile: this.mobile,
      }
      // this.processing = true
      try {
        const { data } = await this.$axios.post('/otp/send', payload) //this.$api.sendOTP(payload)
        localStorage.setItem('pinId', data.details.data.pinId)
        // this.processing = false
        // this.$emit('verify-otp')
      } catch (error) {
        this.$notify({
          type: 'error',
          text: error.response.data.message,
        })
      }
    },
    async twoFactor() {
      this.processing = true
      this.phoneVerifyError = false
      this.secretError = false
      const code = `${this.mergeSecret()}-${this.otp}`
      // const token = localStorage.getItem('user-token')
      try {
        await this.$api.twoFactor({ code })
        this.processing = false
        this.$emit('controlModal', false)
      } catch (err) {
        if (
          err.response.data.message &&
          err.response.data.message.includes('Could not fetch profile')
        ) {
          this.secretError = true
        } else {
          this.phoneVerifyError = true
        }
        this.processing = false
      }
    },
    terminateSession() {
      this.$cookiz.remove('a2snXbe')
      this.$cookiz.remove('eJ6Ydkmr035')
      this.$cookiz.remove('ftyp5h2nl')
    },
    cancelTransaction() {
      this.terminateSession()
      this.$router.push('/order/start')
    },
  },
}
</script>

<style scoped>
.resend-color {
  color: #3382fa;
  cursor: pointer;
}
.error-text {
  color: #eb4545;
  margin-top: -20px;
  /* font-size: 14px !important; */
  display: block;
}
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin-right: 20px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  display: flex;
  text-align: center;
}
.hide {
  display: none;
}

.show {
  display: inline;
}
</style>
