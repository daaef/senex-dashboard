<template>
  <div class="checkout">
    <Checkout />
    <div class="checkout__body u-flex-1">
      <div class="u-mb-mini-medium">
        <p class="paragraph">
          Your transaction is saved. Click on “Continue” below to continue this
          transaction or click on “Cancel” to start a new one.
        </p>
      </div>
      <CheckoutButtonSet :down="true" :left="backBtn" :right="continueBtn" />
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'

import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
export default {
  data() {
    return {
      backBtn: {
        ...backBtn,
        value: 'Cancel',
        isInActive: false,
        onSubmit: () => {
          this.backToCalculator()
        },
      },
      continueBtn: {
        ...continueBtn,
        isInActive: false,
        onSubmit: () => {
          this.$cookiz.remove('ftyp5h2nl')
          this.$emit('change-saved-to', false)
        },
      },
    }
  },
  computed: {
    // ...mapState({
    //   order: state => state.order.orderDetail
    // })
  },
  methods: {
    backToCalculator() {
      // this.$emit('change-saved-to', false)
      this.$cookiz.remove('ftyp5h2nl') //a2snXbe
      this.$cookiz.remove('a2snXbe')
      // this.$store.commit('order/resetOrderDetail')
      this.$router.push('/order/start')
      // setTimeout(() => {

      // }, 3000)
    },
  },
}
</script>

<style></style>
