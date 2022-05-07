<template>
  <div class="checkout">
    <div class="checkout__body">
      <div class="">
        <div class="rate-change-header">
          <div class="rate-change-header__alarm">
            <img src="/img/alarm.svg" alt="alarm" />
          </div>
          <CheckoutTimer :timeLeft="totalTime" />
        </div>
        <h3 class="heading-primary u-my-small">Rate Change!</h3>
        <p class="paragragh u-text-left u-mb-mini-medium">
          BTC rate just changed from
          <strong>{{ oldCryptoFiatRate | formatMoney('USD') }}</strong> to
          <strong>{{ newCryptoFiatRate | formatMoney('USD') }}</strong
          >. See your new transaction value below, you can edit it before you
          continue if you wish.
        </p>

        <label class="paragraph" for="cryptoValue">New BTC Value</label>
        <div class="o-form__input-box">
          <input
            name="cryptoValue"
            v-model.number="computeCryptoAmount"
            type="number"
            step="any"
            min="0"
            class="o-form__input"
            @keydown="removeNegative"
          />
        </div>

        <label class="paragraph" for="fiatAmount">What you are paying</label>
        <div class="o-form__input-box">
          <input
            name="fiatAmount"
            v-model.number="computeFiatAmount"
            type="number"
            step="any"
            min="0"
            @keydown="removeNegative"
            class="o-form__input"
          />
          <span class="calc--bold shift-left u-abs-center-vertical">{{
            order.fiatSymbol
          }}</span>
        </div>

        <div class="u-mb-medium">
          <div class="calc__dollar-val-box">
            <input
              class="calc__dollar-val calc__dollar-val--input u-px-0"
              v-model.number="computeDollarAmount"
              type="number"
              step="any"
              min="0"
              @keydown="removeNegative"
            />
            <!-- <span class="calc__dollar-val">{{ getDollarAmount() }}</span> -->
            <!-- <img src="/img/dollar-badge.svg" alt="dollar" class="calc__dollar-badge" /> -->
            <div class="calc__switch-cur-box calc__switch-cur-box--center">
              <span
                class="calc__switch-cur-item calc__switch-cur-item--active u-border-none u-no-pointer"
                ><img
                  src="/img/usa-flag.png"
                  alt="US flag"
                  class="calc__switch-cur-img"
                /><span class="calc__switch-cur-item-text">USD</span></span
              >
            </div>
          </div>
        </div>
        <div class="checkout__btn-box">
          <div class="rate-change-header__cancel">
            <span @click="cancelTransaction">Cancel Transaction</span>
            <span id="tp-1" class="u-info-icon" data-toggle="tooltip">i</span>
            <b-tooltip
              target="tp-1"
              title="For your security, trades above $50 are required to sign up before check- out.!"
              placement="right"
              variant="light"
            >
            </b-tooltip>
          </div>
          <div class="checkout__btn">
            <ButtonSpinner
              value="Continue"
              :background="continueBtn.background"
              :color="continueBtn.color"
              :is-loading="processing"
              :on-submit="onSubmit"
              :is-in-active="isBtnDisabled()"
              setClass="u-mb-none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import continueBtn from '@/data/defaultContinueButton.js'
import formatMoney from '~/filters/format-money'

