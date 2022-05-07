<template>
  <div>
    <div v-if="isLoading">
      <OrderLoadingState />
    </div>
    <div v-else class="">
      <div class="order-main">
        <section class="order-main__left-container">
          <div class="order-main__left-content">
            <TradeCalculator :queryCoin="queryCoin" :isQueryBuy="isQueryBuy" :queryCur="queryCur" />
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
export default {
  layout: 'order',
  async beforeMount() {
    const savedOrder = await this.$cookiz.get('a2snXbe')
    if (savedOrder) {
      this.$cookiz.set('ftyp5h2nl', true)
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
          content: 'Your hassle free checkout begins here at SenexPay. Buy & Sell Bitcoin and USDT in minutes from anywhere.'
        }
      ],
      link: [{ rel: 'canonical', href: 'https://app.senexpay.com/order/start' }]
    }
  },
  data() {
    return {
      isLoading: true,
      isQueryBuy: true,
      queryCoin: 'btc',
      queryCur: 'ngn'
    }
  }
}
</script>

<style></style>
