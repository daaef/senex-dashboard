<template>
  <div class="checkout checkout--no-min-height">
    <div class="invoice">
      <div class="invoice__header invoice__header--black invoice__header--new">
        <div class="invoice__title-box">
          <div class="invoice__title-heading">
            <span class="heading-primary">INVOICE</span>
            <span class="invoice__status paragraph--sm">UNPAID</span>
          </div>
          <p class="paragraph paragraph--sm m-0 u-mb-5">Invoice No.:
            <span class="paragraph--700">{{ invoiceId }}</span>
          </p>
          <p class="paragraph paragraph--sm invoice__see-order p-0 m-0"
            @click="$emit('setShowReview', true)">
            See my order details
          </p>
        </div>
        <CheckoutTimer :timeLeft="timeLeft" :isCheckout="false" />
      </div>
      <div class="invoice__body invoice__body--blur">
        <div class="invoice__body__content invoice__body__content--300">
          <div class="u-d-flex">
            <span class="invoice__loader-box">
              <span class="invoice__loader-dot invoice__loader-dot--1"></span>
              <span class="invoice__loader-dot invoice__loader-dot--2"></span>
              <span class="invoice__loader-dot invoice__loader-dot--3"></span>
            </span>
          </div>
          <img
            src="/img/eye-off.svg" alt="eye off"
            class="invoice__body__eye u-mb-mini-md u-mt-medium"
          />
          <p class="paragraph u-mb-medium u-text-center">
            Click the button below to display instructions on how to show your payment details here.
          </p>
          <div class="invoice__body__show-guide-btn-con">
            <ButtonSpinner
              :is-loading="false"
              :is-in-active="false"
              :on-submit="showInstruction"
              value="Show me instructions"
              setClass="invoice__body__show-guide-btn"
            />
          </div>
        </div>
        <!-- <div class="invoice__body--overlay">
          <div class="invoice__body__overlay-content">
            
          </div>     
        </div> -->
        <!-- <span class="invoice__body-heading">PAYMENT DETAILS</span>
        <div v-for="n in 5" :key="n" class="invoice__detail-item">
          <span class="invoice__detail-key">Bank Name</span>
          <span class="invoice__detail-value">Filler</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    invoiceId: {
      type: String,
      default: 0
    },
    timeLeft: {
      type: Number,
      default: 0
    }
  },
  methods: {
    showInstruction() {
      this.$store.commit('invoice/setGuideImage', 'payment1')
    }
  }
}
</script>

<style scoped>
.show-instruction-btn {
  background-color: #FFB91A;
  color: black !important;
}
</style>
