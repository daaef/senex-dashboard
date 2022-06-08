<template>
  <div class="auth">
    <div class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="paragraph u-fw-600 u-text-center u-mb-mini-medium">
          EMAIL VERIFICATION
        </h3>
        <div class="auth__success-img-box u-mb-10">
          <img
            class="auth__success-img"
            src="/img/email-verif.svg"
            alt="email"
          />
        </div>
        <p class="paragraph u-text-center">
          We just sent a verification email to {{ email }}
        </p>
        <p class="paragraph u-fw-600 u-text-center u-mb-mini-medium">
          {{ email }}
        </p>
        <p class="paragraph u-text-center check-prom">
          Check in your promotions folder if you don’t see it in your inbox.
        </p>
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
  head() {
    return {
      title: 'Activation | SenexPay',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Activate your SenexPay password',
        },
      ],
    }
  },
  layout: 'blank',
  data() {
    return {
      email: '',
    }
  },
  mounted() {
    this.email = localStorage.userEmail
    localStorage.userEmail = ''
  },
}
</script>

<style lang="scss">
.check-prom {
  width: 100%;
  max-width: 250px;
  color: #707070;
  margin: auto;
}
</style>
