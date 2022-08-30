<template>
  <div>
    <div class="calc">
      <div class="calc__tab-box">
        <div
          class="calc__tab calc__tab--buy"
          :class="!buyTab ? 'calc__tab--buy-inactive' : ''"
          @click="switchBuy()"
        >
          Buy
        </div>
        <div
          class="calc__tab calc__tab--sell"
          :class="buyTab ? 'calc__tab--sell-inactive' : ''"
          @click="switchSell()"
        >
          Sell
        </div>
      </div>
      <div class="calc__intent-box">
        <span class="calc__intent-text"
          >I am {{ buyTab ? 'buying' : 'selling' }}</span
        >
        <div class="calc__intent-choice-box">
          <span
            class="calc__intent-choice-item"
            v-for="(coin, idx) in coins"
            :key="idx"
            :class="
              currentCoin.name === coin.name
                ? 'calc__intent-choice-item--active'
                : ''
            "
            @click="switchCoin(coin)"
          >
            <img
              :src="`/img/crypto/${coin.cur.toLowerCase()}.svg`"
              :alt="coin.name"
              class="calc__intent-choice-img"
            />
            <span class="calc__intent-text">{{ coin.name }}</span>
          </span>
          <span
            class="calc__glider"
            :class="[
              currentCoin.name == 'Bitcoin'
                ? 'calc__glider--1'
                : 'calc__glider--2',
            ]"
          ></span>
        </div>
      </div>
      <div class="calc__trade-box">
        <div class="calc__value-box">
          <div class="calc__value-title">
            <p>Enter {{ currentCoin.cur }} value</p>
          </div>
          <div class="calc__value-input-box">
            <input
              class="calc__value-input"
              v-model.number="computeCryptoAmount"
              type="number"
              step="any"
              min="0"
              @keydown="removeNegative"
            />
            <span class="calc__value-cur-text calc--dim">{{
              currentCoin.cur
            }}</span>
          </div>
        </div>
      </div>
      <div class="calc__trade-box">
        <div class="calc__value-box">
          <div class="calc__value-title">
            <p>Enter Fiat amount</p>
            <div class="calc__switch-cur-box">
              <span
                class="calc__switch-cur-item"
                :class="
                  currentFiat.cur === fiat.cur
                    ? 'calc__switch-cur-item--active'
                    : ''
                "
                v-for="(fiat, idx) in fiats"
                :key="idx"
                @click="switchFiat(fiat)"
                ><img
                  :src="`/img/flag/${fiat.cur.toLowerCase()}.svg`"
                  :alt="fiat.cur"
                  class="calc__switch-cur-img"
                /><span class="calc__switch-cur-item-text">{{
                  fiat.cur
                }}</span></span
              >
              <span
                class="calc__switch-cur-box__glider"
                :class="[
                  currentFiat.cur == 'NGN'
                    ? 'calc__switch-cur-box__glider--1'
                    : 'calc__switch-cur-box__glider--2',
                ]"
              ></span>
            </div>
          </div>
          <div class="calc__value-input-box">
            <input
              class="calc__value-input"
              v-model.number="computeFiatAmount"
              type="number"
              step="any"
              min="0"
              @keydown="removeNegative"
            />
            <span class="calc__value-cur-text calc--bold">{{
              currentFiat.symbol
            }}</span>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="u-px-10">
        <div class="calc__dollar-val-box" @click="onClickDollarField">
          <input
            class="calc__dollar-val calc__dollar-val--input"
            v-model.number="computeDollarAmount"
            type="number"
            step="any"
            min="0"
            @keydown="removeNegative"
          />
          <div class="calc__switch-cur-box calc__switch-cur-box--center">
            <span
              class="calc__switch-cur-item calc__switch-cur-item--active u-border-none u-no-pointer"
              ><img
                src="/img/flag/us.png"
                alt="US flag"
                class="calc__switch-cur-img"
              /><span class="calc__switch-cur-item-text">USD</span></span
            >
          </div>
        </div>
        <span
          v-if="dollarValueValidation()"
          class="calc__terms paragraph--sm u-text-left"
          style="color: red"
          >Please enter an amount not less than ${{ getMinimumOrder() }}</span
        >
      </div>
      <span class="calc__terms paragraph--sm"
        >By clicking the button below, you agree to SenexPay's
        <a :href="landingUrl + '/terms-of-service'" target="_blank"
          >terms and service</a
        ></span
      >
    </div>
    <ButtonSpinner
      :is-loading="isLoading"
      :is-in-active="isBtnDisabled()"
      :value="buyTab ? 'Continue Buying' : 'Continue Selling'"
      background="#053888"
      :on-submit="initializeOrder"
      setClass="u-mb-none"
    />
    <span class="calc__terms paragraph--sm u-mt-10"
      >SenexPay transactions fee is {{ config.platformFee }} percent pegged at
      ${{ config.platformFeeCap }}.
      <a :href="landingUrl + '/terms-of-service'" target="_blank">Learn more</a>
      about our fees.</span
    >
  </div>
