<template>
  <div>
    <div class="u-mb-30">
      <h3 class="heading-primary">ACCOUNT AUTHENTICATION</h3>
      <p class="paragraph">
        Enter your details quickly and continue your trade
      </p>
    </div>
    <form action="#" class="o-form">
      <label class="paragraph" for="email">Enter your email address</label>
      <div class="o-form__input-box">
        <input
          name="email"
          v-model="email"
          type="email"
          class="o-form__input"
        />
      </div>
      <label class="paragraph" for="password">Enter your password</label>
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
      <router-link
        to="/forgot-password"
        target="_blank"
        style="margin-top: -20px"
        class="u-link-color paragraph u-block u-mb-30"
        >Forgot password?</router-link
      >
    </form>
    <CheckoutButtonSet :left="backBtn()" :right="continueBtn()" />
    <vue-final-modal id="auth-success" v-model="openModal">
      <div class="benef-overlay container"><SuccessfulAuth /></div>
    </vue-final-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
import getDeviceInfo from '@/data/getDeviceInfo.js'
import {
  COOKIE_SAVED_CHECKOUT,
  COOKIE_SAVED_ORDER,
  COOKIE_SAVED_ORDER_REVIEW_BENEF,
  COOKIE_SAVED_RATE_OBJECT,
} from '~/data/constants'
export default {
  layout: 'order',

  props: {
    order: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      email: '',
      password: '',
      processing: false,
      passwordLocked: 'password',
      buttonDisabled: true,
      openModal: false,
      isLimitExceeded: false,
      validEmail: 1,
      validPassword: 1,
    }
  },
  watch: {
    // user() {
    //   // alert(this.previousRoute)
    //   if (this.user) this.$router.back()
    // }
    email(value) {
      this.email = value
      this.validateEmail(value)
    },
    password(value) {
      this.password = value
      this.validatePassword(value)
    },
  },
  computed: {
    ...mapState('auth', ['user']),
    // order: state => state.order.orderDetail
  },
  methods: {
    continueBtn() {
      return {
        ...continueBtn,
        isLoading: this.processing,
        isInActive: this.buttonDisabled,
        onSubmit: this.login,
      }
    },
    backBtn() {
      return {
        ...backBtn,
        isInActive: false,
        onSubmit: this.cancelTransaction,
      }
    },

    togglePassword() {
      this.passwordLocked =
        this.passwordLocked === 'password' ? 'text' : 'password'
    },

    validateEmail(value) {
      const reg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
      if (reg.test(value)) {
        this.validEmail = 2
      } else {
        this.validEmail = 1
      }
      this.isAllValid()
    },
    validatePassword(value) {
      if (value.length < 8) {
        this.validPassword = 1
      } else {
        this.validPassword = 2
      }
      this.isAllValid()
    },
    isAllValid() {
      if (this.validEmail === 2 && this.validPassword === 2) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
    },
    async login() {
      if (this.buttonDisabled) {
        return
      }
      const payload = {
        email: this.email,
        password: this.password,
        deviceInfo: await getDeviceInfo(this.email),
      }
      this.processing = true
      try {
        await this.$auth.loginWith('local', {
          data: payload,
        })
        await this.$auth.fetchUser()
        this.openModal = true
        setTimeout(() => {
          this.openModal = false
          this.$store.commit('order/setSignedIn', 2)
          // this.$router.push('/dashboard')
        }, 2500)
        // await this.checkOrderLimit()
      } catch (err) {
        this.processing = false
        this.$router.push('/order/checkout')
        this.$notify({
          type: 'error',
          title: 'Oops!🙄 ',
          text: 'Incorrect email or password. Double-check and try again.',
        })
      }
    },
    terminateSession() {
      this.$cookiz.remove(COOKIE_SAVED_ORDER)
      this.$cookiz.remove(COOKIE_SAVED_RATE_OBJECT)
      this.$cookiz.remove(COOKIE_SAVED_CHECKOUT)
      this.$cookiz.remove(COOKIE_SAVED_ORDER_REVIEW_BENEF)
    },
    cancelTransaction() {
      this.terminateSession()
      this.$router.push('/order/start')
    },
    checkOrderLimit() {
      const payload = {
        email: this.user.profile.user.email,
        cryptoAmount: this.order.cryptoAmount,
        type: this.order.orderType,
        rate: this.order.cryptoFiatRate,
      }

      this.$axios
        .post('/kyc/check', payload)
        .then((res) => {
          // popup login and change mode
          if (res.data.isUser) {
            this.processing = false
            this.isLimitExceeded = false
          }
        })
        .catch((err) => {
          const {
            response: { data, status },
          } = err

          if (status === 400) {
            if (data.isUser) {
              // this.errorMessage = data.message
              if (data.message && data.message.includes('limit exceeded')) {
                this.processing = false
                this.isLimitExceeded = true
                return
              }
            }
          }
          this.processing = false
          // this.isLimitExceeded = true
          this.$notify({
            type: 'error',
            text: data.message,
          })
        })
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
// /deep/ #auth-success___BV_modal_content_ {
//   background-color: transparent !important;
//   border: transparent !important;
//   padding: 0 !important;
//   max-width: 450px !important;
//   overflow: hidden !important;
//   margin: auto !important;
// }

// /deep/ #auth-success___BV_modal_body_ {
//   padding: 0 !important;
//   width: 100% !important;
//   background-color: transparent !important;
// }

// /deep/ #order-limit___BV_modal_content_ {
//   background-color: transparent;
//   border: transparent;
//   padding: 0 !important;
//   width: 450px !important;
//   overflow: hidden;
//   margin: auto;
// }

// /deep/ #order-limit___BV_modal_body_ {
//   padding: 0 !important;
//   width: 100% !important;
// }
</style>
