<template>
  <div>
    <div class="">
      <div class="order-main">
        <section class="order-main__left-container">
          <div class="order-main__left-content">
            <div class="">
              <!-- <Checkout /> -->
              <client-only>
                <div v-if="isLoading">
                  <OrderLoadingState />
                </div>
                <template v-else>
                  <template v-if="rateChanged">
                    <RateChange
                      :newCryptoAmount="newCryptoAmount"
                      :newCryptoFiatRate="newCryptoFiatRate"
                      :limits="limits"
                      @setNewRate="setNewRate"
                      @setIsRateChanged="setIsRateChanged"
                    />
                  </template>
                  <template v-else>
                    <!-- <Checkout /> -->
                    <template v-if="hasSaved">
                      <SavedCheckout
                        @change-saved-to="changeSaved"
                      />
                    </template>
                    <template v-else>
                      <!-- <Checkout /> -->
                      <template v-if="signedIn > 0">
                        <BeneficiaryBox
                          @setNewRate="setNewRate"
                        />
                      </template>
                      <template v-else>
                        <CheckoutHaveAccount
                          @change-signed-in-val-to="changeSignedIn"
                        />
                      </template>
                    </template>
                  </template>
                </template>
              </client-only>
              <!-- <BeneficiaryBox /> -->
            </div>
            <!-- <ListPopUp /> -->
            <!-- <SecretKey /> -->
            <!-- <PhoneVerification /> -->
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
import { mapState } from 'vuex'

export default {
  layout: 'order',
  head() {
    return {
      title: 'Checkout | SenexPay',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Continue your order.'
        }
      ]
    }
  },
  data() {
    return {
      hasSaved: false,
      isLoading: true,
      rateChanged: false,
      newCryptoAmount: 0,
      newCryptoFiatRate: 0,
      rates: {
        BTC_USD: { buy: 0, sell: 0},
        BTC_NGN: { buy: 0, sell: 0},
        BTC_ZAR: { buy: 0, sell: 0},
        USD_NGN: { buy: 0, sell: 0},
        USD_ZAR: { buy: 0, sell: 0}
      },
      limits: {
        disableBuy: false,
        minimumBuyUsd: 30,
        minimumSellUsd: 30,
        platformFee: 0,
        platformFeeCap: 0
      },
      timerID: 0
    }
  },
  watch: {
    totalTime(oldVal, newVal) {
      if (Math.round(newVal/1000) == 5) {
        this.timerID = setInterval(() => {
          this.getRates()
        }, 1000)
      }
      if (newVal == 0) {
        // console.log('ended')
      }
    },
    rateChanged(val) {
      if (val == true) {
        // const newOrder = {
        //   type: this.order.orderType,
        //   cryptoAmount: this.newCryptoAmount,
        //   cryptoFiatRate: this.newCryptoFiatRate,
        //   ...this.order
        // }

        // this.$cookiz.set('a2snXbe', newOrder)
      }
    }
  },
  beforeMount(){
    if (this.$store.state.auth.loggedIn) {
      this.$store.commit('order/setSignedIn', 2)
      // this.signedIn = true
    }
    this.limits = this.$cookiz.get('limpsqer')
    const order = this.$cookiz.get('a2snXbe')
    let timeNow = new Date()
    if (!order) {
      this.$router.push('/order/start')
    }
    if (order) {
      if (order.expires < timeNow.getTime()) {
        this.$cookiz.remove('ftyp5h2nl')
        this.$cookiz.remove('a2snXbe')
        this.$router.push('/order/start')
      }
      const saved = this.$cookiz.get('ftyp5h2nl')
      if (saved) {
        this.hasSaved = true
      }
      this.$store.commit('order/setOrderDetail', {
        cryptoAmount: order.cryptoAmount,
        cryptoCurrency: order.cryptoCurrency,
        fiatAmount: order.fiatAmount,
        fiatCurrency: order.fiatCurrency,
        fiatSymbol: order.fiatSymbol,
        // fiatName: order.fiatName,
        orderType: order.type,
        usdToFiat: order.usdToFiat,
        expires: order.expires,
        cryptoFiatRate: order.cryptoFiatRate,
        platformFee: order.platformFee,
        platformFeeCap: order.platformFeeCap
      })

      const timeLeft = (order.expires - timeNow.getTime())

      // console.log(timeLeft)

      this.$store.dispatch('order/setTotalTime', timeLeft)
      this.isLoading = false
    }
    
    //
  },
  computed: {
    ...mapState({
      order: state => state.order.orderDetail,
      totalTime: state => state.order.totalTime,
      signedIn: state => state.order.signedIn,
      showReview: state => state.order.showReview
    })
  },
  methods: {
    changeSaved(val) {
      this.hasSaved = val
    },
    changeSignedIn(val) {
      this.signedIn = val
    },
    setNewRate(val) {
      this.newCryptoAmount = val.newCryptoAmount
      this.newCryptoFiatRate = val.newCryptoFiatRate
      this.rateChanged = true
    },
    setIsRateChanged(val) {
      this.rateChanged = val
    },
    setTimeLeft(val) {
      this.$store.dispatch('order/setTotalTime', val)
    },
    async getRates() {
      // this.isLoading = true
      try {
        const { data } = await this.$api.getRates()
        this.rates = data
        // console.log(data)
        this.limits = data.config
        // this.isLoading = false

        const thisCoin = this.order.cryptoCurrency === 'USDT' ? 'USD' : this.order.cryptoCurrency
        const thisRateObj = this.rates[`${thisCoin}_${this.order.fiatCurrency}`]
        const cryptoValue = this.order.fiatAmount / thisRateObj[this.order.orderType]
        this.newCryptoAmount = cryptoValue

        const cryptoFiatRate = this.order.cryptoCurrency === 'USDT' ? 1 : this.rates['BTC_USD'][this.order.orderType]
        this.newCryptoFiatRate = cryptoFiatRate
        if (this.totalTime <= 0 && this.newCryptoFiatRate != 0 && this.newCryptoFiatRate != this.order.cryptoFiatRate) {
          this.rateChanged = true
        }

        if (this.totalTime <= 0 && this.rateChanged) {
          clearInterval(this.timerID)
        }

        // if (this.totalTime <= 0 && this.newCryptoFiatRate != 0) {
        //   clearInterval(this.timerID)
        // }
      } catch (err) {
        // this.getRates()
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timerID)
  }
}
</script>

<style></style>
