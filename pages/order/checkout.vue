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
                      :savedCryptoFiat="savedCryptoFiat"
                      @setNewRate="setNewRate"
                      @setIsRateChanged="setIsRateChanged"
                    />
                  </template>
                  <template v-else>
                    <!-- <Checkout /> -->
                    <template v-if="hasSaved">
                      <SavedCheckout @change-saved-to="changeSaved" />
                    </template>
                    <template v-else>
                      <!-- <Checkout /> -->
                      <template v-if="signedIn > 0">
                        <BeneficiaryBox @setNewRate="setNewRate" />
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
import {
  COOKIE_SAVED_CHECKOUT,
  COOKIE_SAVED_ORDER,
  COOKIE_SAVED_ORDER_REVIEW_BENEF,
  COOKIE_SAVED_RATE_OBJECT,
} from '~/data/constants'

export default {
  layout: 'order',
  head() {
    return {
      title: 'Checkout | SenexPay',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Continue your order.',
        },
      ],
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
        BTC_NGN: {
          buy: 0,
          sell: 0,
          USD_NGN: {
            buy: 0,
            sell: 0,
          },
          minimumOrder: {
            buy: 0,
            sell: 0,
          },
          disable: {
            buy: false,
            sell: false,
          },
        },
      },
      config: {
        platformFee: 0.7,
        platformFeeCap: 2,
      },
      savedCryptoFiat: {},
      timerID: 0,
    }
  },
  watch: {
    totalTime(oldVal, newVal) {
      if (Math.round(newVal / 1000) == 5) {
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
    },
  },
  beforeMount() {
    if (this.$store.state.auth.loggedIn) {
      this.$store.commit('order/setSignedIn', 2)
      // this.signedIn = true
    }
    const crypto_fiat = this.$cookiz.get(COOKIE_SAVED_RATE_OBJECT)
    this.savedCryptoFiat = crypto_fiat
    // this.limits = this.$cookiz.get('limpsqer')
    const order = this.$cookiz.get(COOKIE_SAVED_ORDER)
    let timeNow = new Date()
    if (!order) {
      this.$router.push('/order/start')
    }
    if (order) {
      if (order.expires < timeNow.getTime()) {
        this.$cookiz.remove(COOKIE_SAVED_CHECKOUT)
        this.$cookiz.remove(COOKIE_SAVED_ORDER)
        this.$cookiz.remove(COOKIE_SAVED_ORDER_REVIEW_BENEF)
        this.$router.push('/order/start')
      }
      const saved = this.$cookiz.get(COOKIE_SAVED_CHECKOUT)
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
        platformFeeCap: order.platformFeeCap,
      })

      const timeLeft = order.expires - timeNow.getTime()

      // console.log(timeLeft)

      this.$store.dispatch('order/setTotalTime', timeLeft)
      this.isLoading = false
    }

    //
  },
  computed: {
    ...mapState({
      order: (state) => state.order.orderDetail,
      totalTime: (state) => state.order.totalTime,
      signedIn: (state) => state.order.signedIn,
      showReview: (state) => state.order.showReview,
    }),
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
        this.config = data.config

        const thisCoin = this.order.cryptoCurrency
        const crypto_fiat = this.rates[`${thisCoin}_${this.order.fiatCurrency}`]
        const usd_fiat = crypto_fiat[`USD_${this.order.fiatCurrency}`]
        const cryptoValue =
          this.order.fiatAmount / crypto_fiat[this.order.orderType]
        this.newCryptoAmount = cryptoValue

        const cryptoFiatRate =
          crypto_fiat[this.order.orderType] / usd_fiat[this.order.orderType]

        this.newCryptoFiatRate = cryptoFiatRate
        if (
          this.totalTime <= 0 &&
          this.newCryptoFiatRate != 0 &&
          this.newCryptoFiatRate != this.order.cryptoFiatRate
        ) {
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
    },
  },
  beforeDestroy() {
    clearInterval(this.timerID)
  },
}
</script>

<style></style>
