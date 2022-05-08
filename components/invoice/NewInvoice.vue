<template>
  <div>
    <PaymentGuide2
      v-if="showPaymentInstruction()"
      @emitFetchDepositDetails="emitFetchDepositDetails"
      :fiatAmount="addOneNaira(info.fiatAmount + info.platformFee)"
      :fiatCurrency="info.fiatCurrency"
      :cryptoAmount="addPlatformFeeToSell()"
      :cryptoCurrency="info.cryptoCurrency"
      :orderType="info.type"
      :invoiceId="orderID"
    />
    <div v-else class="checkout checkout--no-min-height">
      <div class="invoice">
        <div
          class="invoice__header invoice__header--black invoice__header--new"
        >
          <div class="invoice__title-box">
            <div class="invoice__title-heading">
              <span class="heading-primary">INVOICE</span>
              <span class="invoice__status">UNPAID</span>
            </div>
            <p class="paragraph paragraph--sm m-0 u-mb-5">
              Invoice No.:
              <span class="paragraph--700">{{ orderID }}</span>
            </p>
            <p
              class="paragraph paragraph--sm invoice__see-order p-0 m-0"
              @click="$emit('setShowReview', true)"
            >
              See my order details
            </p>
          </div>
          <CheckoutTimer :timeLeft="timeLeft" :isCheckout="false" />
        </div>
        <div v-if="info.type == 'buy'">
          <!-- <HiddenInvoice /> -->
          <div class="invoice__body">
            <div class="u-d-flex">
              <span class="invoice__body-heading">YOUR PAYMENT DETAILS</span>
              <span v-if="!info.isOtc" class="invoice__loader-box">
                <span class="invoice__loader-dot invoice__loader-dot--1"></span>
                <span class="invoice__loader-dot invoice__loader-dot--2"></span>
                <span class="invoice__loader-dot invoice__loader-dot--3"></span>
              </span>
            </div>
            <template v-if="deposit">
              <div class="invoice__detail-item">
                <span class="invoice__detail-key">Bank Name</span>
                <span class="invoice__detail-value">{{
                  deposit.account.bankName
                }}</span>
              </div>
              <div class="invoice__detail-item">
                <span class="invoice__detail-key">Account Number</span>
                <span class="invoice__detail-value">{{
                  deposit.account.accountNumber
                }}</span>
              </div>
              <div
                v-if="info.fiatCurrency == 'ZAR'"
                class="invoice__detail-item"
              >
                <span class="invoice__detail-key">Branch Code</span>
                <span class="invoice__detail-value">250655</span>
              </div>
              <div class="invoice__detail-item">
                <span class="invoice__detail-key">Account Name</span>
                <span v-if="info.isOtc" class="invoice__detail-value">{{
                  deposit.account.accountName
                }}</span>
                <span v-else class="invoice__detail-value">{{
                  deposit.account.accountName
                }}</span>
              </div>
              <div class="invoice__detail-item">
                <span class="invoice__detail-key">Amount</span>
                <!-- <span v-if="info.isOtc" class="invoice__detail-value invoice__detail-value--em">{{ addOneNaira(info.fiatAmount) | formatMoney(info.fiatCurrency) }}</span> -->
                <span class="invoice__detail-value invoice__detail-value--em">{{
                  addOneNaira(deposit.account.amount)
                    | formatMoney(info.fiatCurrency)
                }}</span>
              </div>
            </template>

            <span v-if="!info.isOtc" class="invoice__waiting"
              >Please do not refresh this page. We would automatically detect
              when you make payment.</span
            >
            <span v-else class="invoice__waiting"
              >We are waiting for your payment. To get your wallet funded.
              Please kindly click the button below when you complete your
              payment</span
            >

            <div v-if="info.isOtc">
              <ButtonSpinner
                :is-loading="processing"
                :is-in-active="false"
                value="I have made payment"
                background="#053888"
                :on-submit="markOrderAsPaid"
              />
            </div>
          </div>
        </div>
        <div v-if="info.type == 'sell'">
          <div class="invoice__body">
            <!-- <span class="invoice__crypto-value">Crypto Value</span> -->
            <div class="chkout-card__detail-item u-mb-20">
              <span class="chkout-card__detail-key">Crypto Value</span>
              <span
                class="chkout-card__detail-coin-value u-ml-small u-pointer"
                v-tooltip="{
                  content: copyCryptoAmount,
                  show: copyCryptoAmount != '' ? true : false,
                  trigger: 'manual',
                  placement: 'top-center',
                }"
                v-clipboard="addPlatformFeeToSell()"
                v-clipboard:success="toggleCopyCryptoAmount"
              >
                <img
                  :src="getCryptoImage()"
                  alt="btc"
                  class="chkout-card__detail-coin-img"
                />
                <span>{{ addPlatformFeeToSell() }}</span>
              </span>
              <span v-if="!paid && !info.isOtc" class="invoice__loader-box">
                <span class="invoice__loader-dot invoice__loader-dot--1"></span>
                <span class="invoice__loader-dot invoice__loader-dot--2"></span>
                <span class="invoice__loader-dot invoice__loader-dot--3"></span>
              </span>
            </div>
            <div v-if="info.cryptoCurrency == 'USDT'">
              <NetworkSwitch2
                v-if="!showUSDTBarCode || qrLoading == true"
                :activeNetwork="activeNetwork"
                :items="usdtNetworks"
                @selectedNetwork="selectedNetwork"
              />
              <!-- <NetworkSwitch
                :activeNetwork="activeNetwork"
                :items="usdtNetworks"
                @selectedNetwork="selectedNetwork"
              /> -->
              <div v-else>
                <!-- <p class="paragraph u-fw-700 u-mb-20">DEPOSIT USDT</p> -->
                <p class="paragraph paragraph--sm u-fw-700 m-0">
                  <span>Network: {{ activeNetwork }}</span>
                  <span
                    class="change-network"
                    @click="setShowUSDTBarCode(false)"
                    >Change Network
                    <img src="/img/network-change.svg" alt="network change" />
                  </span>
                </p>
                <div class="invoice__qr-code-box">
                  <vue-qrcode
                    :value="networkAddress"
                    tag="img"
                    :options="{ width: 240 }"
                  />
                  <!-- v-if="qrFallback" -->
                  <!-- <img v-else :src="qrCode" class="invoice__qr-img u-mb-20" :alt="networkAddress" /> -->
                  <span class="paragraph paragraph--sm paragraph--600 u-mb-20"
                    >Scan with your Crypto Wallet app to pay</span
                  >
                  <div
                    class="invoice__copy-address u-mb-20"
                    v-tooltip="{
                      content: copyText,
                      show: copyText != '' ? true : false,
                      trigger: 'manual',
                      placement: 'top-center',
                    }"
                    v-clipboard="networkAddress"
                    v-clipboard:success="toggleCopyText"
                  >
                    <img src="/img/copy-icon.svg" alt="copy" />
                    <span
                      id="tp-1"
                      class="paragraph paragraph--sm paragraph--600"
                      >Copy wallet address</span
                    >
                  </div>
                </div>
                <div
                  class="invoice__sell-instruct invoice__sell-instruct--full invoice__sell-instruct--red u-mb-20"
                >
                  <span class="paragraph paragraph--sm"
                    >Click the button below after making your USDT deposit and
                    your bank account will be credited immediately deposit is
                    confirmed</span
                  >
                </div>
                <div>
                  <ButtonSpinner
                    :is-loading="processing"
                    :is-in-active="false"
                    value="I have deposited USDT"
                    background="#053888"
                    :on-submit="markOrderAsPaid"
                    setClass="u-mb-none"
                  />
                </div>
                <!-- <div v-else class="invoice__sell-instruct u-mb-20">
                  <span class="paragraph paragraph--sm paragraph--600">Please do not refresh this page. We would automatically detect when you make your Crypto deposit.</span>
                </div> -->
              </div>
            </div>
            <div v-else>
              <div class="invoice__qr-code-box">
                <vue-qrcode
                  :value="networkAddress"
                  tag="img"
                  :options="{ width: 240 }"
                />
                <!-- <img v-else :src="qrCode" class="invoice__qr-img u-mb-20" :alt="networkAddress" /> -->
                <span class="paragraph paragraph--sm paragraph--600 u-mb-20"
                  >Scan with your Crypto Wallet app to pay</span
                >
                <div
                  class="invoice__copy-address u-mb-20"
                  v-tooltip="{
                    content: copyText,
                    show: copyText != '' ? true : false,
                    trigger: 'manual',
                    placement: 'top-center',
                  }"
                  v-clipboard="networkAddress"
                  v-clipboard:success="toggleCopyText"
                >
                  <img src="/img/copy-icon.svg" alt="copy" />
                  <span id="tp-1" class="paragraph paragraph--sm paragraph--600"
                    >Copy wallet address</span
                  >
                  <!-- <b-tooltip
                    target="tp-1"
                    :title="copyText"
                    placement="top"
                    triggers="click"
                  >
                  </b-tooltip> -->
                  <!-- &nbsp; {{ copyText }} -->
                </div>
              </div>
              <div v-if="info.isOtc">
                <ButtonSpinner
                  :is-loading="processing"
                  :is-in-active="false"
                  value="I have made payment"
                  background="#053888"
                  :on-submit="markOrderAsPaid"
                />
              </div>
              <div v-else class="invoice__sell-instruct u-mb-20">
                <span class="paragraph paragraph--sm paragraph--600"
                  >Please do not refresh this page. We would automatically
                  detect when you make your Crypto deposit.</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
