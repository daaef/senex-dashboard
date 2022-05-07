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
          <!-- <span class="calc__intent-choice-item">
            <img
              src="/img/t-coin.svg"
              alt="BTC"
              class="calc__intent-choice-img"
            />
            <span class="calc__intent-text">USDT</span>
          </span> -->
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
            <!-- <money
              v-model="computeCryptoAmount"
              v-bind="{
                decimal: '.',
                thousands: ',',
                prefix: '',
                suffix: '',
                precision: 8,
                masked: false
              }"
              min="0"
              name="crypto"
              class="calc__value-input"
            ></money> -->
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
              <!-- <span class="calc__switch-cur-item calc__switch-cur-item--active"
                ><img src="/img/south-africa.svg" alt="South Africa" class="calc__switch-cur-img">ZAR</span
              > -->
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
            <!-- <money
              v-model="computeFiatAmount"
              v-bind="{
                decimal: '.',
                thousands: ',',
                prefix: '',
                suffix: '',
                precision: 2,
                masked: false
              }"
              min="0"
              name="fiat"
              class="calc__value-input"
            ></money> -->
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
          <!-- <money
            v-model="computeDollarAmount"
            v-bind="{
              decimal: '.',
              thousands: ',',
              prefix: '',
              suffix: '',
              precision: 2,
              masked: false
            }"
            min="0"
            name="fiat"
            class="calc__dollar-val calc__dollar-val--input"
          ></money> -->
          <!-- <span class="calc__dollar-val">{{ getDollarAmount() }}</span> -->
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
          <!-- <img src="/img/dollar-badge.svg" alt="dollar" class="calc__dollar-badge" /> -->
        </div>
        <span
          v-if="dollarValueValidation()"
          class="calc__terms paragraph--sm u-text-left"
          style="color: red"
          >Please enter an amount not less than ${{
            buyTab ? limits.minimumBuyUsd : limits.minimumSellUsd
          }}</span
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
      >SenexPay transactions fee is {{ limits.platformFee }} percent pegged at
      ${{ limits.platformFeeCap }}.
      <a :href="landingUrl + '/terms-of-service'" target="_blank">Learn more</a>
      about our fees.</span
    >
  </div>
</template>

