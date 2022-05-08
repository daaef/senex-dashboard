<template>
  <div>
    <div class="u-mb-30">
      <h3 class="heading-primary">OK, THIS IS THE FINAL STEP</h3>
      <p class="paragraph">This is where you set a strong password.</p>
    </div>
    <form action="#" class="o-form">
      <label class="paragraph" for="password">Set your password</label>
      <div class="o-form__input-box">
        <input
          name="password"
          :type="passwordLocked"
          class="o-form__input"
          :value="password"
          @input="$emit('update:password', $event.target.value)"
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
      <div
        class="correct-validation-holder"
        :class="[hideValidation ? 'hide' : 'show']"
      >
        <span class="validation-span"
          ><i
            class="las la-circle dot"
            :class="[
              passValid.charLen === 2
                ? 'green-dot'
                : passValid.charLen === 1
                ? 'red-dot'
                : '',
            ]"
          ></i
          >Use 8 or more characters</span
        >
        <span class="validation-span"
          ><i
            class="las la-circle dot"
            :class="[
              passValid.upperCase === 2 && passValid.lowerCase === 2
                ? 'green-dot'
                : passValid.upperCase === 0 && passValid.lowerCase === 0
                ? ''
                : 'red-dot',
            ]"
          ></i
          >Use upper and lower case letters (e.g Aa)</span
        >
        <span class="validation-span"
          ><i
            class="las la-circle dot"
            :class="[
              passValid.hasNum === 2
                ? 'green-dot'
                : passValid.hasNum === 1
                ? 'red-dot'
                : '',
            ]"
          ></i
          >Use a number (e.g 1234)</span
        >
        <span class="validation-span"
          ><i
            class="las la-circle dot"
            :class="[
              passValid.hasSymbol === 2
                ? 'green-dot'
                : passValid.hasSymbol === 1
                ? 'red-dot'
                : '',
            ]"
          ></i
          >Use a symbol (e.g!@#$)</span
        >
      </div>
    </form>
    <CheckoutButtonSet :left="backBtn()" :right="continueBtn()" />
  </div>
</template>

<script>
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
export default {
  props: {
    password: {
      type: String,
      default: '',
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    isPasswordValid: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      processing: false,
      passwordLocked: 'password',
      passValid: {
        charLen: 0,
        upperCase: 0,
        lowerCase: 0,
        hasNum: 0,
        hasSymbol: 0,
      },
      hideValidation: true,
    }
  },
  watch: {
    password(value) {
      this.validateFullPassword(value)
    },
  },
  methods: {
    continueBtn() {
      return {
        ...continueBtn,
        isInActive: !this.isPasswordValid,
        isLoading: this.processing,
        onSubmit: () => {
          // this.$emit('change-sign-up-step', 2)
          this.registerUser()
        },
      }
    },
    backBtn() {
      return {
        ...backBtn,
        isInActive: this.processing,
        onSubmit: () => {
          this.$emit('change-sign-up-step', 2)
        },
      }
    },
    registerUser() {
      const payload = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        mobileNumber: this.mobile,
        password: this.password,
        // email_subscription: true,
        // device: this.getDeviceInfo()
      }
      this.$store.commit('order/setUserInfo', payload)
      this.$store.commit('order/setSignedIn', 1)
    },
    togglePassword() {
      this.passwordLocked =
        this.passwordLocked === 'password' ? 'text' : 'password'
    },
    isAllValid() {
      if (
        this.passValid.charLen === 2 &&
        this.passValid.upperCase === 2 &&
        this.passValid.lowerCase === 2 &&
        this.passValid.hasNum === 2 &&
        this.passValid.hasSymbol === 2
      ) {
        this.$emit('validateInfo', true)
      } else {
        this.$emit('validateInfo', false)
      }
    },
    validateFullPassword(value) {
      if (value.length === 0) {
        this.hideValidation = true
      } else {
        this.hideValidation = false
      }
      if (/[a-z]/.test(value)) {
        this.passValid.lowerCase = 2
      } else {
        this.passValid.lowerCase = 1
      }
      if (/[A-Z]/.test(value)) {
        this.passValid.upperCase = 2
      } else {
        this.passValid.upperCase = 1
      }
      if (/[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g.test(value)) {
        this.passValid.hasSymbol = 2
      } else {
        this.passValid.hasSymbol = 1
      }
      if (/\d/.test(value)) {
        this.passValid.hasNum = 2
      } else {
        this.passValid.hasNum = 1
      }
      if (value.length < 8) {
        this.passValid.charLen = 1
      } else {
        this.passValid.charLen = 2
      }

      this.isAllValid()
    },
    getDeviceInfo() {
      const client = new window.ClientJS()

      return {
        userAgent: client.getUserAgent(),
        browser: client.getBrowser(),
        os: client.getOS(),
        device: client.getDevice(),
        deviceType: client.getDeviceType(),
        deviceVendor: client.getDeviceVendor(),
        cpu: client.getCPU(),
        fingerprint: '' + client.getFingerprint(),
        timezone: client.getTimeZone(),
        language: client.getLanguage(),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}

.show {
  display: block;
}

.validation-span {
  margin: 10px 0 0 5px;
  font-style: italic;
  color: #707070;
  display: inline-block;
  width: 100%;
}

.dot {
  margin-right: 2px;
  border: 1px solid #707070;
  position: relative;
  top: -4px;
  border-radius: 50%;
  font-size: 6px;
}

.red-dot {
  background-color: red;
}
.green-dot {
  background-color: green;
}

.correct-validation-holder {
  margin-top: -30px;
  margin-bottom: 25px;
}
</style>
