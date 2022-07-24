<template>
  <div class="modal-box modal-box--border-grey">
    <div class="modal-box__header">
      <span class="close" @click="$emit('closeModal')"></span>
      <h3 class="heading-primary u-text-center u-mx-auto">
        Email Verification
      </h3>
    </div>
    <div class="modal-box__body u-mb-40">
      <p class="u-text-center u-mb-40">
        Please enter the 6-digit code sent to {{ email }}
      </p>
      <div class="input-box u-mb-20">
        <input v-model="code" type="text" placeholder="Enter code" />
      </div>
      <div class="u-text-right">
        <ResendCode @action="resendCode" />
      </div>
    </div>
    <div class="u-text-center">
      <BtnSpinner
        :is-in-active="false"
        :is-loading="processing"
        value="Verify email"
        set-class="btn-full-width"
        :on-submit="onSubmit"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      code: '',
      processing: false,
    }
  },
  mounted() {
    this.resendCode()
  },
  methods: {
    async onSubmit() {
      this.processing = true
      const verifyPayload = {
        code: this.code,
        pinId: localStorage.getItem('pinId'),
        type: 'Normal',
      }
      await this.$api.verifyOTP(verifyPayload)
      try {
        this.$emit('action')
      } catch (error) {
        console.log(error)
      } finally {
        this.processing = false
      }
    },
    async resendCode() {
      const payload = {
        email: this.email,
      }
      try {
        const { data } = await this.$api.sendEmailOTP(payload)
        console.log('data', data)
        localStorage.setItem('pinId', data.data.pinId)
        this.$notify({
          text: 'OTP sent',
        })
      } catch (error) {
        this.$notify({
          text: error.response.data.message,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style></style>
