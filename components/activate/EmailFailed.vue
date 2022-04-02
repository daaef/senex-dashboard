<template>
  <div class="auth auth--white-bg">
    <div class="auth__form-logo-box">
      <div class="auth__form-box">
        <div class="auth__success-img-box auth__success-img-box--sm u-mb-sm">
          <img
            class="auth__success-img"
            src="/img/icon-expired.svg"
            alt="email"
          />
        </div>
        <h3 class="heading-tertiary fw-600 u-text-center u-mb-sm">
          Email Verification Link Expired
        </h3>
        <p class="u-text-center u-mb-sm">
          Your email verification link has expired. Kindly request for a new
          link by clicking below
        </p>
        <div class="btn-div">
          <ButtonSpinner
            :is-loading="false"
            :is-in-active="false"
            value="Request for new link"
            :on-submit="requestNewLink"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'toast',
  data() {
    return {
      processing: true,
    }
  },
  methods: {
    requestNewLink() {
      this.$router.push('/re-activation')
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-div {
  width: 100%;
  max-width: 300px;
  margin: auto;
}
</style>
