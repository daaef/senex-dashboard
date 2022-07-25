<template>
  <div class="auth">
    <div v-if="!requestSent" class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="paragraph u-fw-600 u-text-center u-mb-30">
          REQUEST EMAIL ACTIVATION
        </h3>
        <div class="auth__input-box u-mb-30">
          <input
            id="pwd"
            v-model="email"
            type="email"
            class="input-element"
            placeholder="Enter your email address"
            @keyup.enter="onSubmit"
          />
        </div>
        <ButtonSpinner
          :is-loading="processing"
          :is-in-active="buttonDisabled"
          value="Request reset"
          :on-submit="onSubmit"
        />
      </div>
    </div>
    <div v-else class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="paragraph u-fw-600 u-text-center u-mb-30">
          REQUEST EMAIL RESET
        </h3>
        <div class="auth__success-img-box u-mb-10">
          <img
            class="auth__success-img"
            src="/img/email-verif.svg"
            alt="email"
          />
        </div>
        <div class="paragraph u-text-center u-mb-30">
          <p>We just sent an email to you.</p>
          <p>Follow the instructions to activate your email.</p>
        </div>
        <p class="paragraph u-text-center u-color-grey707">
          Check in your promotions folder if you don’t see it in your inbox.
        </p>
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
      title: 'Re-activation | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Re-activate your SenexPay account',
        },
      ],
    }
  },
  data() {
    return {
      email: '',
      processing: false,
      buttonDisabled: true,
      validEmail: 0,
      requestSent: false,
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
  },
  methods: {
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
    isAllValid() {
      if (this.validEmail === 2) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
    },
    async onSubmit() {
      if (this.buttonDisabled) {
        return
      }
      const payload = {
        email: this.email,
      }
      this.processing = true
      try {
        await this.$api.reactivate(payload)
        await this.$auth.fetchUser()
        this.email = ''
        this.processing = false
        this.requestSent = true
      } catch (error) {
        this.processing = false
        this.$notify({
          type: 'error',
          text: error.response.data.message,
        })
        // this.$toast.open({
        //   message: error.response.data[0],
        //   type: 'error',
        //   position: 'top-right'
        // })
      }
    },
  },
}
</script>

<style scoped></style>
