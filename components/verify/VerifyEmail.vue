<template>
  <div class="auth">
    <div class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="fw-bold u-text-center u-mb-30">EMAIL VERIFICATION</h3>
        <div class="auth__success-img-box u-mb-10">
          <img
            class="auth__success-img"
            src="/img/email-verif.svg"
            alt="celebration emoji"
          />
        </div>
        <p class="u-text-center">We just sent a verification email to.</p>
        <p class="fw-bold u-text-center u-mb-30">
          {{ email }}
        </p>
        <div class="auth__form-footer">
          <span class="u-text-center"
            >Check in your promotions folder if you don’t see it in your
            inbox.</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import CardTitle from '@/components/Base/Card/CardTitle'

export default {
  components: {
    // CardTitle
  },
  layout: 'toast',
  props: {
    email: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss"></style>