// import VTooltip from 'v-tooltip'
import { mapState } from 'vuex'
import formatMoney from '~/filters/format-money'
import NetworkSwitch from './NetworkSwitch.vue'

export default {
  components: {
    VueQrcode,
    NetworkSwitch,
  },
  filters: { formatMoney },
  props: {
    invoiceId: {
      type: String,
      default: '',
    },
    propProcessing: {
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    deposit: {
      type: Object,
      default: () => ({}),
    },
    timeLeft: {
      type: Number,
      default: 0,
    },
    qrFallback: {
      default: null,
    },
    qrCode: {
      default: null,
    },
    qrLoading: {
      default: false,
    },
    networkAddress: {
      default: null,
    },
    usdtNetworks: {
      type: Object,
      default: () => ({}),
    },
    activeNetwork: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      processing: false,
      copyText: '',
      copyCryptoAmount: '',
      showUSDTBarCode: false,
    }
  },
  computed: {
    ...mapState({
      coinsInfo: (state) => state.order.coinsInfo,
      orderID: (state) => state.invoice.orderID,
      info: (state) => state.invoice.info,
      paid: (state) => state.invoice.paid,
      step: (state) => state.invoice.step,
      instructionChecked: (state) => state.invoice.instructionChecked,
    }),
    minutes: function () {
      const minutes = Math.floor(this.timeLeft / 60)
      return this.padTime(minutes)
    },
    seconds: function () {
      const seconds = Math.floor(this.timeLeft - this.minutes * 60)
      return this.padTime(seconds)
    },
  },
  methods: {
    markOrderAsPaid() {
      // setProcessing(false)
      this.processing = true
      this.$emit('emitMarkOrderPaid', () => this.setProcessing(false))
      // this.processing = false
    },
    showPaymentInstruction() {
      if (!this.instructionChecked) {
        if (this.info.type == 'buy') {
          return true
        } else {
          if (!this.qrLoading) {
            return true
          } else {
            return false
          }
        }
      } else {
        return false
      }
    },
    emitFetchDepositDetails(callback) {
      this.$emit('emitFetchDepositDetails', () => {
        callback()
        this.$store.commit('invoice/setInstructionChecked', true)
      })
    },
    addOneNaira(amount) {
      const strip = Math.trunc(amount)
      return strip + 1
    },
    addPlatformFeeToSell() {
      const totalCrypto = this.info.cryptoAmount + this.info.platformFee
      const totalCryptoString =
        this.info.cryptoCurrency === 'USDT'
          ? totalCrypto.toFixed(3)
          : totalCrypto.toFixed(8)
      return parseFloat(totalCryptoString)
    },
    setProcessing(val) {
      this.processing = val
    },
    setShowUSDTBarCode(val) {
      this.showUSDTBarCode = val
    },
    toggleCopyText() {
      this.copyText = 'Copied'
      const vm = this
      setTimeout(() => {
        vm.copyText = ''
      }, 500)
    },
    toggleCopyCryptoAmount() {
      this.copyCryptoAmount = 'Copied'
      const vm = this
      setTimeout(() => {
        vm.copyCryptoAmount = ''
      }, 500)
    },
    padTime(time) {
      return (time < 10 ? '0' : '') + time
    },
    selectedNetwork(network) {
      this.$emit('selectedNetwork', network)
      this.showUSDTBarCode = true
    },
    getCryptoImage() {
      return this.coinsInfo.find(
        (coin) => coin.cur === this.info.cryptoCurrency
      ).flag
    },
  },
}
</script>

<style lang="scss">
.change-network {
  display: inline-block;
  color: #3382fa;
  margin-left: 10px;
  cursor: pointer;

  img {
    height: 12px;
  }
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
