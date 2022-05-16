<template>
  <div class="auth">
    <div class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="fw-600 u-text-center u-mb-30">SET YOUR SECRET KEY</h3>
        <p class="u-text-center u-mb-30">
          Your secret key is a 3-alphabet key that provides extra security for
          your transactions.
        </p>
        <div class="auth__input-box u-mb-30">
          <input
            v-model="secretKey"
            :type="secretLocked"
            placeholder="Enter your secret key e.g ALX"
            @keypress.enter="onSubmit"
            @keypress="isBelowThree"
          />
          <img
            :src="[
              secretLocked !== 'password'
                ? '/img/eye-on.svg'
                : '/img/eye-off.svg',
            ]"
            alt="eye"
            class="auth__pwd-eye"
            @click="toggleSecret"
          />
        </div>
        <ButtonSpinner
          :is-loading="processing"
          :is-in-active="buttonDisabled"
          value="Set Secret Key"
          :on-submit="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'blank',
  head() {
    return {
      title: 'Secret | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Set your SenexPay secret key',
        },
      ],
    }
  },
  data() {
    return {
      secretKey: '',
      processing: false,
      buttonDisabled: true,
      secretLocked: 'text',
      validSecret: 0,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  watch: {
    secretKey(val) {
      this.secretKey = val.toUpperCase()
      this.validateSecret(this.secretKey)
    },
  },
  methods: {
    toggleSecret() {
      this.secretLocked = this.secretLocked === 'password' ? 'text' : 'password'
    },
    validateSecret(value) {
      if (value.length < 3) {
        this.validSecret = 1
      } else {
        this.validSecret = 2
      }
      this.isAllValid()
    },
    isAllValid() {
      if (this.validSecret === 2) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
    },
    isBelowThree(evt) {
      if (this.secretKey.length === 3) {
        evt.preventDefault()
      }
    },
    async onSubmit() {
      if (this.buttonDisabled) {
        return
      }
      const secret = {
        securityKey: this.secretKey,
        type: 'First',
      }
      this.processing = true
      try {
        await this.$api.setSecretKey(secret)
        await this.$auth.fetchUser()
        this.secretKey = ''
        this.newSecretKey = ''
        this.processing = false
        this.$notify({
          title: 'You are doing well boss!',
          text: 'Your secret key was set successfully.',
        })
        // this.$toast.open({
        //   message:
        //     'You are doing well boss! \n Your secret key was set successfully.',
        //   type: 'success',
        //   position: 'top-right'
        // })
        setTimeout(() => {
          this.$router.push('/')
        }, 100)
      } catch (error) {
        console.log(error)
        this.processing = false
        this.$notify({
          type: 'error',
          text: error.response.data.message,
        })
        // this.$toast.open({
        //   message: error.response.data.message,
        //   type: 'error',
        //   position: 'top-right'
        // })
      }
    },
  },
}
</script>

<style scoped></style>
