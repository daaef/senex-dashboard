<template>
  <div class="modal-box modal-box--border-grey">
    <div class="modal-box__header">
      <span class="close" @click="$emit('closeModal')"></span>
      <h3 class="heading-primary u-text-center u-mx-auto">
        Security verification
      </h3>
    </div>
    <div class="modal-box__body u-mb-40">
      <p class="u-text-center u-mb-40">
        Please enter your security key so we are sure it’s you.
      </p>
      <div class="input-box">
        <input v-model="secret" type="text" placeholder="Enter security key" />
      </div>
    </div>
    <div class="u-text-center">
      <BtnSpinner
        :is-in-active="secret.length < 3"
        :is-loading="processing"
        set-class="btn-full-width"
        value="Verify me"
        :on-submit="verifyAndTakeAction"
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
      processing: false,
    }
  },
  methods: {
    async verifyAndTakeAction() {
      this.processing = true
      try {
        const { data } = await this.$api.secretVerify({
          key: this.secret,
        })
        const key = this.secret
        this.$emit('action', key)
      } catch (error) {
        this.$notify({
          type: 'error',
          message: 'Invalid security key',
        })
      } finally {
        this.secret = ''
        this.processing = false
      }
    },
  },
}
</script>

<style></style>
