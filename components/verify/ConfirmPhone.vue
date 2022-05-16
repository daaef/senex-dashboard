<template>
  <div class="auth">
    <div class="auth__form-logo-box">
      <LogoImage />
      <div class="auth__form-box">
        <h3 class="fw-bold u-text-center u-mb-30">PHONE NUMBER VERIFICATION</h3>
        <div class="auth__success-img-box u-mb-10">
          <img class="auth__success-img" src="/img/mobile.svg" alt="mobile" />
        </div>
        <p class="u-text-center">An OTP will be sent to</p>
        <div class="auth__input-box u-mb-30">
          <input
            :value="user.mobile"
            type="text"
            disabled
            class="disabled-btn-color"
          />
        </div>
        <ButtonSpinner
          :is-loading="processing"
          value="Get OTP"
          :on-submit="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'toast',
  data() {
    return {
      processing: false,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    async onSubmit() {
      const payload = {
        type: 'Generic',
        newMobile: this.user.mobile,
      }
      this.processing = true
      try {
        const { data } = await this.$api.sendOTP(payload)
        localStorage.setItem('pinId', data.details.data.pinId)
        this.processing = false
        this.$emit('verify-otp')
      } catch (error) {
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

<style lang="scss" scoped></style>
