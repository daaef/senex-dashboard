<template>
  <div class="checkout">
    <div class="checkout__body">
      <div class="chkout-card__header u-mb-30">
        <h3 class="heading-primary m-0">ORDER REVIEW</h3>
        <CheckoutTimer :timeLeft="totalTime" />
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
            >{{ order.fiatSymbol
            }}{{ order.usdToFiat[order.orderType] }}/$</span
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
          <span v-if="order.orderType == 'buy'">{{
            getPlatformFee() | formatMoney(order.fiatCurrency)
          }}</span>
          <span v-else
            >{{ getPlatformFeeSell() }} {{ order.cryptoCurrency }}</span
          >
        </div>
      </div>
      <div class="u-mb-30">
        <p class="paragraph paragraph--700 u-mb-10">Beneficiary Details</p>
        <template v-if="order.orderType == 'buy'">
          <p class="paragraph u-mb-10 u-text-uppercase">
            {{ beneficiary.walletLabel }}
          </p>
          <p class="paragraph u-mb-10 u-pointer">
            <span class="address-bracket">( </span>
            <span
              class="truncate-address"
              v-tooltip="{
                content: beneficiary.walletAddress,
                placement: 'top-center',
              }"
              v-clipboard="beneficiary.walletAddress"
              >{{ beneficiary.walletAddress }}</span
            >
            <span class="address-bracket"> )</span>
          </p>
        </template>
        <template v-else>
          <p class="paragraph u-mb-10 u-text-uppercase">
            {{ beneficiary.accountName }}
          </p>
          <p class="paragraph u-mb-10">
            ({{ beneficiary.accountNumber }}) {{ beneficiary.bankLabel }}
          </p>
        </template>
      </div>
      <div>
        <p class="paragraph blue-text u-mb-20">
          Please confirm that the above details are correct. Payments made
          cannot be reversed.
        </p>
        <CheckoutButtonSet
          :down="true"
          :left="backBtn()"
          :right="continueBtn()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import formatMoney from '~/filters/format-money'
import backBtn from '@/data/defaultBackButton.js'
import continueBtn from '@/data/defaultContinueButton.js'
import banks from '@/data/allBanks.js'

export default {
  props: {
    beneficiary: {
      type: Object,
      default: () => ({}),
    },
    processing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // processing: false
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
      coinsInfo: (state) => state.order.coinsInfo,
      totalTime: (state) => state.order.totalTime,
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
    getPlatformFeeSell() {
      let platformFee = (this.order.platformFee / 100) * this.order.cryptoAmount //sellUsdAmount
      let platformFeeCap = this.order.platformFeeCap / this.order.cryptoFiatRate
      // console.log('platformFeeCap', platformFeeCap, platformFee)
      if (platformFee > platformFeeCap) {
        platformFee = platformFeeCap
      }

      return this.formatCryptoToFixed(platformFee)
    },
    getPlatformFee() {
      let platformFeeA = (this.order.platformFee / 100) * this.order.fiatAmount // / this.order.usdToFiat[this.order.orderType]

      let platformFeeCap =
        this.order.platformFeeCap * this.order.usdToFiat[this.order.orderType]

      // platformFeeA = platformFeeA.toFixed(2)

      // console.log(platformFeeA, this.order.platformFee, this.order.platformFeeCap, platformFeeCap, this.order.fiatAmount, this.order.usdToFiat[this.order.orderType])

      if (platformFeeA > platformFeeCap) {
        platformFeeA = platformFeeCap
      }

      return platformFeeA
    },
    oneCryptoToDollar() {
      const val = (
        this.order.fiatAmount /
        this.order.usdToFiat[this.order.orderType] /
        this.order.cryptoAmount
      ).toFixed(2)

      return val
    },
    formatCryptoToFixed(amount) {
      if (typeof amount === 'string') {
        amount = parseFloat(amount)
      }
      // amount = parseFloat(amount)
      return this.order.cryptoCurrency === 'USDT'
        ? amount.toFixed(3)
        : amount.toFixed(8)
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
        isLoading: this.processing,
        onSubmit: this.onContinue,
      }
    },
    onContinue() {
      // this.processing = true
      this.$emit('placeOrder')
    },
    getBankLabel() {
      return banks[this.order.fiatCurrency]
    },
  },
}
</script>

<style lang="scss">
.blue-text {
  color: #3382fa;
}

.truncate-address {
  display: inline-block;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.address-bracket {
  display: inline-block;
  max-width: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: #838384;
    color: white;
    border-radius: 6px;
    padding: 5px 10px 4px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: #838384;
    z-index: 1;
  }

  &[x-placement^='top'] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='bottom'] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='right'] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^='left'] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
}
</style>