<script>
import _ from 'lodash'
import { Money } from 'v-money'
import { flagByCurrency, flagByCountryCode } from '@/data/flags.js'
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
        BTC_USD: { buy: 0, sell: 0 },
        BTC_NGN: { buy: 0, sell: 0 },
        BTC_ZAR: { buy: 0, sell: 0 },
        USD_NGN: { buy: 0, sell: 0 },
        USD_ZAR: { buy: 0, sell: 0 },
      },
      limits: {
        disableBuy: false,
        minimumBuyUsd: 30,
        minimumSellUsd: 30,
        platformFee: 0.7,
        platformFeeCap: 2,
      },
      buyTab: true,
      coins: [
        {
          name: 'Bitcoin',
          cur: 'BTC',
          flag: '/img/btc.svg',
        },
        {
          name: 'USDT',
          cur: 'USDT',
          flag: '/img/usdt.svg',
        },
      ],
      currentCoin: {
        name: 'Bitcoin',
        cur: 'BTC',
        flag: '/img/btc.svg',
      },
      fiats: [
        {
          cur: 'NGN',
          symbol: '₦',
          flag: '/img/nigeria.svg',
        },
        {
          cur: 'ZAR',
          symbol: 'R',
          flag: '/img/south-africa.svg',
        },
      ],
      currentFiat: {
        cur: 'NGN',
        symbol: '₦',
        flag: '/img/nigeria.svg',
      },
      flagByCurrency: flagByCurrency,
      flagByCountryCode: flagByCountryCode,
    }
  },
  beforeMount() {
    this.landingUrl = process.env.SENEX_LANDING_SITE_URL
    this.getRates()
    // this.$store.dispatch('order/startTimer', 400)
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
    // console.log(this.currentCoin, this.queryCoin)
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
        if (this.computedCur === 'crypto') {
          // return this.fiatAmount
          if (this.cryptoAmount === '') {
            return ''
          }

          const thisCoin =
            this.currentCoin.cur === 'USDT' ? 'USD' : this.currentCoin.cur
          const thisRateObj = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
          const fiatValue = this.buyTab
            ? this.cryptoAmount * thisRateObj['buy']
            : this.cryptoAmount * thisRateObj['sell']
          return fiatValue.toFixed(2) || 0
        } else if (this.computedCur === 'dollar') {
          if (this.dollarAmount === '') {
            this.fiatAmount = 0
            return ''
          }
          const usd = 'USD'
          const thisRateObj = this.rates[`${usd}_${this.currentFiat.cur}`]
          const ans = this.buyTab
            ? this.dollarAmount * thisRateObj['buy']
            : this.dollarAmount * thisRateObj['sell']
          this.fiatAmount = ans.toFixed(2)
          // console.log(this.toCurrency(ans))
          // return this.toCurrencyM(ans)
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
        if (this.computedCur !== 'crypto') {
          // return this.fiatAmount
          if (this.fiatAmount <= 0 || this.fiatAmount === '') {
            return ''
          }
          const thisCoin =
            this.currentCoin.cur === 'USDT' ? 'USD' : this.currentCoin.cur
          const thisRateObj = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
          const cryptoValue = this.buyTab
            ? this.fiatAmount / thisRateObj['buy']
            : this.fiatAmount / thisRateObj['sell']
          return cryptoValue.toFixed(8)
        } else {
          return this.cryptoAmount
        }
      },
      set(val) {
        this.computedCur = 'crypto'
        if (val === '') {
          // val = 0
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
      if (this.buyTab) {
        return (
          this.computeFiatAmount > 0 &&
          this.limits.minimumBuyUsd > this.computeDollarAmount
        )
      } else {
        return (
          this.computeFiatAmount > 0 &&
          this.limits.minimumSellUsd > this.computeDollarAmount
        )
      }
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
      const capitalizedCrypto = this.currentCoin.cur
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
      return this.buyTab && this.limits[`disableBuy${capitalizedCrypto}`]
    },
    recalculateInputRates: _.debounce(function () {
      this.getRates()
    }, 1000),
    async getRates() {
      // this.isLoading = true
      try {
        const { data } = await this.$api.getRates()
        this.rates = data
        // console.log(data)
        this.limits = data.config
        // this.isLoading = false
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
      const usd = 'USD'
      const thisRateObj = this.rates[`${usd}_${this.currentFiat.cur}`]
      const usdValue = this.buyTab
        ? this.computeFiatAmount / thisRateObj['buy']
        : this.computeFiatAmount / thisRateObj['sell']
      return usdValue.toFixed(2)
    },
    removeNegative(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode
      // console.log(charCode)
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
      if (this.buyTab && this.getDollarAmount() >= this.limits.minimumBuyUsd) {
        return false
      } else if (
        this.buyTab == false &&
        this.getDollarAmount() >= this.limits.minimumSellUsd
      ) {
        return false
      }
      return true
    },
    isNumber(evt) {
      // const reg = /^\d*\.?\d*$/
      // console.log(evt.target.value.toString(), reg.test(evt.target.value))
      // if (reg.test(evt.target.value.toString(),)) {
      //   //evt.preventDefault()
      // } else {
      //   evt.preventDefault()
      // }
      const charCode = evt.which ? evt.which : evt.keyCode
      // console.log(charCode)
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
        const token = await this.$recaptcha.execute('a2snXbe')
        const type = this.buyTab ? 'buy' : 'sell'

        //const cryptoFiatRate = this.currentCoin.cur === 'BTC' ? this.rates.BTC_USD[type] : 1 [`${thisCoin}_${this.currentFiat.cur}`]
        // const cryptoFiatRate = this.currentCoin.cur === 'USDT' ? 1 : this.rates[`${this.currentCoin.cur}_${this.currentFiat.cur}`][type]
        const cryptoFiatRate =
          this.currentCoin.cur === 'USDT' ? 1 : this.rates['BTC_USD'][type]

        // console.log('fiatrate', cryptoFiatRate)
        //const fiatRates = {}
        // const rateKeys = Object.keys(this.rates).filter((x) => s.startsWith('USD'))
        const rateObj = Object.fromEntries(
          Object.entries(this.rates).filter(([key, value]) =>
            key.startsWith('USD')
          )
        )

        const usdToFiat = rateObj[`USD_${this.currentFiat.cur}`]

        //Object.assign(fiatRates, rateObj)
        const order = {
          type,
          cryptoFiatRate,
          recaptcha: token,
          usdToFiat,
          cryptoAmount: this.computeCryptoAmount,
          cryptoCurrency: this.currentCoin.cur,
          fiatAmount: this.computeFiatAmount,
          fiatSymbol: this.currentFiat.symbol,
          fiatCurrency: this.currentFiat.cur,
          expires: new Date().getTime() + 900000,
          platformFee: this.limits.platformFee,
          platformFeeCap: this.limits.platformFeeCap,
        }

        this.$cookiz.set('a2snXbe', order)
        this.$cookiz.set('eJ6Ydkmr035', rateObj)
        this.$cookiz.set('limpsqer', this.limits)

        // console.log(this.$cookiz.get('eJ6Ydkmr035'))
        this.isLoading = false
        this.$ga.event({
          eventCategory: 'Calculator continue button',
          eventAction: 'click-continue-order-btn',
          eventLabel: `${this.buyTab ? 'Buy' : 'Sell'} ${this.currentCoin.cur}`,
          eventValue: this.computeCryptoAmount,
        })
        this.$router.push('/order/checkout')

        // setTimeout(() => {

        // }, 3000)
      } catch (e) {
        // console.log(e)
      }
    },
  },
}
</script>

<style></style>
