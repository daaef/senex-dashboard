<template>
  <div class="auth">
    <div class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="fw-600 u-text-center u-mb-30">EMAIL VERIFICATION SUCCESS</h3>
        <div class="auth__success-img-box u-mb-10">
          <img
            class="auth__success-img"
            src="/img/celebration.svg"
            alt="email"
          />
        </div>
        <p class="fw-bold u-text-center">Congratulations.</p>
        <p class="u-text-center u-mb-30">Your email has been verified</p>
        <ButtonSpinner
          :is-loading="false"
          :is-in-active="false"
          value="Login to your account"
          :on-submit="login"
        />
      </div>
    </div>
  </div>
</template>
<script>
// import CardTitle from '@/components/Base/Card/CardTitle'
import LogoImage from '@/components/custom/LogoImage'
export default {
  components: {
    LogoImage,
    // CardTitle
  },
  layout: 'toast',
  data() {
    return {
      opacity: 1,
      processing: true,
      emailVerified: false,
    }
  },
  methods: {
    login() {
      this.$router.push('/signin')
    },
  },
}
</script>

<style lang="scss" scoped></style>
