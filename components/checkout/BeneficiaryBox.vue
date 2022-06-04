<template>
  <div class="checkout">
    <!-- <template v-if="totalTime == 0">
      <RateChange />
    </template> -->
    <template v-if="showReview">
      <OrderReview
        :beneficiary="orderData"
        @controlShowReview="controlShowReview"
        @placeOrder="placeOrder"
        :processing="processing"
      />
    </template>
    <template v-else>
      <Checkout />
      <div class="checkout__body u-flex-1 u-rela">
        <ListPopUp v-if="!savedTab" :open="openPopUp" :list="getPopUpList()" />
        <ListPopUpBeneficiary
          v-else
          :open="openPopUp"
          :isBuying="order.orderType === 'buy'"
          :list="getPopUpList()"
          @addNewBeneficiary="addNewBeneficiary"
        />
        <template class="">
          <h6 class="paragraph">Choose your beneficiary type</h6>
          <div class="chkout-acc">
            <div
              class="chkout-acc__select-box chkout-acc__select-box--80 u-mb-40"
            >
              <div
                class="chkout-acc__select-btn"
                :class="[savedTab ? 'chkout-acc__select-btn--active' : '']"
                @click="selectSaved()"
              >
                Saved Beneficiary
              </div>
              <div
                class="chkout-acc__select-btn"
                :class="[!savedTab ? 'chkout-acc__select-btn--active' : '']"
                @click="selectNew()"
              >
                New Beneficiary
              </div>
              <span
                class="chkout-acc__glider"
                :class="[
                  savedTab ? 'chkout-acc__glider--1' : 'chkout-acc__glider--2',
                ]"
              ></span>
            </div>
          </div>
          <div v-if="savedTab">
            <SavedBeneficiary
              @placeOrder="placeOrder"
              @getOrderData="getOrderData"
            />
          </div>
          <div v-else>
            <NewBeneficiary
              @placeOrder="placeOrder"
              @getOrderData="getOrderData"
            />
          </div>
        </template>
        <vue-final-modal
          v-if="signedIn == 2"
          id="order-limit"
          v-model="isLimitExceeded"
        >
          <div class="benef-overlay container">
            <OrderLimitExceeded />
          </div>
        </vue-final-modal>
        <vue-final-modal
          v-if="signedIn == 2"
          id="verify-secret"
          v-model="openModal"
        >
          <div class="benef-overlay container">
            <TwoFactor
              @controlModal="controlModal"
              @controlShowReview="controlShowReview"
              @placeOrder="placeOrder"
              :mobile="user.profile.user.mobile"
              :processing.sync="processing"
            />
          </div>
        </vue-final-modal>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import banks from '@/data/allBanks.js'
import getDeviceInfo from '@/data/getDeviceInfo.js'

