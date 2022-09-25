<template>
  <div>
    <div v-if="isLoading">
      <OrderLoadingState />
    </div>
    <div v-else class="">
      <div class="order-main">
        <section class="order-main__left-container">
          <div class="order-main__left-content">
            <TradeCalculator
              :queryCoin="queryCoin"
              :isQueryBuy="isQueryBuy"
              :queryCur="queryCur"
            />
            <!-- <OrderLimitExceeded /> -->
          </div>
        </section>
        <section class="order-main__right-container">
          <div class="order-main__right-content">
            <TradeStep />
            <!-- <CompleteKYC /> -->
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import {
  COOKIE_SAVED_CHECKOUT,
  COOKIE_SAVED_ORDER,
  COOKIE_SAVED_ORDER_REVIEW_BENEF,
} from '~/data/constants'
export default {
  layout: 'order',
  auth: 'false',
  async beforeMount() {
    const savedOrder = await this.$cookiz.get(COOKIE_SAVED_ORDER)
    if (savedOrder) {
      this.$cookiz.set(COOKIE_SAVED_CHECKOUT, true)
      this.$cookiz.remove(COOKIE_SAVED_ORDER_REVIEW_BENEF)
      this.$router.push('/order/checkout')
      // this.isLoading = false
    } else {
      this.isLoading = false
    }
  },
  mounted() {
    // console.log(this.$route.query)
    if (this.$route.query && this.$route.query.order != '') {
      this.queryCoin = this.$route.query.order
    } else {
      this.queryCoin = 'btc'
    }
    if (this.$route.query && this.$route.query.type == 'sell') {
      this.isQueryBuy = false
    }
    if (this.$route.query && this.$route.query.cur != '') {
      this.queryCur = this.$route.query.cur
    } else {
      this.queryCur = 'ngn'
    }
  },
  head() {
    return {
      title: 'Start Trading | SenexPay',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Your hassle free checkout begins here at SenexPay. Buy & Sell Bitcoin and USDT in minutes from anywhere.',
        },
      ],
      link: [
        { rel: 'canonical', href: 'https://app.senexpay.com/order/start' },
      ],
    }
  },
  data() {
    return {
      isLoading: true,
      isQueryBuy: true,
      queryCoin: 'btc',
      queryCur: 'ngn',
    }
  },
}
</script>

<style></style>
