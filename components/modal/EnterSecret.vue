<template>
  <div class="modal-box">
    <div class="modal-box__header">
      <span class="close" @click="$emit('closeModal')"></span>
      <h3 class="heading-primary u-text-center u-mx-auto">Extra Security</h3>
    </div>
    <div class="modal-box__body u-mb-40">
      <p class="u-text-center u-mb-40">
        Please enter your secret key to save the beneficiary.
      </p>
      <div class="input-box">
        <input v-model="secret" type="text" placeholder="Enter secret key" />
      </div>
    </div>
    <div class="u-text-center">
      <BtnSpinner
        :is-in-active="false"
        :is-loading="false"
        value="Verify code"
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
  },
  data() {
    return {
      secret: '',
    }
  },
}
</script>

<style></style>
