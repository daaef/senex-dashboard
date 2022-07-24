<template>
  <div class="modal-box modal-box--border-grey">
    <div class="modal-box__header">
      <span class="close" @click="$emit('closeModal')"></span>
      <h3 class="heading-primary u-text-center u-mx-auto">
        One more step to go
      </h3>
    </div>
    <div class="modal-box__body u-mb-40">
      <p class="u-text-center u-mb-40">Please enter your SenexPay password</p>
      <div class="input-box u-mb-20">
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
        />
      </div>
      <span v-if="invalidPassword"
        >Incorrect password. Double-check and try again.</span
      >
    </div>
    <div class="u-text-center">
      <BtnSpinner
        :is-in-active="false"
        :is-loading="processing"
        value="Finish"
        set-class="btn-full-width u-mb-20"
        :on-submit="onSubmit"
      />
      <span class="u-link">Forgot password?</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    processing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      password: '',
      invalidPassword: false,
    }
  },
  methods: {
    onSubmit() {
      this.invalidPassword = false
      const p = this.password
      this.$emit('action', p, (invalid) => {
        if (invalid) {
          this.invalidPassword = true
        }
        this.password = ''
      })
    },
  },
}
</script>

<style></style>