export default {
  data() {
    return {
      loading: false,
      savedTab: true,
      processing: false,
      openModal: false,
      orderData: {},
      showReview: false,
      isLimitExceeded: false,
      // beneficiaries: [],
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState({
      order: (state) => state.order.orderDetail,
      openPopUp: (state) => state.order.openListPopUp,
      signedIn: (state) => state.order.signedIn,
      userInfo: (state) => state.order.userInfo,
      totalTime: (state) => state.order.totalTime,
      // showReview: state => state.order.showReview
    }),
  },
  beforeMount() {
    this.$store.commit('order/setIsCheckoutCardOpen', false)
    this.checkOrderLimit()
  },
  mounted() {
    if (this.signedIn == 2) {
      if (!this.isLimitExceeded) {
        // this.openModal = true
      }
    } else {
      this.savedTab = false
    }
    this.$store.commit('order/changeCurrentOrderStep', 3)
    this.fetchBeneficiaries()
    // setTimeout(() => {
    //   this.fetchBeneficiaries()
    // }, 3000)
  },
  methods: {
    selectSaved() {
      this.savedTab = true
    },
    selectNew() {
      this.savedTab = false
    },
    addNewBeneficiary() {
      this.selectNew()
    },
    controlModal(val) {
      this.openModal = val
    },
    controlProcessing(val) {
      this.processing = val
    },
    controlShowReview(val) {
      this.showReview = val
    },
    getPopUpList() {
      if (!this.savedTab) {
        // console.log(this.order.fiatCurrency, banks[this.order.fiatCurrency])
        return banks[this.order.fiatCurrency]
      } else {
        if (this.order.orderType === 'buy') {
          return this.$store.state.order.beneficiaries.filter(
            (x) =>
              x.currency.toLowerCase() ==
              this.order.cryptoCurrency.toLowerCase()
          )
        } else {
          return this.$store.state.order.beneficiaries.filter(
            (x) =>
              x.currency.toLowerCase() == this.order.fiatCurrency.toLowerCase()
          )
        }
        // return this.$store.state.order.beneficiaries //this.beneficiaries
      }
    },
    checkOrderLimit() {
      if (this.signedIn == 1) {
        return
      }
      this.loading = true
      const payload = {
        email: this.user.profile.user.email,
        cryptoAmount: this.order.cryptoAmount,
        type: this.order.orderType,
        rate: this.order.cryptoFiatRate,
        cryptoCurrency: this.order.cryptoCurrency,
        fiatCurrency: this.order.fiatCurrency,
      }

      this.$axios
        .post('/kyc/check', payload)
        .then((res) => {
          // popup login and change mode
          this.isLimitExceeded = false
          this.openModal = true
          this.loading = false
        })
        .catch((err) => {
          const {
            response: { data, status },
          } = err

          if (status === 400) {
            if (data.isUser) {
              this.errorMessage = data.message
              if (data.message && data.message.includes('limit exceeded'))
                this.isLimitExceeded = true
              this.openModal = false
              return
            }
          }
          this.openModal = false
          this.loading = false
        })
    },
    async fetchBeneficiaries() {
      // if (!this.order.orderType) {
      //   return
      // }
      if (this.signedIn == 2) {
        try {
          const { data } = await this.$api.getRecipients({
            type: this.order.orderType,
          })
          if (this.order.orderType === 'buy') {
            const beneficiaries = data.wallets.data ? data.wallets.data : []
            // const filteredBenef = beneficiaries.filter(x => x.currency.toLowerCase() == this.order.cryptoCurrency.toLowerCase())
            this.$store.commit('order/setBeneficiaries', beneficiaries)
          } else {
            const beneficiaries = data.bankAccounts.data
              ? data.bankAccounts.data
              : []
            // const filteredBenef = beneficiaries.filter(x => x.currency.toLowerCase() == this.order.fiatCurrency.toLowerCase())
            this.$store.commit('order/setBeneficiaries', beneficiaries)
          }
        } catch (e) {
          // console.log(e)
          this.fetchBeneficiaries()
        }
      }
    },
    terminateSession() {
      this.$cookiz.remove('a2snXbe')
      this.$cookiz.remove('eJ6Ydkmr035')
      this.$cookiz.remove('ftyp5h2nl')
    },
    getOrderData(data) {
      this.orderData = data
      // if (this.signedIn == 2) {
      //   this.openModal = true
      // }
      this.controlShowReview(true)
      // this.openModal = true
    },
    async placeOrder() {
      this.processing = true
      this.$store.commit('order/changeLoading', {
        show: true,
        text: 'Placing order...',
      })
      let userDetails = {}
      if (this.signedIn == 1) {
        userDetails = this.userInfo
      } else if (this.signedIn == 2) {
        userDetails = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          mobileNumber: this.user.mobileNumber,
        }
      }

      let platformFeeA =
        ((this.order.platformFee / 100) * this.order.fiatAmount) /
        this.order.usdToFiat[this.order.orderType]

      platformFeeA = platformFeeA.toFixed(2)

      if (platformFeeA > platformFeeCap) {
        platformFeeA = platformFeeCap
      }

      const payload = {
        type: this.order.orderType,
        ...this.order,
        ...userDetails,
        ...this.orderData,
        fiatAmount: parseFloat(this.order.fiatAmount),
        cryptoAmount: parseFloat(this.order.cryptoAmount),
        deviceInfo: await getDeviceInfo(this.user.email),
      }
      // payload.deviceInfo = this.getDeviceInfo()
      // payload.fiatCurrency = payload.fiatCurrency

      const {
        recaptcha,
        expires,
        usdToFiat,
        fiatSymbol,
        platformFee,
        platformFeeCap,
        orderType,
        ...payloadA
      } = payload
      // payloadA.fiatAmount = parseFloat(payload.fiatAmount)
      // payloadA.cryptoAmount = parseFloat(payload.cryptoAmount)
      // payloadA.platformFee = platformFeeA

      this.$store.commit('order/setPlaceOrder', payloadA)
      this.$store.commit('order/setHasTriedPlacingOrder', true)
      try {
        const { data } = await this.$api.postTrade(payloadA)
        setTimeout(() => {
          this.openModal = false
          this.$router.push(`/invoice/${data.id}`)
        }, 1000)
        if (this.signedIn == 1) {
          this.$ga.event({
            eventCategory: 'Checkout place order',
            eventAction: 'place-order-and-create-account',
            eventLabel: `Place order by new user`,
            eventValue: 1,
          })
        }
        this.terminateSession()
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
      // cb()
    },
    getDeviceInfo() {
      const client = new window.ClientJS()

      return {
        userAgent: client.getUserAgent(),
        browser: client.getBrowser(),
        os: client.getOS(),
        device: client.getDevice(),
        deviceType: client.getDeviceType(),
        deviceVendor: client.getDeviceVendor(),
        cpu: client.getCPU(),
        fingerprint: '' + client.getFingerprint(),
        timezone: client.getTimeZone(),
        language: client.getLanguage(),
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
