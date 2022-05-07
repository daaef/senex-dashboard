<template>
  <div>
    <div class="checkout checkout--no-min-height">
      <div class="invoice">
        <div class="invoice__header invoice__header--success">
          <div class="invoice__title-box">
            <div class="invoice__title-heading">
              <span class="heading-primary">INVOICE</span>
              <span class="invoice__status">PAID</span>
            </div>
            <p class="paragraph paragraph--sm m-0 u-mb-5">Invoice No.:
              <span class="paragraph--700">{{ orderID }}</span>
            </p>
            <p class="paragraph paragraph--sm invoice__see-order p-0 m-0"
              @click="$emit('setShowReview', true)">
              See my order details
            </p>
          </div>
          <!-- <CheckoutTimer :timeLeft="timeLeft" :isCheckout="false" /> -->
        </div>
        <div class="invoice__body">
          <div class="invoice__success-box">
            <span class="invoice__success-text">Thank you for making payment!</span>
            <img src="/img/celebration.svg" alt="Success" class="invoice__success-img">
            <h3 v-if="info.type == 'buy'" class="invoice__amount">{{ (info.fiatAmount + info.platformFee) | formatMoney(info.fiatCurrency) }}</h3>
            <h3 v-if="info.type == 'sell'" class="invoice__amount">{{ info.cryptoAmount }} {{ info.cryptoCurrency }}</h3>
          </div>

          <ButtonSpinner
            :is-loading="false"
            :is-in-active="false"
            value="Return to Home"
            background="#053888"
            :on-submit="() => this.$router.push('/')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import formatMoney from '~/filters/format-money'

export default {
  filters: { formatMoney },
  props: {
    timeLeft: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      orderID: state => state.invoice.orderID,
      info: state => state.invoice.info,
      paid: state => state.invoice.paid,
      step: state => state.invoice.step
    })
  }
}
</script>

<style>

</style>