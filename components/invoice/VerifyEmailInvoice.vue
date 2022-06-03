<template>
  <div class="checkout">
    <div class="invoice">
      <div class="invoice__header invoice__header--black invoice__header--new">
        <div class="invoice__title-box">
          <div class="invoice__title-heading">
            <span class="heading-primary">INVOICE</span>
            <span class="invoice__status">UNPAID</span>
          </div>
          <p class="paragraph paragraph--sm m-0 u-mb-5">
            Invoice No.:
            <span class="fw-700">{{ invoiceId }}</span>
          </p>
          <p
            class="paragraph paragraph--sm invoice__see-order p-0 m-0"
            @click="$emit('setShowReview', true)"
          >
            See my order details
          </p>
        </div>
        <CheckoutTimer :timeLeft="timeLeft" :isCheckout="false" />
      </div>
      <div class="invoice__body invoice__body--blur">
        <div class="u-d-flex">
          <span style="flex: 1" class="invoice__body-heading u-text-center"
            >EMAIL VERIFICATION</span
          >
          <span class="invoice__loader-box">
            <span class="invoice__loader-dot invoice__loader-dot--1"></span>
            <span class="invoice__loader-dot invoice__loader-dot--2"></span>
            <span class="invoice__loader-dot invoice__loader-dot--3"></span>
          </span>
        </div>
        <div class="invoice__body__content invoice__body__content--300">
          <img
            src="/img/email-verif.svg"
            alt="Success"
            class="invoice__success-img u-mb-10"
          />
          <p class="paragraph u-mb-40">
            Your payment details will be displayed here once you click on the
            verification link sent to
            <strong>{{ email }}</strong>
          </p>
          <p class="paragraph u-mb-30 u-color-grey707">
            Check in your promotions folder if you don’t see it in your inbox.
          </p>
          <p
            class="paragraph u-mb-30 u-pointer u-link-color"
            @click="resendActivation"
          >
            Resend verification email
          </p>
        </div>
        <div class="invoice__sell-instruct u-mb-20">
          <p class="paragraph paragraph--sm paragraph--600">
            Please do not refresh this page. We would automatically detect when
            you make your Crypto deposit.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      default: '',
    },
    timeLeft: {
      type: Number,
      default: 0,
    },
    invoiceId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      processing: false,
    }
  },
  methods: {
    async resendActivation() {
      const payload = {
        email: this.email,
      }
      this.processing = true
      try {
        await this.$api.reactivate(payload)
        // await this.$auth.fetchUser()
        this.processing = false
        this.$notify({
          type: 'success',
          text: 'Activation email successfully sent.',
        })
      } catch (error) {
        this.processing = false
        this.$notify({
          type: 'error',
          text: error.response.data.message,
        })
      }
    },
  },
}
</script>

<style></style>
