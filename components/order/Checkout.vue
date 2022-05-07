<template>
  <div class="chkout-card" :class="[!isOpen ? '' : 'chkout-card--open']">
    <span
      class="chkout-card__arrow-box"
      :class="[!isOpen ? '' : 'chkout-card__arrow-box--close']"
      @click="toggleOpen"
    >
      <img src="/img/checkout-arrow-small.svg" alt="arrow down" />
    </span>
    <div class="chkout-card__header u-mb-8">
      <h3 class="chkout-card__header-title">CHECKOUT</h3>
      <span class="chkout-card__order-type"
        >&uarr;{{ order.orderType == 'buy' ? 'Buy' : 'Sell' }}</span
      >
      <CheckoutTimer :timeLeft="totalTime" @setTimeLeft="setTimeLeft" />
      <!-- <div class="chkout-card__header-time-box">
        <img
          src="/img/stopwatch.svg"
          alt="clock"
          class="chkout-card__header-clock"
        />
        <span class="chkout-card__header-time">{{ minutes }} : {{ seconds }}</span>
      </div> -->
    </div>
    <div
      class="chkout-card__body"
      :class="isOpen ? 'chkout-card__body--open' : ''"
    >
      <div class="chkout-card__detail-item">
        <span class="chkout-card__detail-key">Assets</span>
        <span>{{ order.cryptoAmount }} {{ order.cryptoCurrency }}</span>
      </div>
      <div class="chkout-card__detail-item">
        <span class="chkout-card__detail-key">Price</span>
        <span>{{ order.fiatAmount | formatMoney(order.fiatCurrency) }}</span>
      </div>
      <div class="chkout-card__detail-item">
        <span class="chkout-card__detail-key">Eqv.</span>
        <!-- <span>N 475/$</span> -->
        <span>{{
          (order.fiatAmount / order.usdToFiat[order.orderType]).toFixed(2)
            | formatMoney('USD')
        }}</span>
      </div>
      <div class="chkout-card__detail-item">
        <span class="chkout-card__detail-key">Ex. Rate</span>
        <!-- <span>$12,560</span> -->
        <span
          >{{ order.fiatSymbol }}{{ order.usdToFiat[order.orderType] }}/$</span
        >
        <span class="chkout-card__detail-coin-value">
          <img
            :src="`/img/crypto/${order.cryptoCurrency.toLowerCase()}.svg`"
            alt="btc"
            class="chkout-card__detail-coin-img"
          />
          <span>{{ oneCryptoToDollar() | formatMoney('USD') }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import formatMoney from '~/filters/format-money'
// import { state } from '~/store'

export default {
  data() {
    return {
      // isOpen: false
    }
  },
  filters: { formatMoney },
  computed: {
    minutes: function () {
      const minutes = Math.floor(this.totalTime / 60)
      return this.padTime(minutes)
    },
    seconds: function () {
      const seconds = Math.floor(this.totalTime - this.minutes * 60)
      return this.padTime(seconds)
    },
    ...mapState({
      order: (state) => state.order.orderDetail,
      totalTime: (state) => state.order.totalTime,
      isOpen: (state) => state.order.isCheckoutCardOpen,
    }),
  },
  methods: {
    setTimeLeft(val) {
      this.$store.dispatch('order/setTotalTime', val)
    },
    padTime(time) {
      return (time < 10 ? '0' : '') + time
    },
    oneCryptoToDollar() {
      const val = (
        this.order.fiatAmount /
        this.order.usdToFiat[this.order.orderType] /
        this.order.cryptoAmount
      ).toFixed(2)

      return val
    },
    toggleOpen() {
      this.$store.commit('order/setIsCheckoutCardOpen', !this.isOpen)
    },
  },
}
</script>

<style></style>
