<template>
  <div class="auth">
    <div class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <form class="auth__form" @submit.prevent="login">
          <h3 class="u-text-center u-mb-30 fw-700">SIGN IN</h3>
          <div class="auth__input-box u-mb-30">
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div class="auth__input-box u-mb-30">
            <input
              id="pwd"
              v-model="password"
              :type="passwordLocked"
              placeholder="Password"
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
          <ButtonSpinner
            :is-loading="processing"
            :is-in-active="buttonDisabled"
            value="Sign in to your account"
            :on-submit="login"
          />
        </form>
        <div class="auth__form-footer">
          <span class="u-text-center"
            >New to SenexPay?
            <router-link class="u-link" to="/create-account"
              >Create your account</router-link
            ></span
          >
          <router-link class="u-link u-text-center" to="/forgot-password">
            Forgot your password?
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import getDeviceInfo from '@/data/getDeviceInfo.js'
import ButtonSpinner from '~/components/custom/ButtonSpinner.vue' // file rename

export default {
  components: {
    ButtonSpinner,
  },
  layout: 'toast',
  middleware: 'authenticated',
  data() {
    return {
      email: '',
      password: '',
      processing: false,
      passwordLocked: 'password',
      buttonDisabled: true,
    }
  },
  head() {
    return {
      title: 'Sign in | SenexPay',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Sign in to your SenexPay account. Have access to a secure dashboard where you can Buy, Sell and Manage your Bitcoin, USDT and more cryptocurrencies.',
        },
      ],
      link: [{ rel: 'canonical', href: 'https://app.senexpay.com/signin' }],
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  watch: {
    email(value) {
      this.email = value
      this.validateEmail(value)
    },
    password(value) {
      this.password = value
      this.validatePassword(value)
    },
  },
  methods: {
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
        this.processing = false
        this.$router.go()
        // this.$router.push('/dashboard')
        setTimeout(() => {
          // this.processing = false
          // this.email = ''
          // this.password = ''
          this.$router.push('/')
        }, 100)
      } catch (error) {
        // console.log(err)
        this.processing = false
        if (
          error.response.data.detail.includes(
            'This account has not been activated'
          )
        ) {
          this.$router.push('/verify-email/?email=' + this.email)
          return
        }
        this.$notify({
          type: 'error',
          title: 'Oops!🙄 ',
          text:
            error.response.data.detail ||
            'This is on us. Please try again later.', //'Incorrect email or password. Double-check and try again.'
        })
      }
    },
    async getFingerPrint(userAgent, browser, os, cpu) {
      let message = userAgent + browser + os + cpu
      const secret = 'SenexPay'
      const enc = new TextEncoder('utf-8')
      const algorithm = { name: 'HMAC', hash: 'SHA-256' }
      const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secret),
        algorithm,
        false,
        ['sign', 'verify']
      )
      return crypto.subtle
        .sign(algorithm.name, key, enc.encode(message))
        .then((hashBuffer) => {
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
          return hashHex
        })

      // return hashHex;
    },
    async getDeviceInfo() {
      const client = new window.ClientJS()
      let f = await this.getFingerPrint(
        client.getUserAgent(),
        client.getBrowser(),
        client.getOS(),
        client.getCPU()
      )
      return {
        userAgent: client.getUserAgent(),
        browser: client.getBrowser(),
        os: client.getOS(),
        device: client.getDevice(),
        deviceType: client.getDeviceType(),
        deviceVendor: client.getDeviceVendor(),
        cpu: client.getCPU(),
        fingerprint: '' + f,
        timezone: client.getTimeZone(),
        language: client.getLanguage(),
      }
      // console.log(f)
    },
  },
}
</script>

<style lang="scss" scoped></style>
