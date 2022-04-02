<template>
  <div class="auth">
    <div class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="fw-bold u-text-center u-mb-sm">EMAIL VERIFICATION</h3>
        <div class="auth__success-img-box u-mb-sm">
          <span class="info">i</span>
          <!-- <img class="auth__success-img" src="/img/email-verif.svg" alt="celebration emoji" > -->
        </div>
        <div class="verify-content">
          <p class="primary-text u-text-center u-mb-30">
            We realised that the email
            <span class="bold">{{ hideEmail() }}</span> is not verified on
            SenexPay.
          </p>
          <p class="u-text-center u-mb-sm">
            Would you like to verify this email?
          </p>
          <ButtonSpinner
            :is-loading="processing"
            :is-in-active="false"
            value="Verify email"
            setClass="u-mb-sm"
            :on-submit="onSubmit"
          />
          <p class="u-text-center">
            <router-link to="/signin">Sign in</router-link> with another email
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import CardTitle from '@/components/Base/Card/CardTitle'

export default {
  components: {
    // CardTitle
  },
  layout: 'toast',
  // middleware: 'authenticated',
  head() {
    return {
      title: 'Verify Email | SenexPay ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Verify your SenexPay account',
        },
      ],
    }
  },
  data() {
    return {
      confirmPhone: false,
      email: '',
      processing: false,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    async onSubmit() {
      const payload = {
        email: this.getEmail(),
      }
      this.processing = true
      try {
        await this.$api.reactivate(payload)
        // await this.$auth.fetchUser()
        this.processing = false
      } catch (error) {
        this.processing = false
        this.$notify({
          type: 'error',
          text: error.response.data.message || 'Something went wrong',
        })
      }
    },
    getEmail() {
      return this.$route.query.email
    },
    hideEmail() {
      const email = this.getEmail()
      const emailParts = email.split('@')
      return `${emailParts[0].slice(0, emailParts[0].length - 3)}xxx@${
        emailParts[1]
      }`
    },
  },
}
</script>

<style lang="scss" scoped>
.verify-content {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.primary-text {
  color: #242426;
}

.info {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 24px;
  border-radius: 50%;
  background-color: #ffb91a;
  color: white;
  font-weight: 700;
  text-align: center;
}
</style>
