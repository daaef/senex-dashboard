<template>
  <div class="modal-box modal-box--border-grey">
    <div class="modal-box__header">
      <span class="close" @click="$emit('closeModal')"></span>
      <h3 class="heading-primary u-text-center u-mx-auto">
        Phone Number Verification
      </h3>
    </div>
    <div class="modal-box__body u-mb-40">
      <p class="u-text-center u-mb-40">
        Please enter the 6-digit code sent to {{ maskMobile() }}
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
        value="Verify phone number"
        set-class="btn-full-width"
        :on-submit="verifyCode"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    mobile: {
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
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    maskMobile() {
      const phone = this.mobile
      return `${phone.substring(0, 4)}****${phone.substring(
        phone.length - 1,
        phone.length - 3
      )}`
    },
    async resendCode() {
      const payload = {
        type: 'Update',
        newMobile: this.mobile,
      }
      try {
        const { data } = await this.$api.sendOTP(payload)
        localStorage.setItem('pinId', data.details.data.pinId)
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
    async verifyCode() {
      const payload = {
        code: this.code,
        pinId: localStorage.getItem('pinId'),
        type: 'UpdatePhone',
        newMobile: this.mobile,
      }
      this.processing = true
      try {
        await this.$api.verifyOTP(payload)
        await this.$auth.fetchUser()
        localStorage.removeItem('pinId')
        this.processing = false
        this.$notify({
          text: 'Phone number updated',
        })
        this.$emit('action')
        this.$emit('closeModal')
      } catch (e) {
        this.processing = false
        const errors = e.response.data && e.response.data.details.errors
        let error = ''
        for (const i in errors) {
          error += errors[i][0] + '. '
        }
        this.$notify({
          text: error,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style></style>