export default {
  props: {
    newCryptoAmount: {
      type: Number,
      default: 0,
    },
    newCryptoFiatRate: {
      type: Number,
      default: 0,
    },
    limits: {
      type: Object,
      default: () => ({
        disableBuy: false,
        minimumBuyUsd: 30,
        minimumSellUsd: 30,
      }),
    },
  },
  filters: { formatMoney },
  data() {
    return {
      // cryptoValue: this.newCryptoAmount,
      // fiatAmount: this.newFiatRate,
      processing: false,
      isFiatComputed: true,
      fiatAmount: 0,
      cryptoAmount: this.newCryptoAmount.toFixed(8),
      dollarAmount: this.newCryptoAmount.toFixed(8) * this.newCryptoFiatRate,
      oldCryptoFiatRate: 0,
      continueBtn: continueBtn,
    }
  },
  mounted() {
    this.oldCryptoFiatRate = this.order.cryptoFiatRate
  },
  computed: {
    ...mapState({
      order: (state) => state.order.orderDetail,
      placeOrderPayload: (state) => state.order.placeOrder,
      hasTriedPlacingOrder: (state) => state.order.hasTriedPlacingOrder,
      totalTime: (state) => state.order.totalTime,
      // signedIn: state => state.order.signedIn,
      // showReview: state => state.order.showReview
    }),
    computeFiatAmount: {
      get() {
        if (this.isFiatComputed) {
          // return this.fiatAmount
          if (this.cryptoAmount === '') {
            return ''
          }

          // const thisCoin = this.currentCoin.cur === 'USDT' ? 'USD' : this.currentCoin.cur
          // const thisRateObj = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
          const fiatValue =
            this.cryptoAmount *
            this.newCryptoFiatRate *
            this.order.usdToFiat[this.order.orderType]
          return fiatValue.toFixed(2) || 0
        } else {
          return this.fiatAmount
        }
      },
      set(val) {
        this.isFiatComputed = false
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
        if (!this.isFiatComputed) {
          // return this.fiatAmount
          if (this.fiatAmount <= 0 || this.fiatAmount === '') {
            return ''
          }
          // const thisCoin = this.currentCoin.cur === 'USDT' ? 'USD' : this.currentCoin.cur
          // const thisRateObj = this.rates[`${thisCoin}_${this.currentFiat.cur}`]
          const cryptoValue =
            this.fiatAmount /
            this.order.usdToFiat[this.order.orderType] /
            this.newCryptoFiatRate
          return cryptoValue.toFixed(8)
        } else {
          return this.cryptoAmount
        }
      },
      set(val) {
        this.isFiatComputed = true
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
        if (this.computeCryptoAmount === '') {
          return ''
        }
        return this.getDollarAmount()
      },
      set(val) {
        // this.isFiatComputed = false
        if (val === '') {
          this.fiatAmount = ''
          return
        }
        val = val.toFixed(2)
        // const type = this.buyTab ? 'buy' : 'sell'
        // const cryptoFiatRate = this.currentCoin.cur === 'USDT' ? 1 : this.rates['BTC_USD'][type]
        // this.computeCryptoAmount =  (val / cryptoFiatRate).toFixed(8)

        // const usd = 'USD'
        // const thisRateObj = this.rates[`${usd}_${this.currentFiat.cur}`]
        const rate = this.order.usdToFiat[this.order.orderType]
        const ans = val * rate
        this.computeFiatAmount = ans.toFixed(2)
      },
    },
  },
  methods: {
    getDollarAmount() {
      if (this.computeFiatAmount === '' || this.computeFiatAmount <= 0) {
        return 0
      }
      const usdValue =
        this.computeFiatAmount / this.order.usdToFiat[this.order.orderType]
      return usdValue.toFixed(2)
    },
    removeNegative(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode
      // console.log(charCode)
      if (charCode == 189) {
        evt.preventDefault()
      }
    },
    async placeOrderAsync(payloadA) {
      this.processing = true
      try {
        const { data } = await this.$api.postTrade(payloadA)
        setTimeout(() => {
          // this.openModal = false
          this.$router.push(`/invoice/${data.id}`)
        })
        // this.terminateSession()
      } catch (e) {
        const errorR = e.response

        if (errorR && errorR.status === 406) {
          if (
            errorR.data.message &&
            errorR.data.message.includes('Rates have changed!')
          ) {
            const val = {
              newCryptoAmount: errorR.data.cryptoAmount,
              newCryptoFiatRate: errorR.data.cryptoFiatRate,
            }
            this.$store.commit('order/changeLoading', { show: false, text: '' })
            this.$emit('setNewRate', val)
          }
        }

        this.$notify({
          type: 'error',
          text: errorR.data.message,
        })
      } finally {
        this.$store.commit('order/changeLoading', { show: false, text: '' })
        this.processing = false
      }
    },
    onSubmit() {
      if (this.hasTriedPlacingOrder) {
        //   payloadA.fiatAmount = parseFloat(payload.fiatAmount)
        // payloadA.cryptoAmount = parseFloat(payload.cryptoAmount)
        const payload = {
          ...this.placeOrderPayload,
          fiatAmount: this.computeFiatAmount,
          cryptoAmount: this.computeCryptoAmount,
          cryptoFiatRate: this.newCryptoFiatRate,
        }

        this.placeOrderAsync(payload)
      } else {
        let newOrder = {
          ...this.order,
          fiatAmount: this.computeFiatAmount,
          cryptoAmount: this.computeCryptoAmount,
          cryptoFiatRate: this.newCryptoFiatRate,
          expires: new Date().getTime() + 900000,
        }

        this.$store.commit('order/setOrderDetail', newOrder)

        newOrder.type = newOrder.orderType

        this.$cookiz.set('a2snXbe', newOrder)

        let timeNow = new Date()

        const timeLeft = this.order.expires - timeNow.getTime()
        this.$store.dispatch('order/setTotalTime', timeLeft)
        this.$emit('setIsRateChanged', false)
      }
    },
    isBtnDisabled() {
      if (
        this.order.orderType == 'buy' &&
        this.getDollarAmount() >= this.limits.minimumBuyUsd
      ) {
        return false
      } else if (
        this.order.orderType == 'sell' &&
        this.getDollarAmount() >= this.limits.minimumSellUsd
      ) {
        return false
      }
      return true
    },
    terminateSession() {
      this.$cookiz.remove('a2snXbe')
      this.$cookiz.remove('eJ6Ydkmr035')
      this.$cookiz.remove('ftyp5h2nl')
    },
    cancelTransaction() {
      this.terminateSession()
      this.$router.push('/order/start')
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-box {
  align-items: center;
}

.shift-left {
  right: 10px;
}
</style>
