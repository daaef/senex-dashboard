<template>
  <div class="checkout checkout--no-min-height">
    <div class="checkout__body">
      <div class="chkout-card__header u-mb-30">
        <h3 class="heading-primary m-0">ORDER REVIEW</h3>
        <CheckoutTimer :timeLeft="timeLeft" />
        <!-- <div class="chkout-card__header-time-box">
          <img
            src="/img/stopwatch.svg"
            alt="clock"
            class="chkout-card__header-clock"
          />
          <span class="chkout-card__header-time">{{ minutes }} : {{ seconds }}</span>
        </div> -->
      </div>
      <div class="u-mb-30">
        <div class="chkout-card__detail-item">
          <span class="chkout-card__detail-key">Assets</span>
          <span
            >{{ formatCryptoToFixed(order.cryptoAmount) }}
            {{ order.cryptoCurrency }}</span
          >
        </div>
        <div class="chkout-card__detail-item">
          <span class="chkout-card__detail-key">Price</span>
          <span>{{ order.fiatAmount | formatMoney(order.fiatCurrency) }}</span>
        </div>
        <div class="chkout-card__detail-item">
          <span class="chkout-card__detail-key">Eqv.</span>
          <!-- <span>$12,560</span> -->
          <span>{{
            (order.cryptoAmount * order.cryptoFiatRate).toFixed(2)
              | formatMoney('USD')
          }}</span>
        </div>
        <div class="chkout-card__detail-item">
          <span class="chkout-card__detail-key">Ex. Rate</span>
          <!-- <span>N 475/$</span> -->
          <span
            >{{
              (
                order.fiatAmount /
                (order.cryptoAmount * order.cryptoFiatRate)
              ).toFixed(2) | formatMoney(order.fiatCurrency)
            }}/$</span
          >
          <span class="chkout-card__detail-coin-value">
            <img
              :src="getCryptoImage()"
              alt="btc"
              class="chkout-card__detail-coin-img"
            />
            <span>{{ oneCryptoToDollar() | formatMoney('USD') }}</span>
          </span>
        </div>
        <div class="chkout-card__detail-item">
          <span class="chkout-card__detail-key">Fee</span>
          <!-- <span>$12,560</span> -->
          <span v-if="order.type == 'buy'">{{
            order.platformFee | formatMoney(order.fiatCurrency)
          }}</span>
          <span v-else
            >{{ formatCryptoToFixed(order.platformFee) }}
            {{ order.cryptoCurrency }}</span
          >
        </div>
      </div>
      <div class="u-mb-30">
        <p class="fw-700 u-mb-10">Beneficiary Details</p>
        <template v-if="order.type == 'buy'">
          <!-- <p class="paragraph u-mb-10 u-text-uppercase">{{ beneficiary.walletLabel }}</p> -->
          <!-- <p class="paragraph u-mb-10">( {{ order.walletAddress }} )</p> -->
          <p class="paragraph u-mb-10 u-pointer">
            <span class="address-bracket">( </span>
            <span
              class="truncate-address"
              v-tooltip="{
                content: order.walletAddress,
                placement: 'top-center',
              }"
              v-clipboard="order.walletAddress"
              v-clipboard:success="'Copied'"
              >{{ order.walletAddress }}</span
            >
            <span class="address-bracket"> )</span>
          </p>
        </template>
        <template v-else>
          <p class="paragraph u-mb-10 u-text-uppercase">
            {{ order.accountName }}
          </p>
          <p class="paragraph u-mb-10">
            ({{ order.accountNumber }} {{ getBank().label }})
          </p>
        </template>
      </div>
      <div class="u-mt-auto">
        <!-- <p class="paragraph blue-text u-mb-20">
          Please confirm that the above details are correct. Payments made cannot be reversed.
        </p> -->
        <ButtonSpinner
          :on-submit="closeReview"
          :is-in-active="false"
          value="Close"
          background="#053888"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import formatMoney from '~/filters/format-money'
import banks from '@/data/allBanks.js'
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'

export default {
  props: {
    beneficiary: {
      type: Object,
      default: () => ({}),
    },
    order: {
      type: Object,
      default: () => ({}),
    },
    timeLeft: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      initialGuideImage: '',
    }
  },
  mounted() {
    this.initialGuideImage = this.guideImage
    this.$store.commit('invoice/setGuideImage', 'blue-image')
  },
  filters: { formatMoney },
  computed: {
    minutes: function () {
      const minutes = Math.floor(this.timeLeft / 60)
      return this.padTime(minutes)
    },
    seconds: function () {
      const seconds = Math.floor(this.timeLeft - this.minutes * 60)
      return this.padTime(seconds)
    },
    ...mapState({
      //order: state => state.order.orderDetail,
      coinsInfo: (state) => state.order.coinsInfo,
      totalTime: (state) => state.order.totalTime,
      guideImage: (state) => state.invoice.guideImage,
    }),
  },
  methods: {
    padTime(time) {
      return (time < 10 ? '0' : '') + time
    },
    getCryptoImage() {
      return this.coinsInfo.find(
        (coin) => coin.cur === this.order.cryptoCurrency
      ).flag
    },
    formatCryptoToFixed(amount) {
      if (typeof amount === 'string') {
        amount = parseFloat(amount)
      }
      return this.order.cryptoCurrency === 'USDT'
        ? amount.toFixed(3)
        : amount.toFixed(8)
    },
    oneCryptoToDollar() {
      const val = this.order.cryptoFiatRate
      return val
    },
    backBtn() {
      return {
        ...backBtn,
        isInActive: false,
        onSubmit: () => {
          this.$emit('controlShowReview', false)
        },
      }
    },
    continueBtn() {
      return {
        ...continueBtn,
        isInActive: false,
        // isLoading: this.processing,
        onSubmit: () => {
          this.$emit('placeOrder')
        },
      }
    },
    getBank() {
      const bank = banks[this.order.fiatCurrency].find(
        (x) => x.value === this.order.bank
      )
      if (!bank) {
        return {
          value: '',
          label: '',
        }
      } else {
        return bank
      }
    },
    closeReview() {
      this.$store.commit('invoice/setGuideImage', this.initialGuideImage)
      this.$emit('setShowReview', false)
    },
  },
}
</script>

<style>
.blue-text {
  color: #3382fa;
}
</style>
