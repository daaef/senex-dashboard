<template>
  <div class="modal-box modal-box--border-grey">
    <div class="modal-box__header">
      <span class="close" @click="$emit('closeModal')"></span>
      <h3 class="heading-primary u-text-center u-mx-auto">
        Phone verification
      </h3>
    </div>
    <div class="modal-box__body u-mb-40">
      <p class="u-text-center u-mb-40">
        Please enter the 6-digit code sent to {{ mobile }}
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
        value="Verify mobile"
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
  methods: {
    async onSubmit() {
      this.processing = true
      const payload = {
        email: this.email,
        code: this.code,
      }
      try {
        this.$emit('closeModal')
      } catch (error) {
        console.log(error)
      } finally {
        this.processing = false
      }
    },
    async resendCode() {
      const payload = {
        email: this.email,
        mobile: this.mobile,
      }
      this.$axios
        .post('/verify/credentials', payload)
        .then((res) => {
          const pin = res.data.details.data.pinId
          localStorage.setItem('pinId', pin)
        })
        .catch((err) => {
          const {
            response: { data },
          } = err
          this.$notify({
            type: 'error',
            text: data.message, // error.response.data.message
          })
          return
        })
    },
  },
}
</script>

<style></style>
