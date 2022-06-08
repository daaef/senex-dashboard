<template>
  <div class="auth auth--white-bg">
    <div class="auth__form-logo-box">
      <div class="auth__form-box">
        <div class="auth__success-img-box auth__success-img-box--sm u-mb-small">
          <img
            class="auth__success-img"
            src="/img/icon-expired.svg"
            alt="email"
          />
        </div>
        <h3
          class="heading-tertiary heading-tertiary--600 u-text-center u-mb-small"
        >
          Password Reset Link Expired
        </h3>
        <p class="paragraph u-text-center u-mb-small">
          Your password reset link has expired. If you still wish to reset your
          password, kindly request for a new link.
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
  layout: 'blank',
  data() {
    return {
      processing: true,
    }
  },
  methods: {
    requestNewLink() {
      this.$router.push('/forgot-password')
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