</template>

<script>
import _ from 'lodash'
import { Money } from 'v-money'
import { flagByCurrency, flagByCountryCode } from '@/data/flags.js'
import coins from '@/data/coins.js'
import fiats from '@/data/fiats.js'
import { COOKIE_SAVED_ORDER, COOKIE_SAVED_RATE_OBJECT } from '~/data/constants'
export default {
  filters: {
    toCurrency(price) {
      return Intl.NumberFormat('en-US').format(price)
    },
  },
  components: {
    Money,
  },
  props: {
    isQueryBuy: {
      type: Boolean,
      default: false,
    },
    queryCoin: {
      type: String,
      default: 'btc',
    },
    queryCur: {
      type: String,
      default: 'ngn',
    },
  },
  data() {
    return {
      isLoading: false,
      landingUrl: '',
      computedCur: 'fiat',
      fiatAmount: '',
      cryptoAmount: '',
      dollarAmount: 0.0,
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
      buyTab: true,
      coins: coins,
      currentCoin: coins[0],
      fiats: fiats,
      currentFiat: fiats[0],
      flagByCurrency: flagByCurrency,
      flagByCountryCode: flagByCountryCode,
    }
  },
  beforeMount() {
    this.landingUrl = process.env.SENEX_LANDING_SITE_URL
    this.getRates()
  },
  mounted() {
    this.$store.commit('order/changeCurrentOrderStep', 1)
    this.buyTab = this.isQueryBuy
    const thisCoin = this.coins.find(
      (coin) => coin.cur.toLowerCase() === this.queryCoin
    )
    this.currentCoin = thisCoin || this.coins[0]
    const thisFiat = this.fiats.find(
      (fiat) => fiat.cur.toLowerCase() === this.queryCur
    )
    this.currentFiat = thisFiat || this.fiats[0]

    const orderType = this.buyTab ? 'Buy' : 'Sell'
    this.$ga.event({
      eventCategory: 'calculator-order-type-tab',
      eventAction: 'load-calculator',
      eventLabel: `${orderType} tab was selected when page loaded`,
      eventValue: 1,
    })
  },
  watch: {
    fiatAmount() {
      if (this.computedCur === 'fiat') {
        this.recalculateInputRates()
      }
    },

    cryptoAmount() {
      if (this.computedCur === 'crypto') {
        this.recalculateInputRates()
      }
    },
  },
  computed: {
    computeFiatAmount: {
      get() {
        const thisCoin = this.currentCoin.cur
        const crypto_fiat = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
        const usd_fiat = crypto_fiat[`USD_${this.currentFiat.cur}`]
        if (this.computedCur === 'crypto') {
          if (this.cryptoAmount === '') {
            return ''
          }
          const fiatValue = this.buyTab
            ? this.cryptoAmount * crypto_fiat['buy']
            : this.cryptoAmount * crypto_fiat['sell']
          return fiatValue.toFixed(2) || 0
        } else if (this.computedCur === 'dollar') {
          if (this.dollarAmount === '') {
            this.fiatAmount = 0
            return ''
          }
          const ans = this.buyTab
            ? this.dollarAmount * Number(usd_fiat['buy'])
            : this.dollarAmount * Number(usd_fiat['sell'])
          this.fiatAmount = ans.toFixed(2)
          return ans.toFixed(2)
        } else {
          return this.fiatAmount
        }
      },
      set(val) {
        this.computedCur = 'fiat'
        if (val === '') {
          // val = 0
          this.fiatAmount = val
          return
        }
        this.fiatAmount = parseFloat(val)
      },
    },
    computeCryptoAmount: {
      get() {
        const thisCoin = this.currentCoin.cur
        const crypto_fiat = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
        if (this.computedCur !== 'crypto') {
          if (this.fiatAmount <= 0 || this.fiatAmount === '') {
            return ''
          }
          const cryptoValue = this.buyTab
            ? this.fiatAmount / crypto_fiat['buy']
            : this.fiatAmount / crypto_fiat['sell']
          return cryptoValue.toFixed(8)
        } else {
          return this.cryptoAmount
        }
      },
      set(val) {
        this.computedCur = 'crypto'
        if (val === '') {
          this.cryptoAmount = val
          return
        }
        this.cryptoAmount = parseFloat(val)
      },
    },
    computeDollarAmount: {
      get() {
        return this.getDollarAmount()
      },
      set(val) {
        this.computedCur = 'dollar'
        if (val === '') {
          this.dollarAmount = val
          return
        }
        val = val.toFixed(2)
        this.dollarAmount = val
      },
    },
  },
  methods: {
    dollarValueValidation() {
      const thisCoin = this.currentCoin.cur
      const crypto_fiat = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
      let type = this.buyTab ? 'buy' : 'sell'
      return (
        this.computeFiatAmount > 0 &&
        Number(crypto_fiat['minimumOrder'][type]) > this.computeDollarAmount
      )
    },
    getMinimumOrder() {
      const thisCoin = this.currentCoin.cur
      const crypto_fiat = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
      const type = this.buyTab ? 'buy' : 'sell'
      return Number(crypto_fiat['minimumOrder'][type])
    },
    onClickDollarField() {
      this.$ga.event({
        eventCategory: 'Calculator dollar field',
        eventAction: 'click-dollar-input',
        eventLabel: 'Dollar input clicked',
        eventValue: 1,
      })
    },
    switchBuy() {
      this.buyTab = true
      this.$ga.event({
        eventCategory: 'Calculator order type tab',
        eventAction: 'click-order-type-tab',
        eventLabel: 'Buy tab was clicked',
        eventValue: 1,
      })
    },
    switchSell() {
      this.buyTab = false
      this.$ga.event({
        eventCategory: 'Calculator order type tab',
        eventAction: 'click-order-type-tab',
        eventLabel: 'Sell tab was clicked',
        eventValue: 1,
      })
    },
    switchCoin(coin) {
      this.currentCoin = coin

      this.$ga.event({
        eventCategory: 'Calculator coin selection',
        eventAction: 'click-coin',
        eventLabel: `${coin.cur} tab clicked`,
        eventValue: 1,
      })
    },
    switchFiat(fiat) {
      this.currentFiat = fiat

      this.$ga.event({
        eventCategory: 'Calculator fiat selection',
        eventAction: 'click-coin',
        eventLabel: `${fiat.cur} tab clicked`,
        eventValue: 1,
      })
    },
    continueToCheckout() {
      this.$router.push('/order/checkout')
    },
    cryptoDisabled() {
      const thisCoin = this.currentCoin.cur
      const crypto_fiat = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
      const type = this.buyTab ? 'buy' : 'sell'
      return crypto_fiat['disable'][type]
    },
    recalculateInputRates: _.debounce(function () {
      this.getRates()
    }, 1000),
    async getRates() {
      try {
        const { data } = await this.$api.getRates()
        this.rates = data
        this.config = data.config
      } catch (err) {
        // this.getRates()
      }
    },
    getDollarAmount() {
      if (this.computeFiatAmount === '' || this.computeFiatAmount <= 0) {
        return ''
      }
      if (this.computedCur === 'dollar') {
        return this.dollarAmount
      }

      const thisCoin = this.currentCoin.cur
      const crypto_fiat = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
      const usd_fiat = crypto_fiat[`USD_${this.currentFiat.cur}`]
      const usdValue = this.buyTab
        ? this.computeFiatAmount / Number(usd_fiat['buy'])
        : this.computeFiatAmount / Number(usd_fiat['sell'])
      return usdValue.toFixed(2)
    },
    removeNegative(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode
      if (charCode == 189) {
        evt.preventDefault()
      }
    },
    toCurrencyM(price) {
      return Intl.NumberFormat('en-US').format(price)
    },
    isBtnDisabled() {
      if (this.cryptoDisabled()) {
        return true
      }
      return this.getDollarAmount() < this.getMinimumOrder()
    },
    isNumber(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46 &&
        charCode != 190
      ) {
        evt.preventDefault()
      }
    },
    async initializeOrder() {
      try {
        this.isLoading = true
        const thisCoin = this.currentCoin.cur
        const crypto_fiat = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
        const type = this.buyTab ? 'buy' : 'sell'
        const usd_fiat = crypto_fiat[`USD_${this.currentFiat.cur}`]
        const token = await this.$recaptcha.execute(COOKIE_SAVED_ORDER)
        const crypto_usd = crypto_fiat[type] / usd_fiat[type]

        const rateObj = crypto_fiat

        const usdToFiat = usd_fiat
        const order = {
          type,
          cryptoFiatRate: crypto_usd,
          recaptcha: token,
          usdToFiat,
          cryptoAmount: this.computeCryptoAmount,
          cryptoCurrency: this.currentCoin.cur,
          fiatAmount: this.computeFiatAmount,
          fiatSymbol: this.currentFiat.symbol,
          fiatCurrency: this.currentFiat.cur,
          expires: new Date().getTime() + 900000,
          platformFee: this.config.platformFee,
          platformFeeCap: this.config.platformFeeCap,
        }

        this.$cookiz.set(COOKIE_SAVED_ORDER, order)
        this.$cookiz.set(COOKIE_SAVED_RATE_OBJECT, rateObj)
        this.$cookiz.set('limpsqer', this.limits)
        
        this.isLoading = false
        this.$ga.event({
          eventCategory: 'Calculator continue button',
          eventAction: 'click-continue-order-btn',
          eventLabel: `${this.buyTab ? 'Buy' : 'Sell'} ${this.currentCoin.cur}`,
          eventValue: this.computeCryptoAmount,
        })
        this.$router.push('/order/checkout')
      } catch (e) {
        // console.log(e)
      }
    },
  },
}
</script>

<style></style>
