<template>
  <div class="auth">
    <div v-if="!passwordChanged" class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <form class="auth__form">
          <h3 class="paragraph u-fw--600 u-text-center u-mb-30">
            PASSWORD RESET
          </h3>
          <div class="auth__label-input-box u-mb-30">
            <div class="auth__input-box">
              <input
                v-model="password"
                :type="passwordLocked"
                placeholder="Enter your new password"
                @keyup.enter="onSubmit"
              />
              <img
                :src="[
                  passwordLocked !== 'password'
                    ? '/img/eye-on.svg'
                    : '/img/eye-off.svg',
                ]"
                alt="eye"
                class="auth__pwd-eye"
                @click="togglePassword"
              />
            </div>
            <div
              class="correct-validation-holder paragraph"
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
              <p class="validation-span">
                <i
                  class="las la-circle dot"
                  :class="[
                    passValid.hasSymbol === 2
                      ? 'green-dot'
                      : passValid.hasSymbol === 1
                      ? 'red-dot'
                      : '',
                  ]"
                ></i
                >Use a symbol (e.g!@#$)
              </p>
            </div>
          </div>
          <ButtonSpinner
            :is-loading="processing"
            :is-in-active="buttonDisabled"
            value="Reset password"
            :on-submit="onSubmit"
          />
        </form>
        <div class="auth__form-footer paragraph">
          <span class="u-text-center"
            >Remembered your password?
            <router-link class="auth__link" to="/signin">Login</router-link>
          </span>
        </div>
      </div>
    </div>
    <div v-else class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="paragraph u-fw-600 u-text-center u-mb-30">
          PASSWORD RESET SUCCESS
        </h3>
        <div class="auth__success-img-box u-mb-10">
          <img class="auth__success-img" src="/img/checkmark.svg" alt="email" />
        </div>
        <p class="paragraph u-text-center u-mb-30">
          You have successfully changed your password.
        </p>
        <ButtonSpinner
          :is-loading="false"
          :is-in-active="false"
          value="Continue to your log in"
          :on-submit="login"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'blank',
  data() {
    return {
      password: '',
      rePassword: '',
      processing: false,
      passwordChanged: false,
      passwordLocked: 'text',
      buttonDisabled: true,
      hideValidation: true,
      passValid: {
        charLen: 0,
        upperCase: 0,
        lowerCase: 0,
        hasNum: 0,
        hasSymbol: 0,
      },
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  watch: {
    password(value) {
      this.password = value
      this.validateFullPassword(value)
    },
  },
  methods: {
    togglePassword() {
      this.passwordLocked =
        this.passwordLocked === 'password' ? 'text' : 'password'
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
    isAllValid() {
      if (
        this.passValid.charLen === 2 &&
        this.passValid.upperCase === 2 &&
        this.passValid.lowerCase === 2 &&
        this.passValid.hasNum === 2 &&
        this.passValid.hasSymbol === 2
      ) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
    },
    login() {
      this.$router.push('/signin')
    },
    async onSubmit() {
      if (this.buttonDisabled) {
        return
      }
      const payload = {
        uid: this.$route.params.id,
        token: this.$route.params.token,
        newPassword: this.password,
        reNewPassword: this.password,
      }
      this.processing = true
      try {
        await this.$api.resetPasswordConfirm(payload)
        await this.$auth.fetchUser()
        this.password = ''
        this.rePassword = ''
        this.processing = false
        this.passwordChanged = true
      } catch (e) {
        this.processing = false
        this.$emit('change-validity', false)
        const errors = e.response.data
        let error = ''
        for (const i in errors) {
          error += errors[i][0] + '. '
        }
        this.$notify({
          type: 'error',
          text: error,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.correct-validation-holder {
  margin-bottom: 25px;
}

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
</style>
