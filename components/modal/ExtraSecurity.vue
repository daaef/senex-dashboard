<template>
  <div class="modal-box">
    <div class="modal-box__header">
      <img
        class="close"
        src="/img/icons/close_round_modal_icon.svg"
        alt="close"
        @click="$emit('closeModal')"
      />
      <!-- <span class="close" @click="$emit('closeModal')"></span> -->
      <h3 class="heading-primary u-text-center u-mx-auto">Extra Security</h3>
    </div>
    <div class="modal-box__body u-mb-40">
      <p class="u-text-center u-mb-40">
        Please enter the 6-digit code sent to abay…@gmail.com to continue
      </p>
      <div class="input-box u-mb-20">
        <input v-model="code" type="text" placeholder="Enter code" />
      </div>
      <div class="u-text-right">
        <span class="resend-badge"
          ><span class="resend">Resend code </span>in 00:59</span
        >
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
      code: '',
    }
  },
}
</script>

<style></style>
